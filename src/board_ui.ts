import {Coordinates, ResolvingCellState} from './types.js';
import {ResolvingBoard} from './resolve.js';

export class BoardUi {
  private size = 0;
  private readonly container: HTMLElement;

  private gameBoard: ResolvingBoard;

  private gridCanvas!: HTMLCanvasElement;
  private numbersCanvas!: HTMLCanvasElement;

  constructor(container: HTMLElement, gameBoard: ResolvingBoard) {
    this.container = container;
    this.gameBoard = gameBoard;
  }

  getCellSize(): number {
    return this.size / 11;
  }

  getCanvasPosForIdx(index: number): number {
    return this.getCellSize() * (index + 1);
  }

  updateBoard(): void {
    this.drawNumbers();
  }

  setSize(size: number): void {
    this.size = size;

    // Remove all children at first.
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.gridCanvas = this.createCanvas();
    this.drawGrid();
    this.container.appendChild(this.gridCanvas);

    this.numbersCanvas = this.createCanvas();
    this.drawNumbers();
    this.container.appendChild(this.numbersCanvas);
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.size;
    canvas.height = this.size;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    return canvas;
  }

  private drawGrid(): void {
    const ctx = this.gridCanvas.getContext('2d');
    if (!ctx) {
      console.error('Context not available');
      return;
    }

    const drawLine = function (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ): void {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const startPos = this.getCanvasPosForIdx(0);
    const endPos = this.getCanvasPosForIdx(9);
    for (let i = 0; i <= 9; i++) {
      const pos = this.getCanvasPosForIdx(i);
      drawLine(startPos, pos, endPos, pos);
      drawLine(pos, startPos, pos, endPos);
    }
  }

  private drawNumbers(): void {
    if (!this.gameBoard) {
      return;
    }

    const ctx = this.numbersCanvas.getContext('2d');
    if (!ctx) {
      console.error('Context not available');
      return;
    }

    const drawNumber = (val: number, coord: Coordinates, big: boolean) => {
      const boxSize = this.getCellSize() / (big ? 1 : 3);
      const fontSize = boxSize * 0.8;
      let x = this.getCanvasPosForIdx(coord.x) + boxSize / 2;
      let y = this.getCanvasPosForIdx(coord.y) + boxSize / 2 + fontSize * 0.07;
      if (!big) {
        x += Math.floor((val - 1) % 3) * boxSize;
        y += Math.floor((val - 1) / 3) * boxSize;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(val.toString(), x, y);
    };

    for (const cell of this.gameBoard.cells) {
      if (cell.state === ResolvingCellState.PREFILLED) {
        drawNumber(cell.value ? cell.value : 0, cell.coordinate, true);
      }
      if (cell.state === ResolvingCellState.RESOLVING) {
        for (let i = 1; i <= 9; ++i) {
          if (cell.possibleValues.has(i)) {
            drawNumber(i, cell.coordinate, false);
          }
        }
      }
    }
  }
}
