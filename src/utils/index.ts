import { AnimationOptions } from "../types";

export const createCanvas = (width: number, height: number) => {
  const PIXEL_RATIO = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = width * PIXEL_RATIO;
  canvas.height = height * PIXEL_RATIO;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
  return canvas;
};

export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const toRadian = (degree: number) => degree * (Math.PI / 180);

export const waitForAnimationDelay = (delayMs: number) => {
  return new Promise<void>((resolve) => {
    const startTime = performance.now();

    const onFrame = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed > delayMs) {
        return resolve();
      }
      requestAnimationFrame(onFrame);
    };
    requestAnimationFrame(onFrame);
  });
};

export const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const smootherStep = (progress: number) => 1 - Math.pow(1 - progress, 4);

export const animate = <T extends Record<string, number>>({
  initialValues,
  targetValues,
  duration = 100,
  onUpdate,
}: AnimationOptions<T>) => {
  return new Promise((resolve) => {
    const startTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;
      const interpolation = elapsedTime / duration;

      if (interpolation >= 1) {
        onUpdate(targetValues);
        return resolve(true);
      }

      const fraction = smootherStep(interpolation);

      const newValues = {} as T;
      for (const key in initialValues) {
        const newValue = lerp(initialValues[key], targetValues[key], fraction);
        newValues[key] = newValue as T[typeof key];
      }

      onUpdate(newValues);
      requestAnimationFrame(animate);
    };
    animate();
  });
};
