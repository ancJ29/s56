import appStore from "@/common/stores/app";
import { Container } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect } from "react";

export function CMobileFull({
  children,
  title,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    appStore.getState().updateHeader({
      title: title,
      display: true,
      icon: (
        <IconArrowLeft
          onClick={() => {
            appStore.getState().resetHeader();
            onClose();
          }}
        />
      ),
    });
  }, []);
  return <Container>{children}</Container>;
}
