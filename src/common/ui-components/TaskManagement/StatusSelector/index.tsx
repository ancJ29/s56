import useTranslation from "@/common/hooks/useTranslation";
import useClientStore from "@/common/stores/client";
import { Select, SelectProps } from "@mantine/core";
import { useMemo } from "react";

type StatusSelectorProps = Omit<SelectProps, "data">;

export function StatusSelector({
  value,
  ...props
}: StatusSelectorProps) {
  const t = useTranslation();
  const { client } = useClientStore();

  const data = useMemo(() => {
    // Record<statusID, [displayName, order]>
    return Object.entries(client?.tasks?.statusMap || {})
      .map(([, [displayName, order]]) => {
        return [displayName, order] as [string, number];
      })
      .sort((a, b) => a[1] - b[1])
      .map(([displayName]) => {
        return { value: displayName, label: t(displayName) };
      });
  }, [client?.tasks?.statusMap, t]);

  return <Select value={value} data={data} {...props} />;
}
