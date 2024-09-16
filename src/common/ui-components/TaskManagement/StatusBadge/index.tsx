import useTranslation from "@/common/hooks/useTranslation";
import { statusColors } from "@/common/services/task";
import { Badge } from "@mantine/core";
import { useMemo } from "react";

export function StatusBadge({ status }: { status: string }) {
  const colors = useMemo(() => {
    return statusColors();
  }, []);
  const t = useTranslation();
  return (
    <Badge size="xs" bg={colors[status]}>
      {t(status)}
    </Badge>
  );
}
