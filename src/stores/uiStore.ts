import { create } from "zustand";

type UIPanel = "notifications" | null;
type UIModal = "settings" | null;

interface UIStore {
  activePanel: UIPanel;
  activeModal: UIModal;
  setActivePanel: (panel: UIPanel) => void;
  setActiveModal: (modal: UIModal) => void;
  closeAll: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activePanel: null,
  activeModal: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  closeAll: () => set({ activePanel: null, activeModal: null }),
}));
