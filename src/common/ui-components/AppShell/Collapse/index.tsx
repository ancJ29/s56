import useTranslation from "@/common/hooks/useTranslation";
import useAppStore from "@/common/stores/app";
import { WrapperComponentProps } from "@/common/types";
import { SimpleNavbar } from "@/common/ui-components/Navbar/Simple";
import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./style.module.css";

// Ref: https://mantine.dev/app-shell/?e=CollapseDesktop&s=demo

export default function CollapseAppShell({
  title,
  children,
}: WrapperComponentProps & { title?: string }) {
  const t = useTranslation();
  const { display } = useAppStore();

  // prettier-ignore
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  // prettier-ignore
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);

  return (
    <AppShell
      className={classes.wrapper}
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
          <Text fw="bold">{t(title)}</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" onClick={closeMobile}>
        <SimpleNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
