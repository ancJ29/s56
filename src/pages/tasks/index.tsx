import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import {
  blankTask,
  getTasks,
  type Task,
} from "@/common/services/task";
import appStore from "@/common/stores/app";
import { CAddIcon } from "@/common/ui-components/CKits/CAddIcon";
import { CDrawer } from "@/common/ui-components/CKits/CDrawer";
import { MobileDataList } from "@/common/ui-components/Table/MobileDataList";
import { GanttChart } from "@/common/ui-components/TaskManagement/GanttChart";
import { TaskContent } from "@/common/ui-components/TaskManagement/TaskContent";
import { Flex, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { configs } from "./config";

export default function Tasks() {
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [dense, { toggle }] = useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(
    undefined,
  );

  useEffect(() => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    });
  }, []);

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
      if (isMobile) {
        appStore.getState().hideHeader();
      } else {
        open();
      }
    },
    [open, tasks, isMobile],
  );

  const onClose = useCallback(() => {
    if (isMobile) {
      appStore.getState().showHeader();
    } else {
      close();
    }
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
      <TaskContent
        task={selectedTask}
        onSave={onTaskSaved}
        onClose={onClose}
      />
    );
  }
  return (
    <>
      <ViewSwitcher dense={dense} onToggle={toggle} />
      <CAddIcon onClick={() => selectTask()} />
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
      <Flex justify="end">
        <Switch
          visibleFrom="md"
          checked={dense}
          my="1rem"
          label={
            <b>{`${t("DENSE MODE")}: ${dense ? t("ON") : t("OFF")}`}</b>
          }
          onClick={onToggle}
        />
      </Flex>
    </>
  );
}
