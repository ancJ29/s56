import useClientStore from "@/common/stores/client";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { CAvatar, CAvatarProps } from "../../CKits/CAvatar";

export function UserLabel({
  size,
  userId,
}: {
  size: CAvatarProps["size"];
  userId?: string;
}) {
  const { client } = useClientStore();
  const user = useMemo(
    () => (userId ? client?.users?.[userId] : undefined),
    [client, userId],
  );
  return (
    <Flex gap={5} justify="start" align="center">
      <CAvatar size={size} name={user?.userName} />
      {user?.userName || "-"}
    </Flex>
  );
}
