import {Cell, Coordinates, mergeCellLists, SolvingCellState} from './types.js';
import {SolvingBoard} from './solve.js';
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
<div id="draft-mode-line">
  <label class="switch">
    <input type="checkbox" id="kb-draft-mode-switch" checked="true">
    <span class="slider"></span>
  </label>
  <span>Draft mode</span>
</div>
<div div class="keyboard" id="keyboard"></div>
`;

type KeyInputCallback = (value: number, draftMode: boolean) => void;

// Shows a keyboard for inputting digits for the Sudoku game.
class VirtualKeyboard {
  private readonly cb: KeyInputCallback;
  private readonly container: HTMLElement;

  private width: number;
  private height: number;

  constructor(container: HTMLElement, keyInputCallback: KeyInputCallback) {
    this.container = container;
    container.setHTMLUnsafe(VIRTUAL_KB_HTML);
    container.classList.add('fading-fast');
    this.cb = keyInputCallback;

    const keyboard = document.getElementById('keyboard')!;
    const keyboardDraftModeSwitch = document.getElementById(
      'kb-draft-mode-switch',
    ) as HTMLInputElement;
    for (let i = 1; i <= 9; i++) {
      const key = document.createElement('div');
      key.classList.add('key');
      key.classList.add('btn-default');
      key.textContent = `${i}`;
      key.dataset['value'] = `${i}`;
      key.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        if (key.classList.contains('disabled')) return;
        this.cb(i, keyboardDraftModeSwitch.checked);
      });
      keyboard.appendChild(key);
    }

    // Scope the click events.
    container.addEventListener('click', ev => {
      ev.stopPropagation();
    });

    // This needs to be called before hide(), otherwise they will be all 0s.
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

    const MARGIN = 8;

    const x = x1 - w - MARGIN > 0 ? x1 - w - MARGIN : x2 + MARGIN;
    const y = y1 + h < boardUi.config.size ? y1 + 30 : boardUi.config.size - h;

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;

    this.refreshNumbers(boardUi, coord);

    // Show it.
    const c = this.container;
    c.classList.remove('hidden');
    console.log('display virtual keyboard at (%d, %d)', x, y);
  }

  refreshNumbers(boardUi: BoardUi, coord: Coordinates) {
    // Hide unavailable numbers.
    const draftNumbers = boardUi.gameBoard.getCellByCoord(coord).draftNumbers;
    const availableNumbers =
      boardUi.gameBoard.getAvailableNumbersForCell(coord);
    const keyboard = document.getElementById('keyboard')!;
    keyboard.childNodes.forEach(node => {
      const dom = node as HTMLElement;
      const value = parseInt(dom.dataset['value']!);
      if (availableNumbers.has(value)) {
        dom.classList.add('enabled');
        dom.classList.remove('disabled');
      } else {
        dom.classList.add('disabled');
        dom.classList.remove('enabled');
      }
      if (draftNumbers.has(value)) {
        dom.classList.add('highlight');
      } else {
        dom.classList.remove('highlight');
      }
    });
  }

  hide() {
    console.log('hide virtual keyboard');
    this.container.classList.add('hidden');
  }
}

export class BoardUi {
  config!: Config;
  private readonly container: HTMLElement;

  gameBoard: SolvingBoard;

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
    gameBoard: SolvingBoard,
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
        if (this.cursorCoord) {
          this.virtualKeyboard.refreshNumbers(this, this.cursorCoord);
        }
      },
    );
    this.updateConfig(config);
    container.style.height = `${container.clientWidth}px`;
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

  updateBoard(board: SolvingBoard | null = null): void {
    if (board !== null) {
      this.gameBoard = board;
    }
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
      ev.preventDefault();
      ev.stopPropagation();
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
      ev.preventDefault();
      ev.stopPropagation();
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

    if (coord === null) {
      this.virtualKeyboard.hide();
    }

    // TODO: If the pos did not change, we can skip the following logic.
    this.cursorCoord = coord;
    this.redrawCursor();
    this.redrawHighlight();
  }

  moveCursor(d: MoveDirection) {
    if (!this.cursorCoord) return;
    this.virtualKeyboard.hide();
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
    const size = this.config.size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = `${zIndex}`;

    // Scale the canvas properly.
    const ratio = window.devicePixelRatio;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    const ctx = getCanvas2DContext(canvas);
    ctx.scale(ratio, ratio);

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
        highlightCell(ctx, cell.coordinate, this.getTheme().colorHighlightBg1);
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
        highlightCell(ctx, cell.coordinate, this.getTheme().colorHighlightBg2);
      }

      // Also highlight all draft values.
      for (const cell of this.gameBoard.cells) {
        if (cell.hasDraftNumber(this.focusedNumber)) {
          highlightDraftCell(
            ctx,
            cell.coordinate,
            this.focusedNumber,
            this.getTheme().colorHighlightBg1,
          );
        }
      }
    }
  }

  private redrawGrid(): void {
    const ctx = getCanvas2DContext(this.gridCanvas);
    if (!ctx) {
      console.error('Context not available');
      return;
    }

    const startPos = this.getCanvasPosForIdx(0);
    const endPos = this.getCanvasPosForIdx(9);
    const style: LineStyle = {color: this.getTheme().colorPrefilled};
    const sqrBorderStyle: LineStyle = {
      color: this.getTheme().colorPrefilled,
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
      defaultColor: string,
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
      ctx.fillStyle = defaultColor;
      if (val === this.focusedNumber) {
        ctx.fillStyle = this.getTheme().colorHighlightFg;
      }
      ctx.fillText(val.toString(), x, y);
    };

    for (const cell of this.gameBoard.cells) {
      if (cell.state === SolvingCellState.PREFILLED) {
        drawNumber(
          cell.value!,
          cell.coordinate,
          false,
          this.getTheme().colorPrefilled,
        );
      }
      if (cell.state === SolvingCellState.SOLVED) {
        drawNumber(
          cell.value!,
          cell.coordinate,
          false,
          this.getTheme().colorSolved,
        );
      }
      if (cell.state === SolvingCellState.SOLVING) {
        for (let i = 1; i <= 9; ++i) {
          if (cell.draftNumbers.has(i)) {
            drawNumber(i, cell.coordinate, true, this.getTheme().colorDraft);
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
      color: this.getTheme().colorHighlightFg,
      width: 3,
    };
    drawLine(ctx, x1, y1, x2, y1, style);
    drawLine(ctx, x1, y2, x2, y2, style);
    drawLine(ctx, x1, y1, x1, y2, style);
    drawLine(ctx, x2, y1, x2, y2, style);
  }
}
