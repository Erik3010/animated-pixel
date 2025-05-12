import { SquareOptions } from "../types";
import { animate, sleep } from "../utils";

class Square {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;

  animatedWidth: number;

  isAnimating: boolean;

  constructor(options: SquareOptions) {
    const { ctx, x, y, size, angle, color } = options;

    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = angle;
    this.color = color;

    this.animatedWidth = 0;

    this.isAnimating = false;
  }
  async animate({ isReverse = false, delay = 0 } = {}) {
    this.isAnimating = true;

    if (delay > 0) await sleep(delay);
    await animate<{ width: number }>({
      initialValues: { width: isReverse ? this.size : 0 },
      targetValues: { width: isReverse ? 0 : this.size },
      duration: 500,
      onUpdate: (values) => {
        this.animatedWidth = values.width;
      },
    });

    this.isAnimating = false;
  }
  render() {
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    this.ctx.save();

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-centerX, -centerY);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.animatedWidth, this.size);
    this.ctx.fill();

    this.ctx.restore();
  }
}

export default Square;
