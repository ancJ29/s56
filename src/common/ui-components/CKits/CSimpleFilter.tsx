import useTranslation from "@/common/hooks/useTranslation";
import {
  ActionIcon,
  Affix,
  Button,
  Drawer,
  Flex,
  InputLabel,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";

export function CSimpleFilter({
  children,
  onClear,
  onSearch,
}: {
  children: React.ReactNode;
  onClear?: () => void;
  onSearch?: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslation();
  return (
    <>
      <Affix
        hiddenFrom="md"
        hidden={opened}
        position={{
          top: 10,
          right: 10,
        }}
      >
        <ActionIcon
          m="xs"
          variant="transparent"
          onClick={open}
          style={{
            margin: "0px",
          }}
        >
          <IconFilter />
        </ActionIcon>
      </Affix>
      <Drawer
        hiddenFrom={"md"}
        position="right"
        radius="sm"
        size={"80vw"}
        opened={opened}
        onClose={close}
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
        <Flex direction="column" gap="xs" h="85vh">
          <InputLabel fw="bold">{t("Filter")}</InputLabel>
          {children}
          <Space
            style={{
              flexGrow: 1,
            }}
          />
          <Flex justify="space-between" gap="sm">
            <Button w="100%" onClick={onSearch}>
              {t("Search")}
            </Button>
            <Button w="100%" onClick={onClear} variant="outline">
              {t("Clear")}
            </Button>
          </Flex>
        </Flex>
      </Drawer>
      <Flex
        justify="end"
        align="center"
        gap="sm"
        mb="sm"
        visibleFrom="md"
      >
        {children}
        <Button onClick={onSearch}>{t("Search")}</Button>
        <Button onClick={onClear} variant="outline">
          {t("Clear")}
        </Button>
      </Flex>
    </>
  );
}
