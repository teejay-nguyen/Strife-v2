"use client";
import Navbar from "./Navbar";
import Workspace from "./Workspace";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Workspace />
      </div>
    </div>
  );
}
