import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import { statusColors, Task } from "@/common/services/task";
import { ONE_DAY } from "@/constants";
import { dropTime } from "@/utils";
import {
  Box,
  Container,
  Flex,
  MantineColor,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import clsx from "clsx";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { CNoRecord } from "../../CKits/CNoRecord";
import { UserLabel } from "../../UserManagement/UserLabel";
import { StatusBadge } from "../StatusBadge";
import classes from "./styles.module.scss";

export function GanttChart({
  tasks,
  displayGroup = true,
  dense,
  total = 30,
  from,
  to,
  // startFrom = dropTime(Date.now(), ONE_DAY),
  onSelectTask,
}: {
  displayGroup?: boolean;
  dense: boolean;
  total?: number;
  from?: number;
  to?: number;
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}) {
  const isMobile = useIsMobile();
  const t = useTranslation();
  const baseWidth = 40;
  const dw = 75;
  const [groupVisibilities, setGroupVisibilities] = useState<
    Record<string, boolean>
  >({});

  const groups = useMemo(() => {
    const groups = Object.fromEntries(
      tasks
        .filter((el) => Boolean(el.groupId))
        .map((el) => [
          el.groupId || "00000000000000000000",
          {
            groupId: el.groupId || "00000000000000000000",
            title: el.group || "",
            tasks: [] as Task[],
          },
        ]),
    );
    setGroupVisibilities(
      Object.fromEntries(
        Object.keys(groups).map((key) => [key, true]),
      ),
    );
    tasks.forEach((task) => {
      groups[task.groupId || "00000000000000000000"]?.tasks.push(
        task,
      );
    });
    return Object.values(groups).sort((a, b) =>
      a.groupId.localeCompare(b.groupId),
    );
  }, [tasks]);

  const { startFrom } = useMemo(() => {
    if (from && to) {
      return {
        startFrom: from - ONE_DAY,
        total: Math.ceil((to - from) / ONE_DAY) + 1,
      };
    }
    let first = Math.min(...tasks.map((task) => task.startDate || 0));
    if (first === Infinity || first === 0) {
      first = dropTime(Date.now(), ONE_DAY);
    } else {
      first = dropTime(first, ONE_DAY) - ONE_DAY;
    }
    const last = Math.max(...tasks.map((task) => task.endDate || 0));
    if (last === -Infinity || last < first) {
      return { startFrom: first, total: 21 };
    }
    let total = Math.floor((last - first) / ONE_DAY);
    total = Math.max(total, 7);
    return { startFrom: first, total };
  }, [from, tasks, to]);

  const header = useMemo(() => {
    return (
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={classes.headerHeight}>
            {t("Task Name")}
          </Table.Th>
          <Table.Th
            className={classes.headerHeight}
            w="9rem"
            hidden={dense}
          >
            {t("Assignee")}
          </Table.Th>
          <Table.Th className={classes.headerHeight} hidden={dense}>
            {t("Status")}
          </Table.Th>
          <Table.Th className={classes.headerHeight} hidden={dense}>
            {t("Start")}
          </Table.Th>
          <Table.Th className={classes.headerHeight} hidden={dense}>
            {t("End")}
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
    );
  }, [t, dense]);

  const toggle = useCallback((group: { groupId: string }) => {
    setGroupVisibilities((groupVisibilities) => ({
      ...groupVisibilities,
      [group.groupId]: !groupVisibilities[group.groupId],
    }));
  }, []);

  if (isMobile) {
    return <></>;
  }

  return (
    <>
      <Container
        visibleFrom="md"
        fluid
        className={clsx(classes.container)}
      >
        <Table
          withRowBorders
          withColumnBorders
          withTableBorder
          w={dense ? "35vw" : "100vw"}
          className={clsx(dense ? classes.dense : classes.normal)}
        >
          {header}
          <Table.Tbody>
            {displayGroup ? (
              groups.map((group) => (
                <GroupTasks
                  key={group.groupId}
                  opened={groupVisibilities[group.groupId] ?? true}
                  group={group}
                  dense={dense}
                  onToggle={() => toggle(group)}
                  onSelectTask={onSelectTask}
                />
              ))
            ) : (
              <TaskRows
                tasks={tasks}
                dense={dense}
                onSelectTask={onSelectTask}
              />
            )}
          </Table.Tbody>
        </Table>
        <ScrollArea
          style={{
            flexGrow: 1,
          }}
        >
          <Table
            w={`${total * baseWidth + dw}px`}
            withRowBorders
            withColumnBorders
            withTableBorder
            className={clsx(dense ? classes.dense : classes.normal)}
            style={{
              flexGrow: 1,
            }}
          >
            <Table.Thead>
              <Table.Tr>
                {Array.from({ length: total }, (_, idx) => {
                  const ts = startFrom + idx * ONE_DAY;
                  return (
                    <Table.Th
                      key={ts}
                      className={clsx(classes.headerHeight, {
                        [classes.dateCell]: idx === 0,
                      })}
                      style={{
                        cursor: "pointer",
                      }}
                      w={idx === 0 ? undefined : `${baseWidth}px`}
                    >
                      <Tooltip
                        label={_dateString(ts)}
                        position="top-start"
                      >
                        <span>
                          {idx === 0
                            ? _dateString(ts)
                            : _dayString(ts)}
                        </span>
                      </Tooltip>
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayGroup ? (
                groups.map((group) => {
                  return (
                    <GroupDates
                      key={group.groupId}
                      opened={
                        groupVisibilities[group.groupId] ?? true
                      }
                      group={group}
                      total={total}
                      startFrom={startFrom}
                      onToggle={() => {
                        setGroupVisibilities({
                          ...groupVisibilities,
                          [group.groupId]:
                            !groupVisibilities[group.groupId],
                        });
                      }}
                      onSelectTask={onSelectTask}
                    />
                  );
                })
              ) : (
                <TaskDatesRows
                  tasks={tasks}
                  total={total}
                  startFrom={startFrom}
                  onSelectTask={onSelectTask}
                />
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Container>
      {!tasks.length && (
        <Container visibleFrom="md" fluid>
          <Flex
            h="30vh"
            w="100%"
            justify="center"
            style={{
              border: "1px solid #f0f0f0",
              borderTop: "none",
            }}
          >
            <CNoRecord />
          </Flex>
        </Container>
      )}
    </>
  );
}

function TaskRows({
  opened,
  tasks,
  dense,
  onSelectTask,
}: {
  opened?: boolean;
  tasks: Task[];
  dense: boolean;
  onSelectTask: (taskId: string) => void;
}) {
  const colors = statusColors();
  return (
    <>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          bg={colors[task.status]?.[2]}
          dense={dense}
          onSelectTask={onSelectTask}
          hidden={!opened}
        />
      ))}
    </>
  );
}

function TaskRow({
  hidden = false,
  task,
  dense,
  bg,
  onSelectTask,
}: {
  bg: MantineColor;
  hidden?: boolean;
  dense: boolean;
  task: Task;
  onSelectTask: (taskId: string) => void;
}) {
  const t = useTranslation();
  return (
    <Table.Tr
      bg={bg}
      hidden={hidden}
      onClick={() => onSelectTask(task.id)}
    >
      <Table.Td
        w={dense ? "100%" : undefined}
        p={0}
        style={{
          cursor: "pointer",
        }}
        className={classes.ceilHeight}
      >
        <Tooltip label={task.title} position="top-start">
          <Box px="sm" py={0}>
            <Text
              className={classes.title}
              style={{
                overflow: "hidden",
              }}
            >
              {task.title}
            </Text>
            {dense && (
              <>
                <Flex
                  justify="space-between"
                  align="center"
                  fz={"0.8rem"}
                  ml="sm"
                  gap={20}
                  color="dimmed"
                  className={classes.subTitle}
                >
                  <Flex gap={5} align="center">
                    <span>{t("Assignee")}:</span>
                    <Text fw="500" fz="sm">
                      {task.assignee || "--"}
                    </Text>
                  </Flex>
                  <Flex gap={5} align="center">
                    <span>{t("Status")}:</span>
                    <StatusBadge status={task.status} />
                  </Flex>
                </Flex>
              </>
            )}
          </Box>
        </Tooltip>
      </Table.Td>
      <Table.Td
        className={clsx(classes.dateCell, classes.ceilHeight)}
        align="right"
        hidden={dense}
      >
        <Flex gap={5} justify="space-between" align="center">
          <UserLabel size="1.3rem" userId={task.assigneeId} />
        </Flex>
      </Table.Td>
      <Table.Td
        w="6rem"
        className={clsx(classes.dateCell, classes.ceilHeight)}
        hidden={dense}
      >
        <StatusBadge status={task.status} />
      </Table.Td>
      <Table.Td
        className={clsx(classes.dateCell, classes.ceilHeight)}
        hidden={dense}
      >
        {_dateString(task.startDate || 0)}
      </Table.Td>
      <Table.Td
        className={clsx(classes.dateCell, classes.ceilHeight)}
        hidden={dense}
      >
        {_dateString(task.endDate || 0)}
      </Table.Td>
    </Table.Tr>
  );
}

export function TaskDatesRows({
  opened,
  tasks,
  total,
  startFrom,
  onSelectTask,
}: {
  opened?: boolean;
  tasks: Task[];
  total: number;
  startFrom: number;
  onSelectTask: (taskId: string) => void;
}) {
  const colors = statusColors();
  return (
    <>
      {tasks.map((task) => (
        <TaskDatesRow
          hidden={!opened}
          key={task.id}
          task={task}
          total={total}
          bg={colors[task.status]?.[2]}
          startFrom={startFrom}
          onSelectTask={onSelectTask}
        />
      ))}
    </>
  );
}

function TaskDatesRow({
  hidden = false,
  bg,
  task,
  total,
  startFrom,
  onSelectTask,
}: {
  bg?: MantineColor;
  hidden?: boolean;
  task: Task;
  total: number;
  startFrom: number;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <Table.Tr
      bg={bg}
      hidden={hidden}
      style={{
        cursor: "pointer",
      }}
    >
      {Array.from({ length: total }, (_, idx) => {
        const ts = startFrom + idx * ONE_DAY + 1;
        const start = task.startDate || 0;
        const end = (task.endDate || 0) + ONE_DAY;
        const active = ts > start && ts < end;
        return (
          <Table.Td
            key={ts}
            onClick={active ? () => onSelectTask(task.id) : undefined}
            className={clsx(classes.ceilHeight, {
              [classes.activeCell]: active,
            })}
          >
            &nbsp;
          </Table.Td>
        );
      })}
    </Table.Tr>
  );
}

function GroupTasks({
  group,
  dense,
  opened = true,
  onToggle,
  onSelectTask,
}: {
  opened?: boolean;
  dense: boolean;
  group: {
    groupId: string;
    title: string;
    tasks: Task[];
  };
  onToggle?: () => void;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <>
      <Table.Tr
        p={0}
        className={classes.ceilHeight}
        style={{
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <Table.Td
          colSpan={dense ? 1 : 5}
          bg="#ccc"
          fw="bold"
          className={classes.ceilHeight}
        >
          {group.title}
        </Table.Td>
      </Table.Tr>
      <TaskRows
        opened={opened}
        tasks={group.tasks}
        dense={dense}
        onSelectTask={onSelectTask}
      />
    </>
  );
}

function GroupDates({
  group,
  total,
  startFrom,
  opened = true,
  onToggle,
  onSelectTask,
}: {
  opened?: boolean;
  total: number;
  startFrom: number;
  group: {
    groupId: string;
    title: string;
    tasks: Task[];
  };
  onToggle?: () => void;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <>
      <Table.Tr
        p={0}
        className={classes.ceilHeight}
        style={{
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <Table.Td
          colSpan={total}
          bg="#ccc"
          className={classes.ceilHeight}
          c="#ccc"
        >
          aaa
        </Table.Td>
      </Table.Tr>
      <TaskDatesRows
        opened={opened}
        tasks={group.tasks}
        total={total}
        startFrom={startFrom}
        onSelectTask={onSelectTask}
      />
    </>
  );
}

function _dateString(ts: number) {
  return dayjs(ts).format("MMM. DD");
}

function _dayString(ts: number) {
  return dayjs(ts).format("DD");
}
