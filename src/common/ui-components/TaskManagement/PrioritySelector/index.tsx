import useTranslation from "@/common/hooks/useTranslation";
import useClientStore from "@/common/stores/client";
import { Select, SelectProps } from "@mantine/core";
import { useMemo } from "react";

type PrioritySelectorProps = Omit<SelectProps, "data">;

export function PrioritySelector({
  value,
  ...props
}: PrioritySelectorProps) {
  const t = useTranslation();
  const { client } = useClientStore();

  const data = useMemo(() => {
    return Object.entries(client?.tasks?.priorityMap || {}).map(
      ([, [displayName]]) => {
        return { value: displayName, label: t(displayName) };
      },
    );
  }, [client?.tasks?.priorityMap, t]);

  return <Select value={value} data={data} {...props} />;
}
