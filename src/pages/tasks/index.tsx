import logger from "@/common/helpers/logger";
import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import {
  blankTask,
  getGroups,
  getTasks,
  type Group,
  type Task,
} from "@/common/services/task";
import { CAddIcon } from "@/common/ui-components/CKits/CAddIcon";
import { CDrawer } from "@/common/ui-components/CKits/CDrawer";
import { CMobileFull } from "@/common/ui-components/CKits/CMobileFull";
import { CSimpleFilter } from "@/common/ui-components/CKits/CSimpleFilter";
import { MobileDataList } from "@/common/ui-components/Table/MobileDataList";
import { GanttChart } from "@/common/ui-components/TaskManagement/GanttChart";
import { StatusSelector } from "@/common/ui-components/TaskManagement/StatusSelector";
import { TaskContent } from "@/common/ui-components/TaskManagement/TaskContent";
import { UserSelector } from "@/common/ui-components/UserManagement/UserSelector";
import { Flex, Space, Switch, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { IconCalendarMonth } from "@tabler/icons-react";
import isEqual from "lodash.isequal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./config";

type FilterProps = {
  title?: string;
  assigneeId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
};

const defaultFilter = {
  title: "",
  assigneeId: "",
  status: "",
  startDate: undefined,
  endDate: undefined,
};

export default function Tasks() {
  const isMobile = useIsMobile();
  const t = useTranslation();
  const [count, handlers] = useCounter(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [dense, { toggle }] = useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(
    undefined,
  );
  const [currentFilter, setCurrentFilter] = useState<FilterProps>({
    ...defaultFilter,
  });

  const filter = useForm<FilterProps>({
    initialValues: { ...defaultFilter },
  });

  useEffect(() => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    });
    getGroups().then((groups) => {
      setGroups(groups);
    });
  }, []);

  const reload = useCallback(
    (filter?: FilterProps) => {
      logger.debug("Filter", filter, currentFilter);
      if (isEqual(filter, currentFilter)) {
        return;
      }
      currentFilter.title = filter?.title;
      if (isEqual(filter, currentFilter)) {
        setCurrentFilter(filter || {});
        return;
      }
      getTasks(filter).then((tasks) => {
        setCurrentFilter(filter || {});
        setTasks(tasks);
      });
    },
    [currentFilter],
  );

  const selectTask = useCallback(
    (taskId?: string) => {
      let task: Task | undefined;
      if (taskId) {
        task = tasks.find((el) => el.id === taskId);
      } else {
        task = blankTask();
      }
      if (!task) {
        return;
      }
      setSelectedTask(task);
      open();
    },
    [open, tasks, isMobile],
  );

  const onClose = useCallback(() => {
    close();
    setSelectedTask(undefined);
  }, [isMobile, close]);

  const onTaskSaved = useCallback(
    (task?: Task) => {
      if (!task?.id) {
        window.location.reload();
        return;
      }
      if (task) {
        setTasks(
          tasks.map((el) => {
            if (el.id === task.id) {
              return task;
            }
            return el;
          }),
        );
      }
      onClose();
    },
    [tasks, onClose],
  );

  const _tasks = useMemo(() => {
    logger.debug("Filtering tasks...");
    const _tasks = tasks.filter((el) => {
      if (currentFilter.title) {
        return el.title.includes(currentFilter.title);
      }
      return true;
    });
    logger.debug(
      "Filtering tasks",
      currentFilter,
      "total",
      _tasks.length,
    );
    return _tasks;
  }, [tasks, currentFilter]);

  if (isMobile && selectedTask) {
    return (
      <CMobileFull
        onClose={onClose}
        title={
          selectedTask.id ? selectedTask.title : t("Add new task")
        }
      >
        <TaskContent
          groups={groups}
          task={selectedTask}
          onSave={onTaskSaved}
          onClose={onClose}
        />
      </CMobileFull>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="end" gap="md">
        <ViewSwitcher dense={dense} onToggle={toggle} />
        <Space />
        <Filter
          key={count}
          filter={filter}
          onSearch={() => {
            reload(filter.getValues());
          }}
          onClear={() => {
            filter.setValues({ ...defaultFilter });
            reload(filter.getValues());
            handlers.increment();
            logger.info("Filter cleared", filter.getValues());
          }}
        />
      </Flex>
      <MobileDataList
        scrollAreaHeight="100%"
        onClick={(task) => selectTask(task.id)}
        tableData={{
          configs,
          data: _tasks,
        }}
      />
      <GanttChart
        key={count}
        dense={dense}
        tasks={_tasks}
        from={currentFilter.startDate?.getTime()}
        to={currentFilter.endDate?.getTime()}
        onSelectTask={selectTask}
      />
      <CDrawer
        opened={opened && Boolean(selectedTask)}
        onClose={onClose}
      >
        {selectedTask && (
          <TaskContent
            groups={groups}
            task={selectedTask}
            onSave={onTaskSaved}
            onClose={onClose}
          />
        )}
      </CDrawer>
      <CAddIcon hidden={opened} onClick={() => selectTask()} />{" "}
    </>
  );
}

function ViewSwitcher({
  dense,
  onToggle,
}: {
  dense: boolean;
  onToggle: () => void;
}) {
  const t = useTranslation();
  return (
    <>
      <Switch
        visibleFrom="md"
        checked={dense}
        my="1rem"
        label={
          <b>{`${t("DENSE MODE")}: ${dense ? t("ON") : t("OFF")}`}</b>
        }
        onClick={onToggle}
      />
    </>
  );
}

export function Filter({
  filter,
  onSearch,
  onClear,
}: {
  filter: UseFormReturnType<
    FilterProps,
    (values: FilterProps) => FilterProps
  >;
  onSearch: () => void;
  onClear: () => void;
}) {
  const t = useTranslation();
  return (
    <CSimpleFilter onSearch={onSearch} onClear={onClear}>
      <DatePickerInput
        w={{ md: "15rem" }}
        rightSection={<IconCalendarMonth />}
        placeholder={t("Start ~ End")}
        type="range"
        valueFormat={"DD/MM/YYYY"}
        value={[
          filter.values.startDate || null,
          filter.values.endDate || null,
        ]}
        onChange={([start, end]) => {
          logger.debug("Date range", start, end);
          filter.setValues({
            ...filter.getValues(),
            startDate: start ? new Date(start) : undefined,
            endDate: end ? new Date(end) : undefined,
          });
        }}
      />
      <TextInput
        placeholder={t("Task title")}
        {...filter.getInputProps("title")}
      />
      <UserSelector
        placeholder={t("Assignee")}
        {...filter.getInputProps("assigneeId")}
      />
      <StatusSelector
        placeholder={t("Status")}
        {...filter.getInputProps("status")}
      />
    </CSimpleFilter>
  );
}
