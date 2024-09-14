import logger from "@/common/helpers/logger";
import useClientStore from "@/common/stores/client";
import { Box, Select, SelectProps } from "@mantine/core";
import { useMemo } from "react";
import { UserLabel } from "../UserLabel";

type UserSelectorProps = Omit<SelectProps, "data">;

export function UserSelector({ value, ...props }: UserSelectorProps) {
  const { client } = useClientStore();

  const users = useMemo(() => {
    logger.debug("client", client?.users);
    return Object.entries(client?.users || {}).map(
      ([id, { userName }]) => ({
        value: id,
        label: userName,
      }),
    );
  }, [client]);

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
