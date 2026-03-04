"use client";
import { useUIStore } from "@/stores/uiStore";
import { useEffect, useState } from "react";

export default function SettingsModal() {
  const { activeModal, setActiveModal } = useUIStore();
  const isOpen = activeModal === "settings";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to allow mount before animating in
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — shadow only, no blur */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={() => setActiveModal(null)}
      />

      {/* Modal card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden transition-all duration-500 ease-out ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Settings
            </h2>
            <button
              onClick={() => setActiveModal(null)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Settings coming soon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
