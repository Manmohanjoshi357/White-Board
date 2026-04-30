import type { MouseEvent } from "react";

export const WHITEBOARD_STORAGE_KEY = "whiteboard-snapshot-v1";

export type Tool = "pen" | "eraser" | "line" | "rectangle" | "circle";

export type Point = {
  x: number;
  y: number;
};

export const getMousePoint = (
  event: MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): Point => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const drawCircleFromPoints = (
  context: CanvasRenderingContext2D,
  startPoint: Point,
  endPoint: Point,
) => {
  const radius = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
  context.beginPath();
  context.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
  context.stroke();
};
