"use client";
import Navbar from "./Navbar";
import PanelManager from "./PanelManager";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      {/* Fixed left navbar - never resizable */}
      <Navbar />
      {/* Everything to the right is panelized */}
      <div className="flex-1 overflow-hidden">
        <PanelManager>{children}</PanelManager>
      </div>
    </div>
  );
}
