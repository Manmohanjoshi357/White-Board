import type { Tool } from "../utils/canvas";

type ToolbarProps = {
  activeTool: Tool;
  color: string;
  brushSize: number;
  canUndo: boolean;
  canRedo: boolean;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
};

const tools: { id: Tool; label: string }[] = [
  { id: "pen", label: "Pen" },
  { id: "eraser", label: "Eraser" },
  { id: "line", label: "Line" },
  { id: "rectangle", label: "Rectangle" },
  { id: "circle", label: "Circle" },
];

const buttonBase =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 hover:-translate-y-0.5";

const iconClass = "h-5 w-5";

const ToolIcon = ({ tool }: { tool: Tool }) => {
  if (tool === "pen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <path d="M4 20l4.5-1.1L20 7.5 16.5 4 5.1 15.4 4 20z" />
      </svg>
    );
  }

  if (tool === "eraser") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <path d="M20 14l-7-7a2 2 0 00-2.8 0L3 14.2a2 2 0 000 2.8L6 20h8l6-6a2 2 0 000-2.8z" />
      </svg>
    );
  }

  if (tool === "line") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <path d="M4 20L20 4" />
      </svg>
    );
  }

  if (tool === "rectangle") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <rect x="4" y="6" width="16" height="12" rx="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
};

const ActionIcon = ({ type }: { type: "undo" | "redo" | "clear" | "save" }) => {
  if (type === "undo") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <path d="M9 8L5 12l4 4" />
        <path d="M5 12h8a6 6 0 110 12" />
      </svg>
    );
  }

  if (type === "redo") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <path d="M15 8l4 4-4 4" />
        <path d="M19 12h-8a6 6 0 100 12" />
      </svg>
    );
  }

  if (type === "clear") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}>
      <path d="M12 3v12" />
      <path d="M8 11l4 4 4-4" />
      <rect x="4" y="17" width="16" height="4" rx="1" />
    </svg>
  );
};

const Toolbar = ({
  activeTool,
  color,
  brushSize,
  canUndo,
  canRedo,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
}: ToolbarProps) => {
  return (
    <div className="w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-[0_10px_32px_rgba(15,23,42,0.12)] backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              title={tool.label}
              onClick={() => onToolChange(tool.id)}
              className={`${buttonBase} ${
                activeTool === tool.id
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ToolIcon tool={tool.id} />
            </button>
          ))}

          <label className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-2">
            <input
              type="color"
              value={color}
              title="Color"
              onChange={(event) => onColorChange(event.target.value)}
              className="h-8 w-8 cursor-pointer rounded border-none bg-transparent p-0"
            />
          </label>

          <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-700">
            <span>Size</span>
            <input
              type="range"
              min={1}
              max={40}
              value={brushSize}
              onChange={(event) => onBrushSizeChange(Number(event.target.value))}
              className="w-24 cursor-pointer"
            />
            <span className="w-6 text-right">{brushSize}</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            className={`${buttonBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ActionIcon type="undo" />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            className={`${buttonBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ActionIcon type="redo" />
          </button>
          <button
            type="button"
            title="Clear"
            onClick={onClear}
            className={`${buttonBase} border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100`}
          >
            <ActionIcon type="clear" />
          </button>
          <button
            type="button"
            title="Save PNG"
            onClick={onSave}
            className={`${buttonBase} border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
          >
            <ActionIcon type="save" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
