import { failed } from "@/common/helpers/toast";
import useTranslation from "@/common/hooks/useTranslation";
import {
  Box,
  Button,
  Flex,
  MantineSize,
  Text,
  Textarea,
} from "@mantine/core";
import { useState } from "react";

export function NoteInput({
  onSave,
  visibleFrom,
  hiddenFrom,
}: {
  visibleFrom?: MantineSize | (string & {}) | undefined;
  hiddenFrom?: MantineSize | (string & {}) | undefined;
  onSave?: (_: string) => void;
}) {
  const t = useTranslation();
  const [note, setNote] = useState("");
  return (
    <Box visibleFrom={visibleFrom} hiddenFrom={hiddenFrom}>
      <Text fw="600" mt="15px">
        {t("Add your note")}
      </Text>
      <Textarea
        rows={5}
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
        }}
      />
      <Flex justify="end" mt=".3rem">
        <Button
          w="5rem"
          size="xs"
          fz={10}
          p={1}
          onClick={() => {
            const _note = note.trim();
            setNote("");
            if (_note.length) {
              onSave?.(note);
            } else {
              failed("Invalid Request", "Can not save blank note!!!");
            }
          }}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
}
