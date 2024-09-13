import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export function failed(title: string, message: string) {
  notifications.show({
    color: "red",
    title,
    message,
    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
    autoClose: 3e3,
    position: "top-right",
  });
}

export function success(title: string, message: string) {
  notifications.show({
    color: "green",
    title,
    message,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    autoClose: 3e3,
    position: "top-right",
  });
}
