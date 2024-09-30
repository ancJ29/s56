import useTranslation from "@/common/hooks/useTranslation";
import { Center, Flex } from "@mantine/core";
import { IconNotesOff } from "@tabler/icons-react";

export function CNoRecord() {
  const t = useTranslation();
  return (
    <Flex direction="column" justify="center">
      <Center>
        <IconNotesOff size={"3rem"} />
      </Center>
      <Center>{t("No records found")}</Center>
    </Flex>
  );
}
