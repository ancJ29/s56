import { Avatar, AvatarProps } from "@mantine/core";

export type CAvatarProps = {
  name?: string;
  size: AvatarProps["size"];
};

export function CAvatar({ size, name }: CAvatarProps) {
  return (
    <Avatar
      size={size}
      src={`https://eu.ui-avatars.com/api/?name=${name || "U"}`}
    />
  );
}
