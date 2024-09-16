import useAppStore from "@/common/stores/app";
import { WrapperComponentProps } from "@/common/types";
import { SimpleNavbar } from "@/common/ui-components/Navbar/Simple";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// Ref: https://mantine.dev/app-shell/?e=CollapseDesktop&s=demo

export default function CollapseAppShell({
  children,
}: WrapperComponentProps) {
  // prettier-ignore
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const { display } = useAppStore();

  return (
    <AppShell
      transitionDuration={300}
      header={{ height: display.header ? 60 : 0 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header hidden={!display.header}>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <SimpleNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
