import {
  Cell,
  Coordinates,
  mergeCellLists,
  ResolvingCellState,
} from './types.js';
import {ResolvingBoard} from './resolve.js';
import * as theme from './theme.js';

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

const CANVAS_MARGIN = 5;

export interface Config {
  // Size of the canvas.
  size: number;

  // Highlight the neighbors of the focused cell.
  highlightCursorNeighbors: boolean;

  // Highlight the cells containing the focused number.
  highlightNumber: boolean;

  // Highlight the all neighbors of the focused number.
  highlightNumberNeighbors: boolean;
}

const VIRTUAL_KB_HTML = `
<div>
  <label class="switch">
    <input type="checkbox" id="kb-draft-mode-switch" checked="true">
    <span class="slider"></span>
  </label>
  <span>Draft mode</span>
</div>
<div div class="keyboard" id="keyboard"></div>
`;

type KeyInputCallback = (value: number, draftMode: boolean) => void;
class VirtualKeyboard {
  private readonly cb: KeyInputCallback;
  private readonly container: HTMLElement;

  private width: number;
  private height: number;

  constructor(container: HTMLElement, keyInputCallback: KeyInputCallback) {
    this.container = container;
    container.setHTMLUnsafe(VIRTUAL_KB_HTML);
    this.cb = keyInputCallback;

    const keyboard = document.getElementById('keyboard')!;
    const keyboardDraftModeSwitch = document.getElementById(
      'kb-draft-mode-switch',
    ) as HTMLInputElement;
    for (let i = 1; i <= 9; i++) {
      const key = document.createElement('div');
      key.classList.add('key');
      key.textContent = `${i}`;
      key.dataset['value'] = `${i}`;
      key.addEventListener('click', ev => {
        ev.preventDefault();
        this.cb(i, keyboardDraftModeSwitch.checked);
      });
      keyboard.appendChild(key);
    }

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.hide();
  }

  show(boardUi: BoardUi, coord: Coordinates) {
    // Calculate the location.
    const w = this.width;
    const h = this.height;

    const x1 = boardUi.getCanvasPosForIdx(coord.x);
    const x2 = boardUi.getCanvasPosForIdx(coord.x + 1);
    const y1 = boardUi.getCanvasPosForIdx(coord.y);

    const MARGIN = 3;

    const x = x1 - w - MARGIN > 0 ? x1 - w - MARGIN : x2 + MARGIN;
    const y = y1 + h < boardUi.config.size ? y1 + 40 : boardUi.config.size - h;

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;

    // Hide unavailable numbers.
    const availableNumbers =
      boardUi.gameBoard.getAvailableNumbersForCell(coord);
    const keyboard = document.getElementById('keyboard')!;
    keyboard.childNodes.forEach(node => {
      const dom = node as HTMLElement;
      const value = parseInt(dom.dataset['value']!);
      if (availableNumbers.has(value)) {
        dom.style.opacity = '1';
      } else {
        dom.style.opacity = '0';
      }
    });

    // Show it.
    this.container.style.display = 'block';
    console.log('display virtual keyboard at (%d, %d)', x, y);
  }

  hide(animation = false) {
    console.log('hide virtual keyboard');
    this.container.style.display = 'none';
  }
}

export class BoardUi {
  config!: Config;
  private readonly container: HTMLElement;

  gameBoard: ResolvingBoard;

  private readonly virtualKeyboard: VirtualKeyboard;

  private gridCanvas!: HTMLCanvasElement;
  private neighHighlightCanvas!: HTMLCanvasElement;
  private numberHighlightCanvas!: HTMLCanvasElement;
  // The canvas layer for displaying numbers.
  private numbersCanvas!: HTMLCanvasElement;
  // The canvas layer for displaying cursor.
  private cursorCanvas!: HTMLCanvasElement;
  // The canvas layer for handling mouse event.
  private clickCanvas!: HTMLCanvasElement;

  cursorCoord: Coordinates | null = null;

  focusedNumber: number | null = null;

  constructor(
    container: HTMLElement,
    gameBoard: ResolvingBoard,
    virtualKeyboardContainer: HTMLElement,
    digitInputCallback: KeyInputCallback,
    config: Config,
  ) {
    this.container = container;
    this.gameBoard = gameBoard;
    this.virtualKeyboard = new VirtualKeyboard(
      virtualKeyboardContainer,
      (v, b) => {
        // Do not hide in draft mode.
        if (!b) {
          this.virtualKeyboard.hide();
        }
        digitInputCallback(v, b);
      },
    );
    this.updateConfig(config);
  }

  private getTheme(): theme.Theme {
    return theme.getCurrentTheme();
  }

  private getCellSize(): number {
    return (this.config.size - CANVAS_MARGIN * 2) / 9;
  }

  getCanvasPosForIdx(index: number): number {
    return CANVAS_MARGIN + this.getCellSize() * index;
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
    this.redrawHighlight();
  }

  updateConfig(config: Config): void {
    this.config = config;

    // Remove all children at first.
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.numberHighlightCanvas = this.createCanvas(1);
    this.neighHighlightCanvas = this.createCanvas(2);
    this.gridCanvas = this.createCanvas(3);
    this.numbersCanvas = this.createCanvas(4);
    this.cursorCanvas = this.createCanvas(5);
    this.clickCanvas = this.createCanvas(6);

    this.redrawGrid();
    this.redrawNumbers();
    this.clickCanvas.addEventListener('click', (ev: MouseEvent) => {
      this.virtualKeyboard.hide();
      const rect = this.clickCanvas.getBoundingClientRect();
      const x = this.getIdxForCanvasPos(ev.clientX - rect.left);
      const y = this.getIdxForCanvasPos(ev.clientY - rect.top);
      // Reset cursor if the click is out of bound.
      if (x === null || y === null) {
        this.updateCursor(null);
      } else {
        const coord = new Coordinates(x, y);
        this.updateCursor(coord);

        // If the cell is empty, show keyboard.
        if (this.gameBoard.getCellByCoord(coord).value === null) {
          this.virtualKeyboard.show(this, coord);
        }
      }
    });
    this.clickCanvas.addEventListener('dblclick', (ev: MouseEvent) => {
      const rect = this.clickCanvas.getBoundingClientRect();
      const x = this.getIdxForCanvasPos(ev.clientX - rect.left);
      const y = this.getIdxForCanvasPos(ev.clientY - rect.top);
      // Reset cursor if the click is out of bound.
      if (x === null || y === null) {
        this.updateFocusedNumber(null);
      } else {
        const cell = this.gameBoard.getCellByCoord(new Coordinates(x, y));
        // Allow double click to cancel selection.
        this.updateFocusedNumber(
          cell.value === this.focusedNumber ? null : cell.value,
        );
      }
    });
  }

  updateCursor(coord: Coordinates | null): void {
    console.log('Set cursor to %s', coord);

    // TODO: If the pos did not change, we can skip the following logic.
    this.cursorCoord = coord;
    this.redrawCursor();
    this.redrawHighlight();
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
      this.updateCursor(new Coordinates(x, y));
    }
  }

  updateFocusedNumber(value: number | null) {
    this.focusedNumber = value;
    this.redrawHighlight();
    this.redrawNumbers();
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

  private redrawHighlight(): void {
    clearCanvas(this.neighHighlightCanvas);
    clearCanvas(this.numberHighlightCanvas);

    const highlightCell = (
      ctx: CanvasRenderingContext2D,
      coord: Coordinates,
      color: string,
    ) => {
      const x = this.getCanvasPosForIdx(coord.x);
      const y = this.getCanvasPosForIdx(coord.y);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, this.getCellSize(), this.getCellSize());
    };

    const highlightDraftCell = (
      ctx: CanvasRenderingContext2D,
      coord: Coordinates,
      value: number,
      color: string,
    ) => {
      const boxSize = this.getCellSize() / 3;
      const x =
        this.getCanvasPosForIdx(coord.x) +
        Math.floor((value - 1) % 3) * boxSize;
      const y =
        this.getCanvasPosForIdx(coord.y) +
        Math.floor((value - 1) / 3) * boxSize;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, boxSize, boxSize);
    };

    const cursor = this.cursorCoord;
    if (cursor && this.config.highlightCursorNeighbors) {
      const ctx = getCanvas2DContext(this.neighHighlightCanvas);
      const cells = this.gameBoard.getCellsByNeighborToCoord(cursor);
      for (const cell of cells) {
        highlightCell(
          ctx,
          cell.coordinate,
          this.getTheme().color_highlight_bg1,
        );
      }
    }

    if (
      this.focusedNumber !== null &&
      (this.config.highlightNumberNeighbors || this.config.highlightNumber)
    ) {
      const ctx = getCanvas2DContext(this.numberHighlightCanvas);
      const numberCells = this.gameBoard.cells.filter((c: Cell) => {
        return c.value === this.focusedNumber;
      });
      let cells: ReadonlyArray<Cell> = numberCells.slice();
      if (this.config.highlightNumberNeighbors) {
        const cellArrays = numberCells.map((c: Cell) => {
          return this.gameBoard.getCellsByNeighborToCoord(c.coordinate);
        });
        cells = mergeCellLists(cellArrays);
      }
      for (const cell of cells) {
        highlightCell(
          ctx,
          cell.coordinate,
          this.getTheme().color_highlight_bg2,
        );
      }

      // Also highlight all draft values.
      for (const cell of this.gameBoard.cells) {
        if (cell.hasDraftNumber(this.focusedNumber)) {
          highlightDraftCell(
            ctx,
            cell.coordinate,
            this.focusedNumber,
            this.getTheme().color_highlight_bg2,
          );
        }
      }
    }
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
    const sqrBorderStyle: LineStyle = {
      color: this.getTheme().color_prefilled,
      width: 3,
    };
    for (let i = 0; i <= 9; i++) {
      const pos = this.getCanvasPosForIdx(i);
      drawLine(ctx, startPos, pos, endPos, pos, i % 3 ? style : sqrBorderStyle);
      drawLine(ctx, pos, startPos, pos, endPos, i % 3 ? style : sqrBorderStyle);
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
