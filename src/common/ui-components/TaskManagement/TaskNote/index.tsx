import {
  Avatar,
  Card,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

type NoteProps = {
  id: string;
  content: string;
  userName: string;
  createdAt: number;
};

export function TaskNote({
  note,
  onRemove,
}: {
  note: NoteProps;
  onRemove: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <>
      <Card shadow="sm" padding="xs" radius="md" withBorder>
        <Text size="sm">{note.content}</Text>
        <Flex mt=".5rem" justify="space-between" align="end">
          <Flex
            mt=".5rem"
            justify="space-between"
            align="center"
            gap={5}
          >
            <Avatar size="sm" />
            <Text size="sm" c="dimmed">
              {note.userName}@
              {new Date(note.createdAt).toLocaleString()}
            </Text>
          </Flex>
          <IconTrash color={theme.colors.red[4]} onClick={onRemove} />
        </Flex>
      </Card>
    </>
  );
}
