"use client";
import { useWindowStore } from "@/stores/windowStore";
import WindowFrame from "./WindowFrame";
import ConversationsWindow from "./windows/ConversationsWindow";
import NotificationsWindow from "./windows/NotificationsWindow";
import SettingsWindow from "./windows/SettingsWindow";

export default function Workspace() {
  const { windows } = useWindowStore();

  return (
    <div
      id="workspace"
      className="relative w-full h-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
    >
      {/* Empty state */}
      {!Object.values(windows).some((w) => w.isOpen) && (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-4 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
          <p className="text-sm">
            Select a panel from the sidebar to get started
          </p>
        </div>
      )}

      <WindowFrame window={windows.conversations}>
        <ConversationsWindow />
      </WindowFrame>

      <WindowFrame window={windows.notifications}>
        <NotificationsWindow />
      </WindowFrame>

      <WindowFrame window={windows.settings}>
        <SettingsWindow />
      </WindowFrame>
    </div>
  );
}
