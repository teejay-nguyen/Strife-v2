"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useWindowStore, type WindowId } from "@/stores/windowStore";
import Avatar from "../ui/Avatar";

type Tab = "conversations" | "notifications" | "settings";

function ConversationsIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function NotificationsIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

const tabs: { id: Tab; icon: React.FC<{ active: boolean }>; label: string }[] =
  [
    { id: "conversations", icon: ConversationsIcon, label: "Conversations" },
    { id: "notifications", icon: NotificationsIcon, label: "Notifications" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];

export default function Navbar() {
  const [profile, setProfile] = useState<{
    username: string;
    avatar_url: string | null;
    avatar_color: string | null;
    status: string | null;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { windows, openWindow, closeWindow } = useWindowStore();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url, avatar_color, status")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);

      const channel = supabase
        .channel("profile-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            setProfile((prev) => (prev ? { ...prev, ...payload.new } : prev));
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleTabClick = (tab: Tab) => {
    const win = windows[tab as WindowId];
    if (win.isOpen) {
      closeWindow(tab as WindowId);
    } else {
      openWindow(tab as WindowId);
    }
  };

  return (
    <nav className="flex flex-col items-center justify-between w-16 h-screen py-4 bg-zinc-200 dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 shrink-0">
      {/* Top section — avatar + divider + tabs */}
      <div className="flex flex-col items-center w-full gap-3">
        {/* Avatar */}
        <button
          onClick={() =>
            windows.profile.isOpen
              ? closeWindow("profile")
              : openWindow("profile")
          }
          className={`relative rounded-full transition-all ${
            windows.profile.isOpen
              ? "ring-2 ring-indigo-500"
              : "hover:ring-2 hover:ring-indigo-400"
          }`}
        >
          <Avatar
            username={profile?.username ?? "?"}
            avatarUrl={profile?.avatar_url}
            avatarColor={profile?.avatar_color}
            size={36}
          />
          {/* Status dot */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-200 dark:border-zinc-800 ${
              profile?.status === "online"
                ? "bg-green-500"
                : profile?.status === "away"
                  ? "bg-yellow-400"
                  : profile?.status === "dnd"
                    ? "bg-red-500"
                    : profile?.status === "invisible"
                      ? "bg-zinc-400"
                      : "bg-green-500"
            }`}
          />
        </button>

        {/* Divider */}
        <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-600" />

        {/* Tabs */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = windows[id as WindowId].isOpen;
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                title={label}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon active={isActive} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom section — sign out */}
      <div className="flex flex-col items-center w-full px-2">
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-red-500 dark:hover:text-red-400 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
