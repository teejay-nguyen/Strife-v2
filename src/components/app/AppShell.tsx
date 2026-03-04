"use client";
import Navbar from "./Navbar";
import PanelManager from "./PanelManager";
import SettingsModal from "./SettingsModal";
import NotificationsPanel from "./NotificationsPanel";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <Navbar />
      <div className="flex-1 overflow-hidden relative">
        <PanelManager>{children}</PanelManager>
        {/* Notifications slides in over the right side */}
        <NotificationsPanel />
      </div>
      {/* Settings modal sits above everything */}
      <SettingsModal />
    </div>
  );
}
