"use client";
import { use, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type { DraggableEvent } from "react-draggable";
import {
  useWindowStore,
  type AppWindow,
  type SnapPosition,
} from "@/stores/windowStore";

const SNAP_THRESHOLD = 40;

interface Props {
  window: AppWindow;
  children: React.ReactNode;
}

export default function WindowFrame({ window: win, children }: Props) {
  const {
    closeWindow,
    collapseWindow,
    focusWindow,
    updatePosition,
    updateSize,
    snapWindow,
    clearSnap,
  } = useWindowStore();
  const [snapPreview, setSnapPreview] = useState<SnapPosition>(null);
  const [rndKey, setRndKey] = useState(0);
  const isDragging = useRef(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    if (!isDragging.current && !isResizing.current) {
      setRndKey((k) => k + 1);
    }
  }, [win.snapPosition]);

  if (!win.isOpen || win.isMinimized) return null;

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    focusWindow(win.id);

    if (win.snapPosition && win.preSnapSize) {
      const bounds = windowRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const cursorRatioX = (e.clientX - bounds.left) / bounds.width;
      const newWidth = win.preSnapSize.width;
      const newX = e.clientX - cursorRatioX * newWidth;
      const newY = e.clientY - (e.clientY - bounds.top);

      updateSize(win.id, { width: newWidth, height: win.preSnapSize.height });
      updatePosition(win.id, { x: newX, y: newY });
      clearSnap(win.id);
    }
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDrag = (e: DraggableEvent, _d: { x: number; y: number }) => {
    const workspace = document.getElementById("workspace");
    if (!workspace) return;
    const { offsetWidth: W, offsetHeight: H } = workspace;
    const workspaceBounds = workspace.getBoundingClientRect();

    const cursorX = (e as MouseEvent).clientX - workspaceBounds.left;
    const cursorY = (e as MouseEvent).clientY - workspaceBounds.top;

    let snap: SnapPosition = null;
    if (cursorX <= SNAP_THRESHOLD && cursorY <= SNAP_THRESHOLD)
      snap = "top-left";
    else if (cursorX >= W - SNAP_THRESHOLD && cursorY <= SNAP_THRESHOLD)
      snap = "top-right";
    else if (cursorX <= SNAP_THRESHOLD && cursorY >= H - SNAP_THRESHOLD)
      snap = "bottom-left";
    else if (cursorX >= W - SNAP_THRESHOLD && cursorY >= H - SNAP_THRESHOLD)
      snap = "bottom-right";
    else if (cursorX <= SNAP_THRESHOLD) snap = "left-third";
    else if (cursorX >= W - SNAP_THRESHOLD) snap = "right-third";
    else if (cursorY <= SNAP_THRESHOLD) snap = "center-third";

    setSnapPreview(snap);
  };

  const handleDragStop = (_e: DraggableEvent, d: { x: number; y: number }) => {
    isDragging.current = false;

    if (snapPreview) {
      snapWindow(win.id, snapPreview);
    } else {
      updatePosition(win.id, { x: d.x, y: d.y });
      setRndKey((k) => k + 1);
    }

    setSnapPreview(null);
  };

  return (
    <>
      {snapPreview && <SnapOverlay snap={snapPreview} />}

      <Rnd
        key={rndKey}
        position={win.position}
        size={{
          width: win.size.width,
          height: win.isCollapsed ? 42 : win.size.height,
        }}
        minWidth={240}
        minHeight={win.isCollapsed ? 42 : 200}
        enableResizing={!win.isCollapsed}
        style={{ zIndex: win.zIndex }}
        dragHandleClassName="window-drag-handle"
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={() => (isResizing.current = true)}
        onResizeStop={(_e, _dir, _ref, _delta, position) => {
          isResizing.current = false;
          updateSize(win.id, {
            width: parseInt(_ref.style.width),
            height: parseInt(_ref.style.height),
          });
          updatePosition(win.id, position);
          setSnapPreview(null);
          setRndKey((k) => k + 1);
        }}
        className="absolute"
      >
        <div
          ref={windowRef}
          className="flex flex-col w-full h-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl shadow-black/20 overflow-hidden"
        >
          {/* Title bar */}
          <div
            className="window-drag-handle flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 cursor-grab active:cursor-grabbing select-none shrink-0"
            onMouseDown={handleTitleBarMouseDown}
          >
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {win.title}
            </span>
            <div className="flex items-center gap-1.5">
              <SnapMenu windowId={win.id} />
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => collapseWindow(win.id)}
                className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
                title={win.isCollapsed ? "Expand" : "Collapse"}
              />
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => closeWindow(win.id)}
                className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
                title="Close"
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={`flex-1 overflow-auto transition-all duration-300 ease-out ${
              win.isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {children}
          </div>
        </div>
      </Rnd>
    </>
  );
}

function SnapOverlay({ snap }: { snap: SnapPosition }) {
  const styles: Record<NonNullable<SnapPosition>, string> = {
    "left-third": "top-2 left-2 bottom-2 right-2/3 mr-1",
    "center-third": "top-2 bottom-2 left-1/3 right-1/3 mx-1",
    "right-third": "top-2 right-2 bottom-2 left-2/3 ml-1",
    "top-left": "top-2 left-2 bottom-1/2 right-2/3 mr-1 mb-1",
    "top-center": "top-2 bottom-1/2 left-1/3 right-1/3 mx-1 mb-1",
    "top-right": "top-2 right-2 bottom-1/2 left-2/3 ml-1 mb-1",
    "bottom-left": "bottom-2 left-2 top-1/2 right-2/3 mr-1 mt-1",
    "bottom-center": "bottom-2 top-1/2 left-1/3 right-1/3 mx-1 mt-1",
    "bottom-right": "bottom-2 right-2 top-1/2 left-2/3 ml-1 mt-1",
    "left-two-thirds": "top-2 left-2 bottom-2 right-1/3 mr-1",
    "right-two-thirds": "top-2 right-2 bottom-2 left-1/3 ml-1",
    maximized: "inset-2",
  };

  return (
    <div
      className={`absolute z-50 ${styles[snap!]} bg-indigo-500/20 border-2 border-indigo-500/50 rounded-xl pointer-events-none transition-all duration-150`}
    />
  );
}

function SnapMenu({ windowId }: { windowId: AppWindow["id"] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { snapWindow } = useWindowStore();

  const cellCount = 6; // 3 cols x 2 rows

  const toggleCell = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Map selection to snap position
  const getSnapFromSelection = (sel: Set<number>): SnapPosition | null => {
    const s = Array.from(sel).sort((a, b) => a - b);
    const key = s.join(",");

    const map: Record<string, SnapPosition> = {
      // Full height thirds
      "0,3": "left-third",
      "1,4": "center-third",
      "2,5": "right-third",
      // Top row
      "0": "top-left",
      "1": "top-center",
      "2": "top-right",
      // Bottom row
      "3": "bottom-left",
      "4": "bottom-center",
      "5": "bottom-right",
      // Two thirds
      "0,1,3,4": "left-two-thirds",
      "1,2,4,5": "right-two-thirds",
      // Maximize
      "0,1,2,3,4,5": "maximized",
      // Top two thirds
      "0,1": "top-left", // fallback — could extend SnapPosition later
      "1,2": "top-right",
    };

    return map[key] ?? null;
  };

  const snapResult = getSnapFromSelection(selected);

  const handleApply = () => {
    if (snapResult) {
      snapWindow(windowId, snapResult);
      setSelected(new Set());
      setOpen(false);
    }
  };

  const handleClose = () => {
    setSelected(new Set());
    setOpen(false);
  };

  // Visual label for current selection
  const snapLabel = snapResult
    ? snapResult.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : selected.size > 0
      ? "Invalid selection"
      : "Select cells";

  return (
    <div className="relative flex items-center">
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((o) => !o)}
        className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
        title="Snap layout"
      />

      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={handleClose} />
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-5 right-0 z-50 p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl w-48"
          >
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2 px-1">
              Snap to
            </p>

            {/* 3x2 grid */}
            <div className="grid grid-cols-3 grid-rows-2 gap-1 mb-2">
              {Array.from({ length: cellCount }).map((_, i) => {
                const isSelected = selected.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleCell(i)}
                    className={`h-8 rounded transition-colors ${
                      isSelected
                        ? "bg-indigo-500 hover:bg-indigo-600"
                        : "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                    }`}
                  />
                );
              })}
            </div>

            {/* Preview label */}
            <p
              className={`text-xs text-center mb-2 ${
                snapResult
                  ? "text-indigo-500 dark:text-indigo-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {snapLabel}
            </p>

            {/* Apply button */}
            <button
              onClick={handleApply}
              disabled={!snapResult}
              className="w-full py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
}
