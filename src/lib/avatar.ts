export const AVATAR_COLORS = [
  { label: "Indigo", value: "#4f46e5" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
  { label: "Red", value: "#dc2626" },
  { label: "Amber", value: "#d97706" },
  { label: "Emerald", value: "#059669" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#9333ea" },
  { label: "Fuchsia", value: "#c026d3" },
];

export function getAvatarColor(
  username: string,
  override?: string | null,
): string {
  if (override) return override;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length].value;
}

export function getAvatarInitial(username: string): string {
  return username.charAt(0).toUpperCase();
}
