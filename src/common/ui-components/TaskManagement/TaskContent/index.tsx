import logger from "@/common/helpers/logger";
import { failed, success } from "@/common/helpers/toast";
import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import {
  addNote,
  deleteTask,
  registerTask,
  removeNote,
  saveTask,
  type Group,
  type Task,
} from "@/common/services/task";
import useAuthStore from "@/common/stores/auth";
import { NoteInput } from "@/common/ui-components/TaskManagement/NoteInput";
import { TaskNote } from "@/common/ui-components/TaskManagement/TaskNote";
import { ONE_MINUTE } from "@/constants";
import { dropTime } from "@/utils";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  InputLabel,
  ScrollArea,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconInfoCircle, IconMessage } from "@tabler/icons-react";
import isEqual from "lodash.isequal";
import { useCallback, useMemo, useState } from "react";
import { UserSelector } from "../../UserManagement/UserSelector";
import { PrioritySelector } from "../PrioritySelector";
import { StatusSelector } from "../StatusSelector";

export function TaskContent({
  task,
  groups,
  onClose,
  onSave,
  onDelete,
}: {
  groups: Group[];
  task: Task;
  onClose?: () => void;
  onSave?: (_: Task) => void;
  onDelete?: (_: Task) => void;
}) {
  const t = useTranslation();
  const isMobile = useIsMobile();
  const { payload } = useAuthStore();
  const [form, setForm] = useState({ ...task });
  const isNew = !form.id;

  const onNoteSaved = useCallback(
    (note: string) => {
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
    },
    [form, payload?.userName, task.id],
  );

  if (!task) {
    return <></>;
  }

  if (isMobile) {
    return (
      <Container
        p={0}
        display="flex"
        style={{
          flexDirection: "column",
        }}
      >
        {isNew && (
          <>
            <GroupSelector
              groups={groups}
              form={form}
              setForm={setForm}
            />
            <TextInput
              w="100%"
              label={t("Task title")}
              placeholder={t("Task title")}
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.currentTarget.value });
              }}
            />
          </>
        )}
        <TitleAndDescription
          form={form}
          groups={groups}
          setForm={setForm}
        />
        <Tabs defaultValue="information">
          <Tabs.List>
            <Tabs.Tab
              disabled={isNew}
              value="information"
              leftSection={<IconInfoCircle />}
            >
              {t("Information")}
            </Tabs.Tab>
            <Tabs.Tab
              disabled={isNew}
              value="notes"
              leftSection={<IconMessage />}
            >
              {t("Notes")}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="information">
            <ProgressSlider form={form} setForm={setForm} />
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
      <TitleAndDescription
        groups={groups}
        form={form}
        setForm={setForm}
      />
      <ProgressSlider form={form} setForm={setForm} />
      <Attributes form={form} setForm={setForm} />
      <Flex justify="end" align="center" gap={5}>
        <SaveTaskButton
          task={task}
          form={form}
          onSave={onSave}
          onClose={onClose}
        />
        <RemoveTaskButton
          taskId={form.id}
          onSuccess={() => {
            onClose?.();
            onDelete?.(form);
          }}
        />
      </Flex>
      <Divider my={"1rem"} />
      <Notes form={form} setForm={setForm} />
      <Divider my={"1rem"} />
      <NoteInput disabled={!form.id} onSave={onNoteSaved} />
    </Container>
  );
}

function RemoveTaskButton({
  taskId,
  onSuccess,
}: {
  taskId?: string;
  onSuccess: () => void;
}) {
  const t = useTranslation();
  return (
    <Button
      disabled={!taskId}
      size="xs"
      color="red"
      onClick={() => {
        modals.openConfirmModal({
          title: t("Do you want to delete this task?"),
          children: (
            <Text size="sm">
              {t(
                "This action can not be undone. Are you sure you want to delete this task?",
              )}
            </Text>
          ),
          labels: { confirm: t("Confirm"), cancel: t("Cancel") },
          confirmProps: { color: "red" },
          onConfirm: () => {
            deleteTask(taskId || "")
              .then(() => {
                success("Task removed", "Your task is removed!");
                onSuccess();
              })
              .catch(() => {
                failed(
                  "Something went wrong",
                  "Can not remove your task!!!",
                );
              });
          },
        });
      }}
    >
      {t("Delete")}
    </Button>
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
    <Button
      size="xs"
      onClick={() => {
        if (isEqual(form, task)) {
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
  groups,
  setForm,
}: {
  groups: Group[];
  form: Task;
  setForm: (_: Task) => void;
}) {
  const t = useTranslation();
  return (
    <>
      <Box visibleFrom="md">
        <GroupSelector
          groups={groups}
          form={form}
          setForm={setForm}
        />
        <TextInput
          fw="600"
          label={t("Task title")}
          value={form.title}
          onChange={(e) => {
            setForm({
              ...form,
              title: e.currentTarget.value,
            });
          }}
        />
      </Box>
      <Textarea
        label={t("Description")}
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
  const isMobile = useIsMobile();

  const dateTimePickers = useMemo(() => {
    return (
      <>
        <DateTimePicker
          label={t("Start date")}
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
            const startDate = dropTime(
              date?.getTime() || 0,
              ONE_MINUTE,
            );
            setForm({
              ...form,
              startDate: startDate || 0,
            });
          }}
        />
        <DateTimePicker
          label={t("End date")}
          value={form.endDate ? new Date(form.endDate) : undefined}
          onChange={(date) => {
            const endDate = dropTime(
              date?.getTime() || 0,
              ONE_MINUTE,
            );
            setForm({
              ...form,
              endDate: endDate || 0,
            });
          }}
        />
      </>
    );
  }, [form, setForm, t]);

  return (
    <>
      <SimpleGrid cols={{ base: 2, md: 4 }} mt="sm" p={0}>
        {isMobile ? dateTimePickers : <></>}
        <UserSelector
          label={t("Reporter")}
          value={form.reporterId}
          disabled
        />
        <UserSelector
          label={t("Assignee")}
          value={form.assigneeId}
          onChange={(assigneeId) => {
            if (assigneeId && assigneeId !== form.assigneeId) {
              setForm({ ...form, assigneeId });
            }
          }}
        />
        <StatusSelector
          label={t("Status")}
          value={form.status}
          onChange={(status) => {
            if (status && status !== form.status) {
              setForm({ ...form, status });
            }
          }}
        />
        <PrioritySelector
          label={t("Priority")}
          value={form.priority}
          onChange={(priority) => {
            if (priority && priority !== form.priority) {
              setForm({ ...form, priority });
            }
          }}
        />
        {isMobile ? <></> : dateTimePickers}
      </SimpleGrid>
    </>
  );
}

function ProgressSlider({
  form,
  setForm,
}: {
  form: Task;
  setForm: (_: Task) => void;
}) {
  const t = useTranslation();
  if (!form.id) {
    return <></>;
  }
  return (
    <Box my="sm">
      <InputLabel fw="bold">
        {t("Progress")}: {Math.round(form.percent || 0)}%
      </InputLabel>
      <Slider
        value={form.percent}
        marks={[
          { value: 20, label: "20%" },
          { value: 50, label: "50%" },
          { value: 80, label: "80%" },
        ]}
        onChange={(percent) => {
          setForm({
            ...form,
            percent: Number(percent),
          });
        }}
      />
    </Box>
  );
}

function GroupSelector({
  groups,
  form,
  setForm,
}: {
  setForm: (_: Task) => void;
  form: Task;
  groups: Group[];
}) {
  const t = useTranslation();
  const [edit, { toggle }] = useDisclosure();
  return (
    <Flex justify="space-between" align="end" gap={"sm"}>
      {edit ? (
        <TextInput
          w="100%"
          label={t("Task group")}
          placeholder={t("Task title")}
          value={form.group}
          onChange={(e) => {
            const group = e.currentTarget.value;
            const groupId =
              groups.find((el) => el.title === group)?.id ||
              "00000000000000000000";
            setForm({ ...form, group, groupId });
          }}
        />
      ) : (
        <Select
          w="100%"
          label={t("Task group")}
          data={groups.map((el) => ({
            value: el.id,
            label: el.title,
          }))}
          value={form.groupId}
          onChange={(groupId) => {
            setForm({
              ...form,
              group:
                groups.find((el) => el.id === groupId)?.title || "",
              groupId: groupId || "00000000000000000000",
            });
          }}
        />
      )}
      <Button
        size="xs"
        variant="outline"
        fz="10px"
        w="5rem"
        onClick={toggle}
      >
        {t(edit ? "Select" : "Input")}
      </Button>
    </Flex>
  );
}
