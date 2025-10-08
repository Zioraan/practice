import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactAvatarProps {
  firstName: string;
  lastName: string;
  email?: string | null;
  size?: "sm" | "md" | "lg";
}

export function ContactAvatar({
  firstName,
  lastName,
  email,
  size = "md",
}: ContactAvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Generate a consistent color based on the name
  const colorIndex =
    (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
  const color = colors[colorIndex];

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-2xl",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarFallback
        className="font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// Color palette for avatars
const colors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];
