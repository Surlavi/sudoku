import {Coordinates, ResolvingCellState} from './types.js';
import {ResolvingBoard} from './resolve.js';
import * as theme from './theme.js';
import * as internal from 'stream';

interface LineStyle {
  color: string;
  width?: number;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: LineStyle,
): void {
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.width ? style.width : 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function getCanvas2DContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  return canvas.getContext('2d')!;
}

function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = getCanvas2DContext(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export enum MoveDirection {
  UP,
  DOWN,
  RIGHT,
  LEFT,
}

export interface Config {
  // Size of the canvas.
  size: number;

  // Highlight the neighbors of the focused cell.
  highlightNeighbors: boolean;

  // Highlight the cells containing the focused number.
  highlightByNumber: boolean;

  // Highlight the all neighbors of the focused number.
  highlightNeighborsByNumber: boolean;
}

export class BoardUi {
  private config!: Config;
  private readonly container: HTMLElement;

  private gameBoard: ResolvingBoard;

  private gridCanvas!: HTMLCanvasElement;
  private numbersCanvas!: HTMLCanvasElement;
  // The canvas layer for displaying cursor.
  private cursorCanvas!: HTMLCanvasElement;
  // The canvas layer for handling mouse event.
  private clickCanvas!: HTMLCanvasElement;

  cursorCoord: Coordinates | null = null;

  constructor(
    container: HTMLElement,
    gameBoard: ResolvingBoard,
    config: Config,
  ) {
    this.container = container;
    this.gameBoard = gameBoard;
    this.updateConfig(config);
  }

  private getTheme(): theme.Theme {
    return theme.getCurrentTheme();
  }

  private getCellSize(): number {
    return this.config.size / 11;
  }

  private getCanvasPosForIdx(index: number): number {
    return this.getCellSize() * (index + 1);
  }

  private getIdxForCanvasPos(pos: number): number | null {
    for (let i = 0; i < 9; ++i) {
      if (
        pos < this.getCanvasPosForIdx(i + 1) &&
        pos > this.getCanvasPosForIdx(i)
      ) {
        return i;
      }
    }
    return null;
  }

  updateBoard(): void {
    this.redrawNumbers();
  }

  updateConfig(config: Config): void {
    this.config = config;

    // Remove all children at first.
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.gridCanvas = this.createCanvas(1);
    this.numbersCanvas = this.createCanvas(2);
    this.cursorCanvas = this.createCanvas(3);
    this.clickCanvas = this.createCanvas(4);

    this.redrawGrid();
    this.redrawNumbers();
    this.clickCanvas.addEventListener('click', (ev: MouseEvent) => {
      const rect = this.clickCanvas.getBoundingClientRect();
      const x = this.getIdxForCanvasPos(ev.clientX - rect.left);
      const y = this.getIdxForCanvasPos(ev.clientY - rect.top);
      // Reset cursor if the click is out of bound.
      if (x === null || y === null) {
        this.setCursor(null);
      } else {
        this.setCursor(new Coordinates(x, y));
      }
    });
  }

  setCursor(coord: Coordinates | null): void {
    console.log('Set cursor to %s', coord);

    // TODO: If the pos did not change, we can skip the following logic.
    this.cursorCoord = coord;
    this.redrawCursor();
  }

  moveCursor(d: MoveDirection) {
    if (!this.cursorCoord) return;
    let x = this.cursorCoord.x;
    let y = this.cursorCoord.y;
    switch (d) {
      case MoveDirection.UP:
        y -= 1;
        break;
      case MoveDirection.DOWN:
        y += 1;
        break;
      case MoveDirection.LEFT:
        x -= 1;
        break;
      case MoveDirection.RIGHT:
        x += 1;
        break;
    }
    if (x < 9 && x >= 0 && y < 9 && y >= 0) {
      this.setCursor(new Coordinates(x, y));
    }
  }

  private createCanvas(zIndex: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.config.size;
    canvas.height = this.config.size;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = `${zIndex}`;
    this.container.appendChild(canvas);
    return canvas;
  }

  private redrawGrid(): void {
    const ctx = this.gridCanvas.getContext('2d');
    if (!ctx) {
      console.error('Context not available');
      return;
    }

    const startPos = this.getCanvasPosForIdx(0);
    const endPos = this.getCanvasPosForIdx(9);
    const style: LineStyle = {color: this.getTheme().color_prefilled};
    for (let i = 0; i <= 9; i++) {
      const pos = this.getCanvasPosForIdx(i);
      drawLine(ctx, startPos, pos, endPos, pos, style);
      drawLine(ctx, pos, startPos, pos, endPos, style);
    }
  }

  private redrawNumbers(): void {
    if (!this.gameBoard) {
      return;
    }

    const ctx = this.numbersCanvas.getContext('2d');
    if (!ctx) {
      console.error('Context not available');
      return;
    }

    clearCanvas(this.numbersCanvas);

    const drawNumber = (
      val: number,
      coord: Coordinates,
      small: boolean,
      color: string,
    ) => {
      const boxSize = this.getCellSize() / (small ? 3 : 1);
      const fontSize = boxSize * 0.8;
      let x = this.getCanvasPosForIdx(coord.x) + boxSize / 2;
      let y = this.getCanvasPosForIdx(coord.y) + boxSize / 2 + fontSize * 0.07;
      if (small) {
        x += Math.floor((val - 1) % 3) * boxSize;
        y += Math.floor((val - 1) / 3) * boxSize;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;
      ctx.fillText(val.toString(), x, y);
    };

    for (const cell of this.gameBoard.cells) {
      if (cell.state === ResolvingCellState.PREFILLED) {
        drawNumber(
          cell.value!,
          cell.coordinate,
          false,
          this.getTheme().color_prefilled,
        );
      }
      if (cell.state === ResolvingCellState.RESOLVED) {
        drawNumber(
          cell.value!,
          cell.coordinate,
          false,
          this.getTheme().color_resolved,
        );
      }
      if (cell.state === ResolvingCellState.RESOLVING) {
        for (let i = 1; i <= 9; ++i) {
          if (cell.draftNumbers.has(i)) {
            drawNumber(i, cell.coordinate, true, this.getTheme().color_draft);
          }
        }
      }
    }
  }

  private redrawCursor(): void {
    const ctx = getCanvas2DContext(this.cursorCanvas);

    // Clear the current drawing at first.
    clearCanvas(this.cursorCanvas);

    const coord = this.cursorCoord;

    if (coord === null) return;

    // Redraw cursor box.
    const x1 = this.getCanvasPosForIdx(coord.x);
    const x2 = this.getCanvasPosForIdx(coord.x + 1);
    const y1 = this.getCanvasPosForIdx(coord.y);
    const y2 = this.getCanvasPosForIdx(coord.y + 1);
    const style: LineStyle = {
      color: this.getTheme().color_highlight_foreground,
      width: 3,
    };
    drawLine(ctx, x1, y1, x2, y1, style);
    drawLine(ctx, x1, y2, x2, y2, style);
    drawLine(ctx, x1, y1, x1, y2, style);
    drawLine(ctx, x2, y1, x2, y2, style);
  }
}
