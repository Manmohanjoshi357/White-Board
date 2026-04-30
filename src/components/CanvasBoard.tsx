import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useCanvasHistory } from "../hooks/useCanvasHistory";
import {
  drawCircleFromPoints,
  getMousePoint,
  WHITEBOARD_STORAGE_KEY,
  type Point,
  type Tool,
} from "../utils/canvas";

type CanvasBoardProps = {
  tool: Tool;
  color: string;
  brushSize: number;
  onHistoryChange: (state: { canUndo: boolean; canRedo: boolean }) => void;
  undoSignal: number;
  redoSignal: number;
  clearSignal: number;
};

const CanvasBoard = ({
  tool,
  color,
  brushSize,
  onHistoryChange,
  undoSignal,
  redoSignal,
  clearSignal,
}: CanvasBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<Point | null>(null);
  const snapshotBeforeShapeRef = useRef<ImageData | null>(null);
  const initializedRef = useRef(false);

  const [initialSnapshot] = useState<string | null>(() => localStorage.getItem(WHITEBOARD_STORAGE_KEY));

  const history = useCanvasHistory(initialSnapshot);

  const applySnapshot = (snapshot: string | null) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    if (!snapshot) {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const image = new Image();
    image.onload = () => {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      localStorage.setItem(WHITEBOARD_STORAGE_KEY, canvas.toDataURL("image/png"));
    };
    image.src = snapshot;
  };

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const snapshot = canvas.toDataURL("image/png");
    history.recordSnapshot(snapshot);
    localStorage.setItem(WHITEBOARD_STORAGE_KEY, snapshot);
  };

  useEffect(() => {
    onHistoryChange({ canUndo: history.canUndo, canRedo: history.canRedo });
  }, [history.canRedo, history.canUndo, onHistoryChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wrapperRef.current) {
      return;
    }

    const resizeCanvas = () => {
      const context = canvas.getContext("2d");
      if (!context || !wrapperRef.current) {
        return;
      }

      const snapshot = canvas.toDataURL("image/png");
      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight;

      canvas.width = width;
      canvas.height = height;

      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (!initializedRef.current && !initialSnapshot) {
          initializedRef.current = true;
          saveSnapshot();
        }
      };
      image.src = snapshot;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (!initialSnapshot) {
      return;
    }
    applySnapshot(initialSnapshot);
  }, [initialSnapshot]);

  useEffect(() => {
    if (undoSignal === 0) {
      return;
    }
    applySnapshot(history.undo());
  }, [history, undoSignal]);

  useEffect(() => {
    if (redoSignal === 0) {
      return;
    }
    applySnapshot(history.redo());
  }, [history, redoSignal]);

  useEffect(() => {
    if (clearSignal === 0) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  }, [clearSignal]);

  const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const point = getMousePoint(event, canvas);
    isDrawingRef.current = true;
    startPointRef.current = point;
    snapshotBeforeShapeRef.current = context.getImageData(0, 0, canvas.width, canvas.height);

    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    context.strokeStyle = color;

    if (tool === "pen" || tool === "eraser") {
      context.beginPath();
      context.moveTo(point.x, point.y);
    }
  };

  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!isDrawingRef.current || !canvas || !context || !startPointRef.current) {
      return;
    }

    const currentPoint = getMousePoint(event, canvas);

    if (tool === "pen" || tool === "eraser") {
      context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      context.lineTo(currentPoint.x, currentPoint.y);
      context.stroke();
      return;
    }

    if (!snapshotBeforeShapeRef.current) {
      return;
    }

    context.globalCompositeOperation = "source-over";
    context.putImageData(snapshotBeforeShapeRef.current, 0, 0);
    context.beginPath();
    switch (tool) {
      case "line":
        context.moveTo(startPointRef.current.x, startPointRef.current.y);
        context.lineTo(currentPoint.x, currentPoint.y);
        context.stroke();
        break;
      case "rectangle":
        context.strokeRect(
          startPointRef.current.x,
          startPointRef.current.y,
          currentPoint.x - startPointRef.current.x,
          currentPoint.y - startPointRef.current.y,
        );
        break;
      case "circle":
        drawCircleFromPoints(context, startPointRef.current, currentPoint);
        break;
      default:
        break;
    }
  };

  const finishDrawing = () => {
    if (!isDrawingRef.current) {
      return;
    }
    isDrawingRef.current = false;
    startPointRef.current = null;
    snapshotBeforeShapeRef.current = null;
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      context.globalCompositeOperation = "source-over";
    }
    saveSnapshot();
  };

  return (
    <div
      ref={wrapperRef}
      className="h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
    >
      <canvas
        id="whiteboard-canvas"
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        className={`h-full w-full rounded-2xl ${
          tool === "eraser" ? "cursor-cell" : "cursor-crosshair"
        }`}
      />
    </div>
  );
};

export default CanvasBoard;
