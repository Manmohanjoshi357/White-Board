import { useEffect, useState } from "react";
import CanvasBoard from "./components/CanvasBoard";
import Toolbar from "./components/Toolbar";
import type { Tool } from "./utils/canvas";

const App = () => {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#1e293b");
  const [brushSize, setBrushSize] = useState(4);
  const [undoSignal, setUndoSignal] = useState(0);
  const [redoSignal, setRedoSignal] = useState(0);
  const [clearSignal, setClearSignal] = useState(0);
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  const handleSave = () => {
    const canvas = document.getElementById("whiteboard-canvas") as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportContext = exportCanvas.getContext("2d");
    if (!exportContext) {
      return;
    }

    // Export with white background so transparent pixels don't appear dark in image viewers.
    exportContext.fillStyle = "#ffffff";
    exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportContext.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          setRedoSignal((prev) => prev + 1);
          return;
        }
        setUndoSignal((prev) => prev + 1);
      }

      if (event.key.toLowerCase() === "y") {
        event.preventDefault();
        setRedoSignal((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen bg-linear-to-br from-slate-100 via-slate-50 to-indigo-100/60 p-3 sm:p-4">
      <div className="relative flex h-full w-full flex-col gap-3">
        <div className="px-1 text-lg font-semibold tracking-tight text-slate-800">White Board</div>
        <Toolbar
          activeTool={tool}
          color={color}
          brushSize={brushSize}
          canUndo={historyState.canUndo}
          canRedo={historyState.canRedo}
          onToolChange={setTool}
          onColorChange={setColor}
          onBrushSizeChange={setBrushSize}
          onUndo={() => setUndoSignal((prev) => prev + 1)}
          onRedo={() => setRedoSignal((prev) => prev + 1)}
          onClear={() => setClearSignal((prev) => prev + 1)}
          onSave={handleSave}
        />
        <p className="px-1 text-xs font-medium text-slate-500">
          Shortcuts: Ctrl/Cmd + Z (Undo), Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z (Redo)
        </p>
        <div className="min-h-0 flex-1">
          <CanvasBoard
            tool={tool}
            color={color}
            brushSize={brushSize}
            onHistoryChange={setHistoryState}
            undoSignal={undoSignal}
            redoSignal={redoSignal}
            clearSignal={clearSignal}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
