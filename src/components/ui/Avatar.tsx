import { getAvatarColor, getAvatarInitial } from "@/lib/avatar";

interface AvatarProps {
  username: string;
  avatarUrl?: string | null;
  avatarColor?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({
  username,
  avatarUrl,
  avatarColor,
  size = 36,
  className = "",
}: AvatarProps) {
  const color = getAvatarColor(username, avatarColor);
  const initial = getAvatarInitial(username);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold select-none shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
}
