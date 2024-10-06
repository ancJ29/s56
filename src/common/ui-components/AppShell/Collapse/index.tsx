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
import { useNavigate } from "react-router-dom";
import { CAvatar } from "../../CKits/CAvatar";
import { LanguagePicker } from "../../LanguagePicker";
import classes from "./style.module.css";

// Ref: https://mantine.dev/app-shell/?e=CollapseDesktop&s=demo

export default function CollapseAppShell({
  title,
  children,
}: WrapperComponentProps & { title?: string }) {
  const t = useTranslation();
  const { header } = useAppStore();
  const { payload } = useAuthStore();
  const [collapsed, { toggle }] = useDisclosure(true);
  const navigate = useNavigate();

  return (
    <AppShell
      className={classes.wrapper}
      transitionDuration={300}
      header={{ height: header.display ? 60 : 0 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: {
          mobile: collapsed,
          desktop: collapsed,
        },
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
                opened={!collapsed}
                onClick={toggle}
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
            <Flex
              onClick={() => navigate("/profile")}
              justify="start"
              align="center"
              gap="xs"
              style={{ cursor: "pointer" }}
              visibleFrom="md"
            >
              <CAvatar size={"md"} name={payload?.userName} />
              <Text>{payload?.fullName || payload?.userName}</Text>
            </Flex>
          )}
          {header?.title ? <></> : <LanguagePicker />}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" onClick={toggle}>
        <SimpleNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
