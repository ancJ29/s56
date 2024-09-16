import { failed } from "@/common/helpers/toast";
import useTranslation from "@/common/hooks/useTranslation";
import { Box, Button, Flex, Text, Textarea } from "@mantine/core";
import { useState } from "react";

function Input({ onSave }: { onSave?: (_: string) => void }) {
  const [note, setNote] = useState("");

  return (
    <>
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
    </>
  );
}

export function NoteInput({
  onSave,
}: {
  onSave?: (_: string) => void;
}) {
  const t = useTranslation();
  // const isMobile = useIsMobile();
  return (
    <Box>
      <Text fw="600" mt="xs">
        {t("Add your note")}
      </Text>
      <Input onSave={onSave} />
      {/* <Flex hiddenFrom="md" justify="end">
        <Button
          size="xs"
          mt="5px"
          mb={0}
          onClick={() => {
            if (isMobile) {
              modals.open({
                centered: true,
                withinPortal: true,
                size: "xs",
                padding: "xs",
                portalProps: {},
                title: "Add Your Note",
                children: (
                  <Input
                    onSave={async (note: string) => {
                      await onSave?.(note);
                      modals.closeAll();
                    }}
                  />
                ),
              });
            }
          }}
        >
          {t("Add your note")}
        </Button>
      </Flex>
      {isMobile ? <></> : <Input onSave={onSave} />} */}
    </Box>
  );
}
