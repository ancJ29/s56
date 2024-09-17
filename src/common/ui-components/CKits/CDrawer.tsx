import useIsMobile from "@/common/hooks/useIsMobile";
import { WrapperComponentProps } from "@/common/types";
import { Drawer, DrawerProps } from "@mantine/core";

type CDrawerProps = {
  opened: boolean;
  visibleFrom?: DrawerProps["visibleFrom"];
  onClose?: DrawerProps["onClose"];
} & WrapperComponentProps;

export function CDrawer({
  visibleFrom = "md",
  children,
  opened,
  onClose,
}: CDrawerProps) {
  const isMobile = useIsMobile();

  return (
    <Drawer
      visibleFrom={visibleFrom}
      position="right"
      radius="sm"
      size={isMobile ? "99vw" : "50vw"}
      opened={opened}
      onClose={() => {
        onClose?.();
      }}
      transitionProps={{
        transition: "slide-left",
        duration: 200,
        timingFunction: "linear",
      }}
      styles={{
        body: {
          padding: "10px",
        },
        header: {
          display: "none",
        },
      }}
    >
      {children}
    </Drawer>
  );
}
