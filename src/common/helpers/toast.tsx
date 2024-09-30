import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

type NotificationPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export function failed(
  title: string,
  message: string,
  position: NotificationPosition = "top-right",
) {
  notifications.show({
    color: "red",
    title,
    message,
    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
    autoClose: 3e3,
    position,
  });
}

export function success(
  title: string,
  message: string,
  position: NotificationPosition = "top-right",
) {
  notifications.show({
    color: "green",
    title,
    message,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    autoClose: 3e3,
    position,
  });
}
