export default function ConversationsWindow() {
  return (
    <div className="p-4">
      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
        Direct Messages
      </p>
      <div className="flex flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
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
  );
}
