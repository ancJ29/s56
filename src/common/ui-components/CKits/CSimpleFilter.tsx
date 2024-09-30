import useTranslation from "@/common/hooks/useTranslation";
import {
  ActionIcon,
  Box,
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
    <Box
      m={0}
      p={0}
      bg="white"
      style={{
        zIndex: 100,
        position: "relative",
      }}
    >
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
            <Button
              w="100%"
              onClick={() => {
                onSearch?.();
                close();
              }}
            >
              {t("Search")}
            </Button>
            <Button
              w="100%"
              onClick={() => {
                onClear?.();
                close();
              }}
              variant="outline"
            >
              {t("Clear")}
            </Button>
          </Flex>
        </Flex>
      </Drawer>
      <Flex hiddenFrom="md" pb="xs">
        <ActionIcon m={0} variant="transparent" onClick={open}>
          <IconFilter size={"1rem"} />
        </ActionIcon>
        <Button onClick={onClear} variant="outline" size="xs">
          {t("Clear")}
        </Button>
      </Flex>
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
    </Box>
  );
}
