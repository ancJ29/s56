import { failed, success } from "@/common/helpers/toast";
import {
  addNote,
  getTasks,
  Note,
  removeNote,
  saveTask,
  type Task,
} from "@/common/services/task";
import useAuthStore from "@/common/stores/auth";
import { ONE_DAY } from "@/constants";
import {
  Avatar,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Drawer,
  em,
  Flex,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import deepEqual from "lodash.isequal";
import { useEffect, useState } from "react";

const height = "25px";
const dw = 75;
const total = 21;
const baseWidth = 40;
const dateCellWidth = `${dw}px`;
const tableWidth = `${total * baseWidth + dw}px`;
const now = Date.now();
const today = now - (now % ONE_DAY);

function GanttChart({
  tasks,
  onSelectTask,
}: {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}) {
  return (
    <>
      <Container
        fluid
        p={0}
        m={0}
        display="flex"
        style={{
          alignContent: "start",
          justifyContent: "start",
        }}
      >
        <Table
          withRowBorders
          withColumnBorders
          withTableBorder
          w={"60vw"}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th h={height}>Name</Table.Th>
              <Table.Th h={height}>Start</Table.Th>
              <Table.Th h={height}>End</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map((task, idx) => {
              return (
                <Table.Tr key={idx}>
                  <Table.Td
                    w="20vw"
                    h={height}
                    p="0"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Tooltip label={task.title} position="top-start">
                      <Text
                        onClick={() => onSelectTask(task)}
                        style={{
                          overflow: "hidden",
                        }}
                        h={height}
                      >
                        {task.title}
                      </Text>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td w={dateCellWidth} h={height}>
                    {_dateString(task.startDate || 0)}
                  </Table.Td>
                  <Table.Td w={dateCellWidth} h={height}>
                    {_dateString(task.endDate || 0)}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
        <ScrollArea
          style={{
            flexGrow: 1,
          }}
        >
          <Table
            w={tableWidth}
            withRowBorders
            withColumnBorders
            withTableBorder
            style={{
              flexGrow: 1,
            }}
          >
            <Table.Thead>
              <Table.Tr>
                {Array.from({ length: total }, (_, idx) => {
                  const ts = today + idx * ONE_DAY;
                  let value = _dayString(ts);
                  let w = `${baseWidth}px`;
                  if (idx === 0) {
                    w = dateCellWidth;
                    value = _dateString(ts);
                  }
                  return (
                    <Table.Th key={idx} h={height} w={w}>
                      {value}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tasks.map((task, idx) => {
                return (
                  <Table.Tr key={idx}>
                    {Array.from({ length: total }, (_, idx) => {
                      const ts = today + idx * ONE_DAY - 1;
                      let bg = "";
                      const start = task.startDate || 0;
                      const end = task.endDate || 0;
                      if (ts > start && ts < end) {
                        bg = "#edcc5f";
                      }
                      return (
                        <Table.Td key={idx} h={height} bg={bg}>
                          &nbsp;
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Container>
    </>
  );
}

export default function Tasks() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(
    undefined,
  );

  useEffect(() => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    });
  }, []);

  if (isMobile) {
    return (
      <Container
        h="80vh"
        display="flex"
        style={{
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Center>This page is not available on mobile devices</Center>
      </Container>
    );
  }
  return (
    <>
      <GanttChart
        tasks={tasks}
        onSelectTask={(task) => {
          setSelectedTask(task);
          open();
        }}
      />
      <Drawer
        position="right"
        radius="sm"
        size={"50vw"}
        opened={opened && Boolean(selectedTask)}
        onClose={() => {
          close();
          setSelectedTask(undefined);
        }}
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
        {selectedTask && (
          <TaskContent
            task={selectedTask}
            onSave={(task) => {
              setTasks(
                tasks.map((el) => {
                  if (el.id === task.id) {
                    return task;
                  }
                  return el;
                }),
              );
            }}
            onClose={() => {
              close();
              setSelectedTask(undefined);
            }}
          />
        )}
      </Drawer>
    </>
  );
}

function TaskContent({
  task,
  onClose,
  onSave,
}: {
  task: Task;
  onClose?: () => void;
  onSave?: (_: Task) => void;
}) {
  const { payload } = useAuthStore();
  const [form, setForm] = useState({ ...task });
  return (
    <Container
      display="flex"
      h="98vh"
      style={{
        flexDirection: "column",
      }}
    >
      <Text fw="600" mt="15px">
        Title
      </Text>
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
      <Text fw="600" mt="15px">
        Description
      </Text>
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
      <SimpleGrid cols={2}>
        <Text fw="600" mt="15px">
          Start date
        </Text>
        <Text fw="600" mt="15px">
          End date
        </Text>
        <DateInput
          value={
            form.startDate ? new Date(form.startDate) : undefined
          }
          onChange={(date) => {
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
      <Flex mt={"1rem"} justify="end">
        <Button
          w="10rem"
          onClick={() => {
            if (deepEqual(form, task)) {
              failed("Invalid request", "Nothing to save!");
              return;
            }
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
          }}
        >
          Save
        </Button>
      </Flex>
      <Divider my={"1rem"} />
      <Text fw="600" mt="15px">
        Notes
      </Text>
      <ScrollArea
        style={{
          flexGrow: 1,
        }}
      >
        {!form.notes?.length ? (
          <Flex mih="100px" align="center" justify="center">
            There's no note
          </Flex>
        ) : (
          <Stack gap="1rem">
            {(form.notes || []).map((note) => (
              <TaskNote
                key={note.id}
                note={note}
                onRemove={() => {
                  removeNote(note.id, task.id)
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
        )}
      </ScrollArea>
      <AddYourNote
        onSave={(note) => {
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
              failed(
                "Something went wrong",
                "Can not save your note!!!",
              );
            }
          });
        }}
      />
    </Container>
  );
}

function AddYourNote({ onSave }: { onSave?: (_: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <>
      <Text fw="600" mt="15px">
        Add your note
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
    </>
  );
}

function TaskNote({
  note,
  onRemove,
}: {
  note: Note;
  onRemove: () => void;
}) {
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

          <Button
            onClick={onRemove}
            size="xs"
            color="orange.5"
            radius="md"
            w="10rem"
          >
            Remove
          </Button>
        </Flex>
      </Card>
    </>
  );
}

function _dayString(ts: number) {
  return new Date(ts).getDate().toString();
}

function _dateString(ts: number) {
  if (ts === 0) {
    return "--";
  }
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Ma",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Sep 10
  const d = new Date(ts);
  return `${months[d.getMonth()]}. ${d.getDate()}`;
}
