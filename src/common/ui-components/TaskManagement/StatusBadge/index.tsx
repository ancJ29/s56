import useTranslation from "@/common/hooks/useTranslation";
import { statusColors } from "@/common/services/task";
import { Badge } from "@mantine/core";
import { useMemo } from "react";

export function StatusBadge({ status }: { status: string }) {
  const [color, bg] = useMemo(() => {
    const colors = statusColors();
    return [colors[status]?.[0], colors[status]?.[1]];
  }, [status]);
  const t = useTranslation();
  return (
    <Badge size="xs" bg={bg} c={color || "primary"}>
      {t(status)}
    </Badge>
  );
}
