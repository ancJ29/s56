import { Avatar, AvatarProps, Text } from "@mantine/core";

export type CAvatarProps = {
  name?: string;
  size: AvatarProps["size"];
};

export function CAvatar({ size, name }: CAvatarProps) {
  if (!name) {
    return <></>;
  }
  return (
    <Avatar size={size} bg="primary" color="white">
      <Text>{name?.slice(0, 1)?.toLocaleUpperCase() || "A"}</Text>
    </Avatar>
  );
}
