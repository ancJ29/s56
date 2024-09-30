import useAuthStore from "@/common/stores/auth";
import useClientStore from "@/common/stores/client";
import { Box, Select, SelectProps } from "@mantine/core";
import { useMemo } from "react";
import { UserLabel } from "../UserLabel";

type UserSelectorProps = Omit<SelectProps, "data">;

export function UserSelector({ value, ...props }: UserSelectorProps) {
  const { client } = useClientStore();
  const { payload } = useAuthStore();

  const users = useMemo(() => {
    const others = payload?.client?.others as {
      subUserIds: string[];
    };
    const subUserMap = Object.fromEntries(
      others?.subUserIds?.map((userId) => [userId, true]) || [],
    );
    return Object.entries(client?.users || {})
      .filter(([userId]) => {
        return subUserMap[userId] || userId === payload?.id;
      })
      .map(([userId, { userName }]) => ({
        value: userId,
        label: userName,
      }));
  }, [client, payload]);

  return (
    <Select
      value={value}
      data={users}
      {...props}
      renderOption={(el) => {
        return (
          <Box ml={1}>
            <UserLabel size="1.2rem" userId={el.option.value} />
          </Box>
        );
      }}
    />
  );
}
