import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import { getTasks, type Task } from "@/common/services/task";
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
  const t = useTranslation();
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
    (taskId: string) => {
      const task = tasks.find((el) => el.id === taskId);
      if (task) {
        setSelectedTask(task);
        open();
      }
    },
    [open, tasks],
  );

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
          onClick={toggle}
        />
      </Flex>
      {isMobile ? (
        <MobileDataList
          scrollAreaHeight="100%"
          onClick={(task) => selectTask(task.id)}
          tableData={{
            configs,
            data: tasks,
          }}
        />
      ) : (
        <GanttChart
          dense={dense}
          tasks={tasks}
          onSelectTask={selectTask}
        />
      )}
      <CDrawer
        opened={opened && Boolean(selectedTask)}
        onClose={() => {
          close();
          setSelectedTask(undefined);
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
      </CDrawer>
    </>
  );
}
