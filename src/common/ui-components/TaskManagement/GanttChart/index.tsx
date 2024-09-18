import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import { Task } from "@/common/services/task";
import { ONE_DAY } from "@/constants";
import { dropTime } from "@/utils";
import {
  Box,
  Center,
  Container,
  Flex,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo } from "react";
import { UserLabel } from "../../UserManagement/UserLabel";
import { StatusBadge } from "../StatusBadge";
import classes from "./styles.module.scss";

export function GanttChart({
  tasks,
  dense = true,
  total = 30,
  from,
  to,
  // startFrom = dropTime(Date.now(), ONE_DAY),
  onSelectTask,
}: {
  dense?: boolean;
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
  }, [tasks]);
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
              <Table.Th
                className={classes.headerHeight}
                hidden={dense}
              >
                {t("Status")}
              </Table.Th>
              <Table.Th
                className={classes.headerHeight}
                hidden={dense}
              >
                {t("Start")}
              </Table.Th>
              <Table.Th
                className={classes.headerHeight}
                hidden={dense}
              >
                {t("End")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map((task) => {
              return (
                <Table.Tr
                  key={task.id}
                  style={{
                    cursor: "pointer",
                  }}
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
                      <Box>
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
                              px={".5rem"}
                              py={0}
                              fz={"0.8rem"}
                              color="dimmed"
                              className={classes.subTitle}
                            >
                              <Flex
                                gap={5}
                                justify="start"
                                align="center"
                              >
                                {t("Assignee")}:{" "}
                                <UserLabel
                                  size="1.3rem"
                                  userId={task.assigneeId}
                                />
                              </Flex>
                              <StatusBadge status={task.status} />
                            </Flex>
                          </>
                        )}
                      </Box>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td
                    className={clsx(
                      classes.dateCell,
                      classes.ceilHeight,
                    )}
                    align="right"
                    hidden={dense}
                  >
                    <Flex
                      gap={5}
                      justify="space-between"
                      align="center"
                    >
                      <UserLabel
                        size="1.3rem"
                        userId={task.assigneeId}
                      />
                    </Flex>
                  </Table.Td>
                  <Table.Td
                    w="6rem"
                    className={clsx(
                      classes.dateCell,
                      classes.ceilHeight,
                    )}
                    hidden={dense}
                  >
                    <StatusBadge status={task.status} />
                  </Table.Td>
                  <Table.Td
                    className={clsx(
                      classes.dateCell,
                      classes.ceilHeight,
                    )}
                    hidden={dense}
                  >
                    {_dateString(task.startDate || 0)}
                  </Table.Td>
                  <Table.Td
                    className={clsx(
                      classes.dateCell,
                      classes.ceilHeight,
                    )}
                    hidden={dense}
                  >
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
              {tasks.map((task) => {
                return (
                  <Table.Tr key={task.id}>
                    {Array.from({ length: total }, (_, idx) => {
                      const ts = startFrom + idx * ONE_DAY + 1;
                      const start = task.startDate || 0;
                      const end = task.endDate || 0;
                      const active = ts > start && ts < end;
                      return (
                        <Table.Td
                          key={ts}
                          onClick={
                            active
                              ? () => onSelectTask(task.id)
                              : undefined
                          }
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
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Container>
      {!tasks.length && (
        <Container visibleFrom="md" fluid>
          <Flex
            h="20vh"
            w="100%"
            justify="center"
            style={{
              border: "1px solid #f0f0f0",
              borderTop: "none",
            }}
          >
            <Center>
              <IconDatabaseOff />
              {t("No records found")}
            </Center>
          </Flex>
        </Container>
      )}
    </>
  );
}

function _dateString(ts: number) {
  return dayjs(ts).format("MMM. DD");
}

function _dayString(ts: number) {
  return dayjs(ts).format("DD");
}
