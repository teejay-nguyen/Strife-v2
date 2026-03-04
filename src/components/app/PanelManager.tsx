"use client";
import { Group, Panel, Separator } from "react-resizable-panels";

interface Props {
  children: React.ReactNode;
}

export default function PanelManager({ children }: Props) {
  return (
    <Group orientation="horizontal" className="h-full w-full">
      {/* Sidebar panel */}
      <Panel
        defaultSize="22%"
        minSize="15%"
        maxSize="35%"
        className="bg-zinc-50 dark:bg-zinc-850 border-r border-zinc-200 dark:border-zinc-700"
      >
        <div className="h-full overflow-y-auto p-3">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-1">
            Direct Messages
          </p>
          <div className="flex flex-col gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    User {i}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    Last message preview...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Separator className="w-1 hover:w-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-indigo-500 dark:hover:bg-indigo-500 transition-all duration-150 cursor-col-resize" />

      {/* Main content panel */}
      <Panel
        defaultSize="78%"
        minSize="40%"
        className="bg-white dark:bg-zinc-900"
      >
        <div className="h-full overflow-y-auto">{children}</div>
      </Panel>
    </Group>
  );
}
