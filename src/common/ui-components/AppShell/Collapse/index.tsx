import useTranslation from "@/common/hooks/useTranslation";
import useAppStore from "@/common/stores/app";
import useAuthStore from "@/common/stores/auth";
import { WrapperComponentProps } from "@/common/types";
import { SimpleNavbar } from "@/common/ui-components/Navbar/Simple";
import {
  AppShell,
  Burger,
  Flex,
  Group,
  Space,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CAvatar } from "../../CKits/CAvatar";
import classes from "./style.module.css";

// Ref: https://mantine.dev/app-shell/?e=CollapseDesktop&s=demo

export default function CollapseAppShell({
  title,
  children,
}: WrapperComponentProps & { title?: string }) {
  const t = useTranslation();
  const { header } = useAppStore();
  const { payload } = useAuthStore();

  // prettier-ignore
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  // prettier-ignore
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);

  return (
    <AppShell
      className={classes.wrapper}
      transitionDuration={300}
      header={{ height: header.display ? 60 : 0 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header hidden={!header.display}>
        <Group h="100%" px="md" display="flex">
          {header?.icon ? (
            header.icon
          ) : (
            <>
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
            </>
          )}
          <Text
            fw="bold"
            maw={"80vw"}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {header?.title || t(title)}
          </Text>
          <Space style={{ flexGrow: 1 }} />
          {payload?.id && (
            <Flex justify="start" align="center" gap="xs">
              <CAvatar size="md" name={payload?.userName} />
              <Text>{payload?.fullName || payload?.userName}</Text>
            </Flex>
          )}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" onClick={closeMobile}>
        <SimpleNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
