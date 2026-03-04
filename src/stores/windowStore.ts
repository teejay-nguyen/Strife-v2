import { create } from "zustand";

export type WindowId = "conversations" | "notifications" | "settings";

export type SnapPosition =
  | "left-third"
  | "center-third"
  | "right-third"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-two-thirds"
  | "right-two-thirds"
  | "maximized"
  | null;

export interface AppWindow {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isCollapsed: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  preSnapPosition: { x: number; y: number } | null;
  preSnapSize: { width: number; height: number } | null;
  zIndex: number;
  snapPosition: SnapPosition;
}

const DEFAULT_WINDOWS: Record<WindowId, AppWindow> = {
  conversations: {
    id: "conversations",
    title: "Conversations",
    isOpen: false,
    isMinimized: false,
    isCollapsed: false,
    position: { x: 80, y: 60 },
    size: { width: 320, height: 500 },
    preSnapPosition: null,
    preSnapSize: null,
    zIndex: 10,
    snapPosition: null,
  },
  notifications: {
    id: "notifications",
    title: "Notifications",
    isOpen: false,
    isMinimized: false,
    isCollapsed: false,
    position: { x: 160, y: 100 },
    size: { width: 300, height: 420 },
    preSnapPosition: null,
    preSnapSize: null,
    zIndex: 10,
    snapPosition: null,
  },
  settings: {
    id: "settings",
    title: "Settings",
    isOpen: false,
    isMinimized: false,
    isCollapsed: false,
    position: { x: 240, y: 140 },
    size: { width: 480, height: 520 },
    preSnapPosition: null,
    preSnapSize: null,
    zIndex: 10,
    snapPosition: null,
  },
};

interface WindowStore {
  windows: Record<WindowId, AppWindow>;
  topZIndex: number;
  activeTab: WindowId | null;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  collapseWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  clearSnap: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void;
  updateSize: (id: WindowId, size: { width: number; height: number }) => void;
  snapWindow: (id: WindowId, snap: SnapPosition) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: DEFAULT_WINDOWS,
  topZIndex: 10,
  activeTab: null,

  openWindow: (id) => {
    const { topZIndex, windows } = get();
    const newZ = topZIndex + 1;
    set({
      topZIndex: newZ,
      activeTab: id,
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          isOpen: true,
          isMinimized: false,
          isCollapsed: false,
          zIndex: newZ,
        },
      },
    });
  },

  closeWindow: (id) =>
    set((state) => ({
      activeTab: state.activeTab === id ? null : state.activeTab,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          snapPosition: null,
          isCollapsed: false,
          preSnapPosition: null,
          preSnapSize: null,
        },
      },
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: !state.windows[id].isMinimized,
        },
      },
    })),

  collapseWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isCollapsed: !state.windows[id].isCollapsed,
        },
      },
    })),

  focusWindow: (id) => {
    const { topZIndex, windows } = get();
    const newZ = topZIndex + 1;
    set({
      topZIndex: newZ,
      windows: {
        ...windows,
        [id]: { ...windows[id], zIndex: newZ },
      },
    });
  },

  clearSnap: (id: WindowId) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          snapPosition: null,
          preSnapPosition: null,
          preSnapSize: null,
        },
      },
    })),

  updatePosition: (id, position) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position,
          snapPosition: null,
          preSnapPosition: null,
          preSnapSize: null,
        },
      },
    })),

  updateSize: (id, size) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], size },
      },
    })),

  snapWindow: (id, snap) => {
    const state = get();
    const workspace = document.getElementById("workspace");
    if (!workspace) return;
    const { offsetWidth: W, offsetHeight: H } = workspace;
    const padding = 8;
    const win = state.windows[id];

    const snapLayouts: Record<
      NonNullable<SnapPosition>,
      { x: number; y: number; width: number; height: number }
    > = {
      "left-third": {
        x: padding,
        y: padding,
        width: W / 3 - padding * 1.5,
        height: H - padding * 2,
      },
      "center-third": {
        x: W / 3 + padding / 2,
        y: padding,
        width: W / 3 - padding,
        height: H - padding * 2,
      },
      "right-third": {
        x: (W / 3) * 2 + padding / 2,
        y: padding,
        width: W / 3 - padding * 1.5,
        height: H - padding * 2,
      },
      "top-left": {
        x: padding,
        y: padding,
        width: W / 3 - padding * 1.5,
        height: H / 2 - padding * 1.5,
      },
      "top-center": {
        x: W / 3 + padding / 2,
        y: padding,
        width: W / 3 - padding,
        height: H / 2 - padding * 1.5,
      },
      "top-right": {
        x: (W / 3) * 2 + padding / 2,
        y: padding,
        width: W / 3 - padding * 1.5,
        height: H / 2 - padding * 1.5,
      },
      "bottom-left": {
        x: padding,
        y: H / 2 + padding / 2,
        width: W / 3 - padding * 1.5,
        height: H / 2 - padding * 1.5,
      },
      "bottom-center": {
        x: W / 3 + padding / 2,
        y: H / 2 + padding / 2,
        width: W / 3 - padding,
        height: H / 2 - padding * 1.5,
      },
      "bottom-right": {
        x: (W / 3) * 2 + padding / 2,
        y: H / 2 + padding / 2,
        width: W / 3 - padding * 1.5,
        height: H / 2 - padding * 1.5,
      },
      "left-two-thirds": {
        x: padding,
        y: padding,
        width: (W / 3) * 2 - padding * 1.5,
        height: H - padding * 2,
      },
      "right-two-thirds": {
        x: W / 3 + padding / 2,
        y: padding,
        width: (W / 3) * 2 - padding * 1.5,
        height: H - padding * 2,
      },
      maximized: {
        x: padding,
        y: padding,
        width: W - padding * 2,
        height: H - padding * 2,
      },
    };

    if (!snap) return;
    const layout = snapLayouts[snap];

    set({
      windows: {
        ...state.windows,
        [id]: {
          ...win,
          snapPosition: snap,
          preSnapPosition: win.snapPosition
            ? win.preSnapPosition
            : win.position,
          preSnapSize: win.snapPosition ? win.preSnapSize : win.size,
          position: { x: layout.x, y: layout.y },
          size: { width: layout.width, height: layout.height },
        },
      },
    });
  },
}));
