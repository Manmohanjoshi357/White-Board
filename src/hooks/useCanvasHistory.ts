import { useCallback, useState } from "react";

type HistoryState = {
  undoStack: string[];
  redoStack: string[];
};

export const useCanvasHistory = (initialSnapshot: string | null = null) => {
  const [history, setHistory] = useState<HistoryState>({
    undoStack: initialSnapshot ? [initialSnapshot] : [],
    redoStack: [],
  });

  const recordSnapshot = useCallback((snapshot: string) => {
    setHistory((previous) => {
      if (previous.undoStack[previous.undoStack.length - 1] === snapshot) {
        return previous;
      }

      return {
        undoStack: [...previous.undoStack, snapshot],
        redoStack: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    let snapshotToApply: string | null = null;

    setHistory((previous) => {
      if (previous.undoStack.length <= 1) {
        return previous;
      }

      const newUndoStack = [...previous.undoStack];
      const currentSnapshot = newUndoStack.pop()!;
      snapshotToApply = newUndoStack[newUndoStack.length - 1] ?? null;

      return {
        undoStack: newUndoStack,
        redoStack: [currentSnapshot, ...previous.redoStack],
      };
    });

    return snapshotToApply;
  }, []);

  const redo = useCallback(() => {
    let snapshotToApply: string | null = null;

    setHistory((previous) => {
      if (previous.redoStack.length === 0) {
        return previous;
      }

      const [nextSnapshot, ...remainingRedo] = previous.redoStack;
      snapshotToApply = nextSnapshot;

      return {
        undoStack: [...previous.undoStack, nextSnapshot],
        redoStack: remainingRedo,
      };
    });

    return snapshotToApply;
  }, []);

  return {
    canUndo: history.undoStack.length > 1,
    canRedo: history.redoStack.length > 0,
    recordSnapshot,
    undo,
    redo,
  };
};
