import { Badge } from "@/components/ui/badge";

export function PreviewBadge() {
  return (
    <Badge
      variant="outline"
      className="border-pink-500/30 bg-pink-500/30 text-pink-300 rounded-full px-1.5 py-0.5 text-xs font-medium"
    >
      Preview
    </Badge>
  );
}

