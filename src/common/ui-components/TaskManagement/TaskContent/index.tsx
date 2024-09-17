import logger from "@/common/helpers/logger";
import { failed, success } from "@/common/helpers/toast";
import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import {
  addNote,
  registerTask,
  removeNote,
  saveTask,
  Task,
} from "@/common/services/task";
import useAuthStore from "@/common/stores/auth";
import { NoteInput } from "@/common/ui-components/TaskManagement/NoteInput";
import { TaskNote } from "@/common/ui-components/TaskManagement/TaskNote";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconInfoCircle,
  IconMessage,
} from "@tabler/icons-react";
import deepEqual from "lodash.isequal";
import { useCallback, useState } from "react";
import { UserSelector } from "../../UserManagement/UserSelector";
import { StatusSelector } from "../StatusSelector";

export function TaskContent({
  task,
  onClose,
  onSave,
}: {
  task: Task;
  onClose?: () => void;
  onSave?: (_: Task) => void;
}) {
  const t = useTranslation();
  const isMobile = useIsMobile();
  const { payload } = useAuthStore();
  const [form, setForm] = useState({ ...task });
  const isNew = !!form.id;

  const onNoteSaved = useCallback((note: string) => {
    const notes = form.notes || [];
    if (!payload?.userName) {
      throw new Error("Invalid payload");
    }
    addNote(note, task.id).then((noteId) => {
      if (noteId) {
        const now = Date.now();
        notes.push({
          id: noteId,
          content: note,
          userName: payload?.userName,
          createdAt: now,
          updatedAt: now,
        });
        setForm({ ...form, notes });
        success("Success", "Your note is added to the task");
      } else {
        failed("Something went wrong", "Can not save your note!!!");
      }
    });
  }, []);

  if (!task) {
    return <></>;
  }

  if (isMobile) {
    return (
      <Container
        display="flex"
        style={{
          flexDirection: "column",
        }}
      >
        <Flex align="center" justify="start" gap="sm" mb="xs">
          <IconArrowLeft onClick={onClose} />
          {isNew ? (
            <Text fw="bold">{form.title}</Text>
          ) : (
            <TextInput
              w="100%"
              placeholder={t("Title")}
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.currentTarget.value });
              }}
            />
          )}
        </Flex>
        <TitleAndDescription form={form} setForm={setForm} />
        <Tabs defaultValue="information">
          <Tabs.List>
            <Tabs.Tab
              disabled={!isNew}
              value="information"
              leftSection={<IconInfoCircle />}
            >
              {t("Information")}
            </Tabs.Tab>
            <Tabs.Tab
              disabled={!isNew}
              value="notes"
              leftSection={<IconMessage />}
            >
              {t("Notes")}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="information">
            <Attributes form={form} setForm={setForm} />
            <SaveTaskButton
              task={task}
              form={form}
              onSave={onSave}
              onClose={onClose}
            />
          </Tabs.Panel>
          <Tabs.Panel value="notes">
            <Notes form={form} setForm={setForm} />
            <NoteInput disabled={!form.id} onSave={onNoteSaved} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    );
  }

  return (
    <Container
      display="flex"
      h="98dvh"
      style={{
        flexDirection: "column",
      }}
    >
      <TitleAndDescription form={form} setForm={setForm} />
      <Attributes form={form} setForm={setForm} />
      <SaveTaskButton
        task={task}
        form={form}
        onSave={onSave}
        onClose={onClose}
      />
      <Divider my={"1rem"} />
      <Notes form={form} setForm={setForm} />
      <Divider my={"1rem"} />
      <NoteInput disabled={!form.id} onSave={onNoteSaved} />
    </Container>
  );
}

function SaveTaskButton({
  form,
  task,
  onSave,
  onClose,
}: {
  form: Task;
  task: Task;
  onSave?: (_: Task) => void;
  onClose?: () => void;
}) {
  const t = useTranslation();
  return (
    <Flex mt={"1rem"} justify="end">
      <Button
        size="xs"
        onClick={() => {
          if (deepEqual(form, task)) {
            failed("Invalid request", "Nothing to save!");
            return;
          }
          if (form.id) {
            saveTask(form)
              .then(() => {
                success("Task updated", "Your task is updated!");
                onSave?.(form);
                onClose?.();
              })
              .catch(() => {
                failed(
                  "Something went wrong",
                  "Can not save your task!!!",
                );
              });
          } else {
            registerTask(form)
              .then(() => {
                success("Task saved", "Your task is saved!");
                onSave?.(form);
                onClose?.();
              })
              .catch(() => {
                failed(
                  "Something went wrong",
                  "Can not save your task!!!",
                );
              });
          }
        }}
      >
        {t("Save")}
      </Button>
    </Flex>
  );
}

function Notes({
  form,
  setForm,
}: {
  form: Task;
  setForm: (_: Task) => void;
}) {
  const t = useTranslation();
  const isMobile = useIsMobile();

  if (!form.notes?.length) {
    return (
      <>
        <Text fw="600">{t("Notes")}</Text>
        <Flex
          style={
            isMobile
              ? undefined
              : {
                  flexGrow: 1,
                }
          }
          mih="100px"
          h={isMobile ? "30dvh" : undefined}
          align="center"
          justify="center"
        >
          {t("There's no note")}
        </Flex>
      </>
    );
  }
  return (
    <>
      <Text fw="600" my="xs">
        {t("Notes")} ({form.notes?.length || 0})
      </Text>
      <ScrollArea
        style={{
          flexGrow: 1,
          height: isMobile ? "40dvh" : undefined,
        }}
      >
        <Stack gap="1rem">
          {(form.notes || []).map((note) => (
            <TaskNote
              key={note.id}
              note={note}
              onRemove={() => {
                removeNote(note.id, form.id)
                  .then(() => {
                    success("Success", "Your note is removed");
                    setForm({
                      ...form,
                      notes: form.notes.filter(
                        (el) => el.id !== note.id,
                      ),
                    });
                  })
                  .catch(() => {
                    failed(
                      "Something went wrong",
                      "Can not remove your note!!!",
                    );
                  });
              }}
            />
          ))}
        </Stack>
      </ScrollArea>
    </>
  );
}

function TitleAndDescription({
  form,
  setForm,
}: {
  form: Task;
  setForm: (_: Task) => void;
}) {
  const t = useTranslation();
  return (
    <>
      <Box visibleFrom="md">
        <Text fw="600">{t("Title")}</Text>
        <TextInput
          fw="600"
          value={form.title}
          onChange={(e) => {
            setForm({
              ...form,
              title: e.currentTarget.value,
            });
          }}
        />
      </Box>
      <Text fw="600">{t("Description")}</Text>
      <Textarea
        value={form.description}
        rows={3}
        onChange={(e) => {
          setForm({
            ...form,
            description: e.currentTarget.value,
          });
        }}
      />
    </>
  );
}

function Attributes({
  form,
  setForm,
}: {
  form: Task;
  setForm: (_: Task) => void;
}) {
  const t = useTranslation();
  return (
    <>
      <SimpleGrid
        cols={{
          base: 1,
          md: 2,
        }}
      >
        <SimpleGrid cols={2}>
          <Text my="xs" fw="600">
            {t("Assignee")}
          </Text>
          <Text my="xs" fw="600">
            {t("Status")}
          </Text>
          <UserSelector
            value={form.assigneeId}
            onChange={(assigneeId) => {
              if (assigneeId && assigneeId !== form.assigneeId) {
                setForm({ ...form, assigneeId });
              }
            }}
          />
          <StatusSelector
            value={form.status}
            onChange={(status) => {
              if (status && status !== form.status) {
                setForm({ ...form, status });
              }
            }}
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Text my="xs" fw="600">
            {t("Start date")}
          </Text>
          <Text my="xs" fw="600">
            {t("End date")}
          </Text>

          <DateInput
            value={
              form.startDate ? new Date(form.startDate) : undefined
            }
            onChange={(date) => {
              logger.debug(
                "date",
                date,
                date?.getTime(),
                date ? new Date(date?.getTime()).toISOString() : "-",
              );
              setForm({
                ...form,
                startDate: date?.getTime() || 0,
              });
            }}
          />
          <DateInput
            value={form.endDate ? new Date(form.endDate) : undefined}
            onChange={(date) => {
              setForm({
                ...form,
                endDate: date?.getTime() || 0,
              });
            }}
          />
        </SimpleGrid>
      </SimpleGrid>
    </>
  );
}
