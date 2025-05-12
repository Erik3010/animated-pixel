export interface AnimatedPixelOptions {
  width: number;
  height: number;
  element: HTMLElement;
}

export interface SquareOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;
}

export interface AnimationOptions<T extends Record<string, number>> {
  initialValues: T;
  targetValues: T;
  duration?: number;
  onUpdate: (values: T) => void;
}
