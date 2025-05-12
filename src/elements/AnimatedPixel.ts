import { COLORS } from "../constants";
import { AnimatedPixelOptions } from "../types";
import { toRadian, random, createCanvas } from "../utils";
import Square from "./Square";

class AnimatedPixel {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  gap: number;
  squareCount: number;
  squareSize: number;

  squares: Square[];
  animationPhase: number;

  mouseX: number;
  mouseY: number;

  constructor({ element, width, height }: AnimatedPixelOptions) {
    this.element = element;
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext("2d")!;

    this.width = width;
    this.height = height;

    this.gap = 2;
    this.squareCount = 30;
    this.squareSize = (this.width - this.gap) / this.squareCount;

    this.squares = [];
    this.animationPhase = 0;

    this.mouseX = -1;
    this.mouseY = -1;

    this.init();
    this.render();
  }
  get isSquaresAnimating() {
    return this.squares.some((square) => square.isAnimating);
  }
  init() {
    this.element.appendChild(this.canvas);
    this.initSquares();
    this.initListeners();
  }
  initListeners() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }
  handleMouseMove(event: MouseEvent) {
    this.mouseX = Math.floor(event.offsetX / this.squareSize);
    this.mouseY = Math.floor(event.offsetY / this.squareSize);
  }
  initSquares() {
    for (let i = 0; i < this.squareCount; i++) {
      for (let j = 0; j < this.squareCount; j++) {
        this.squares.push(
          new Square({
            ctx: this.ctx,
            x: i * this.squareSize + this.gap,
            y: j * this.squareSize + this.gap,
            size: this.squareSize - this.gap,
            angle: toRadian(360 / 4) * random(0, 3),
            color: COLORS[random(0, COLORS.length - 1)],
          })
        );
      }
    }
  }
  async processAnimation(isReverse = false) {
    const BASE_DELAY = 500;
    const MAX_DELAY = 700;

    const animationQueue = [];

    const centerX = (this.squareCount - 1) / 2;
    const centerY = (this.squareCount - 1) / 2;

    const targetX = this.mouseX === -1 ? centerX : this.mouseX;
    const targetY = this.mouseY === -1 ? centerY : this.mouseY;

    const maxDistance = Math.hypot(centerX, centerY);

    for (let i = 0; i < this.squareCount; i++) {
      for (let j = 0; j < this.squareCount; j++) {
        const distance = Math.hypot(i - targetX, j - targetY) / maxDistance;
        const delayFactor = isReverse ? 1 - distance : distance;
        const delay = BASE_DELAY + delayFactor * MAX_DELAY;

        animationQueue.push(
          this.squares[i * this.squareCount + j].animate({ isReverse, delay })
        );
      }
    }

    return Promise.all(animationQueue);
  }
  async animateSquares() {
    if (this.isSquaresAnimating) return;

    if (this.animationPhase === 0) {
      await this.processAnimation(false);
    } else {
      await this.processAnimation(true);
    }

    this.animationPhase = (this.animationPhase + 1) % 2;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let square of this.squares) {
      square.render();
    }

    this.animateSquares();

    requestAnimationFrame(this.render.bind(this));
  }
}

export default AnimatedPixel;
