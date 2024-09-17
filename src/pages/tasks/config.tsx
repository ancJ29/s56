import { Task } from "@/common/services/task";
import { StatusBadge } from "@/common/ui-components/TaskManagement/StatusBadge";
import { UserLabel } from "@/common/ui-components/UserManagement/UserLabel";
import { Text } from "@mantine/core";
import dayjs from "dayjs";

export const configs = [
  {
    key: "Task Title",
    label: "Task",
    render: (task: Task) => {
      return (
        <>
          <Text
            maw="50vw"
            hiddenFrom="md"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.title}
          </Text>
          <Text visibleFrom="md">{task.title}</Text>
        </>
      );
    },
    styles: {
      mobile: {
        content: {
          maxWidth: "60%",
          overflow: "hidden",
          height: "1.5rem",
        },
      },
    },
  },
  {
    key: "assignee",
    label: "Assignee",
    render: (task: Task) => {
      return <UserLabel size="1rem" userId={task.assigneeId} />;
    },
  },
  {
    key: "period",
    label: "Period",
    render: (task: Task) => {
      return `${_dateString(task.startDate)} - ${_dateString(task.endDate)}`;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (task: Task) => {
      return <StatusBadge status={task.status} />;
    },
  },
  {
    key: "reporter",
    label: "Reporter",
    render: (task: Task) => {
      return <UserLabel size="1rem" userId={task.reporterId} />;
    },
  },
];

function _dateString(ts?: number) {
  return dayjs(ts).format("MMM. DD");
}
