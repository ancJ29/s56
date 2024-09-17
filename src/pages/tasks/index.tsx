import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import {
  blankTask,
  getTasks,
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
import { Flex, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { configs } from "./config";

export default function Tasks() {
  const isMobile = useIsMobile();
  const t = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [dense, { toggle }] = useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(
    undefined,
  );

  const filter = useForm<{
    title?: string;
    assigneeId?: string;
    status?: string;
  }>({
    initialValues: {
      title: "",
      assigneeId: "",
      status: "",
    },
  });

  useEffect(() => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    });
  }, []);

  const reload = useCallback(
    (filter?: { status?: string; assigneeId?: string }) => {
      getTasks(filter).then((tasks) => {
        setTasks(tasks);
      });
    },
    [filter],
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
    [tasks],
  );

  if (isMobile && selectedTask) {
    return (
      <CMobileFull
        onClose={onClose}
        title={
          selectedTask.id ? selectedTask.title : t("Add new task")
        }
      >
        <TaskContent
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
        <CSimpleFilter
          onSearch={() => {
            reload(filter.getValues());
          }}
          onClear={() => {
            filter.reset();
            reload();
          }}
        >
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
            {...filter.getInputProps("statusId")}
          />
        </CSimpleFilter>
      </Flex>
      <MobileDataList
        scrollAreaHeight="100%"
        onClick={(task) => selectTask(task.id)}
        tableData={{
          configs,
          data: tasks,
        }}
      />
      <GanttChart
        dense={dense}
        tasks={tasks}
        onSelectTask={selectTask}
      />
      <CDrawer
        opened={opened && Boolean(selectedTask)}
        onClose={onClose}
      >
        {selectedTask && (
          <TaskContent
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
