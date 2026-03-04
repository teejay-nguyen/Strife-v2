"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";
import { AVATAR_COLORS } from "@/lib/avatar";

type Status = "online" | "away" | "dnd" | "invisible";

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: "online", label: "Online", color: "bg-green-500" },
  { value: "away", label: "Away", color: "bg-yellow-400" },
  { value: "dnd", label: "Do Not Disturb", color: "bg-red-500" },
  { value: "invisible", label: "Invisible", color: "bg-zinc-400" },
];

export default function ProfileWindow() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Status>("online");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarColor, setAvatarColor] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, status, avatar_url, avatar_color")
        .eq("id", user.id)
        .single();
      if (data) {
        setUsername(data.username ?? "");
        setStatus((data.status as Status) ?? "online");
        setAvatarUrl(data.avatar_url ?? null);
        setAvatarColor(data.avatar_color ?? null);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ status, avatar_color: avatarColor })
      .eq("id", user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      setAvatarUrl(publicUrl);
    }

    setUploading(false);
  };

  const handleRemovePhoto = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);
    setAvatarUrl(null);
  };

  return (
    <div className="flex flex-col h-full p-5 gap-5 overflow-y-auto">
      {/* Avatar preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar
            username={username}
            avatarUrl={avatarUrl}
            avatarColor={avatarColor}
            size={72}
            className="ring-4 ring-zinc-200 dark:ring-zinc-700"
          />
          {/* Status dot */}
          <span
            className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-800 ${
              STATUS_OPTIONS.find((s) => s.value === status)?.color ??
              "bg-zinc-400"
            }`}
          />
        </div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {username}
        </p>
      </div>

      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-700" />

      {/* Status */}
      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Status
        </label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full appearance-none px-3 py-2.5 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                STATUS_OPTIONS.find((s) => s.value === status)?.color ??
                "bg-zinc-400"
              }`}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-700" />

      {/* Avatar color */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Avatar Color
        </label>
        <div className="flex flex-wrap gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setAvatarColor(c.value)}
              title={c.label}
              className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                avatarColor === c.value
                  ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-800 scale-110"
                  : ""
              }`}
              style={{ background: c.value }}
            />
          ))}
          {/* Reset to default */}
          {avatarColor && (
            <button
              onClick={() => setAvatarColor(null)}
              title="Reset to default"
              className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-xs"
            >
              ↺
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-700" />

      {/* Profile photo upload */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Profile Photo
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload photo"}
          </button>
          {avatarUrl && (
            <button
              onClick={handleRemovePhoto}
              className="py-2 px-3 rounded-lg border border-red-200 dark:border-red-800 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="mt-auto w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
      >
        {saved ? "Saved ✓" : "Save Changes"}
      </button>
    </div>
  );
}
