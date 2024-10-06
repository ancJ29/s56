import { callApi } from "@/common/helpers/axios";
import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
} from "@/configs/enums/actions";
import {
  addNoteSchema,
  deleteTaskSchema,
  getGroupsSchema,
  getTasksSchema,
  registerTaskSchema,
  removeNoteSchema,
  updateTaskSchema,
} from "@/configs/schema/task";
import { ClientMetaData } from "@/configs/types";
import * as z from "zod";
import { cache } from "../helpers/cache";
import logger from "../helpers/logger";
import authStore from "../stores/auth";
import clientStore from "../stores/client";
import { _getClient } from "./_helpers";

type TaskFromServer = z.infer<typeof getTasksSchema.result>[0];

const group = APP_ACTION_GROUPS.TASK;

export type Task = Omit<TaskFromServer, "priority" | "status"> & {
  status: string;
  priority: string;
  assignee?: string;
};

export type Note = Task["notes"][0];

export type Group = z.infer<typeof getGroupsSchema.result>[0];

export async function getGroups() {
  const action = APP_ACTIONS.GET_GROUPS;
  return (
    (await callApi(
      {
        group,
        action,
        payload: {},
      },
      getGroupsSchema,
      {
        cached: true,
        key: "tasks.groups.4wS3maA",
      },
    )) || []
  );
}

export async function getTasks(filter?: {
  status?: string;
  assigneeId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Task[]> {
  const action = APP_ACTIONS.GET_TASKS;
  const client = await _getClient();
  const res = await callApi(
    {
      group,
      action,
      payload: {
        from: filter?.startDate?.getTime() || undefined,
        to: filter?.endDate?.getTime() || undefined,
        assigneeId: filter?.assigneeId || undefined,
        status: filter?.status
          ? _statusToId(filter.status, client)
          : undefined,
      },
    },
    getTasksSchema,
  );
  const tasks = res?.map(({ status: statusId, ...el }) => ({
    ...el,
    status: _statusIdToString(statusId, client),
    priority: _priorityIdToString(el.priority || 0, client),
    assignee: client?.users?.[el.assigneeId || ""]?.userName || "",
  }));
  logger.debug("Tasks", tasks);
  return tasks || [];
}

export async function deleteTask(taskId: string) {
  const action = APP_ACTIONS.DELETE_TASK;
  await callApi(
    {
      group,
      action,
      payload: {
        taskId,
      },
    },
    deleteTaskSchema,
  );
}

export async function registerTask(task: Task) {
  const action = APP_ACTIONS.REGISTER_TASK;
  const client = await _getClient();
  let groupId: string | undefined = task.groupId;
  if (!groupId || groupId === "00000000000000000000") {
    groupId = undefined;
  }
  const res = await callApi(
    {
      group,
      action,
      payload: {
        title: task.title,
        assigneeId: task.assigneeId,
        groupId,
        group: task.group,
        description: task.description,
        status: _statusToId(task.status, client),
        priority: _priorityToId(task.priority, client),
        startDate: task.startDate,
        endDate: task.endDate,
      },
    },
    registerTaskSchema,
  );
  return res?.taskId;
}

export async function saveTask(task: Task) {
  const action = APP_ACTIONS.UPDATE_TASK;
  const client = await _getClient();
  let groupId: string | undefined = task.groupId;
  if (!groupId || groupId === "00000000000000000000") {
    groupId = undefined;
  }
  await callApi(
    {
      group,
      action,
      payload: {
        taskId: task.id,
        title: task.title,
        assigneeId: task.assigneeId,
        groupId,
        group: task.group,
        description: task.description,
        startDate: task.startDate,
        status: _statusToId(task.status, client),
        priority: _priorityToId(task.priority, client),
        endDate: task.endDate,
      },
    },
    updateTaskSchema,
  );
}

export async function addNote(note: string, taskId: string) {
  const action = APP_ACTIONS.ADD_NOTE;
  const res = await callApi(
    {
      group,
      action,
      payload: {
        note,
        taskId,
      },
    },
    addNoteSchema,
    {
      failed: null,
    },
  );
  return res?.noteId;
}

export async function removeNote(noteId: string, taskId: string) {
  const action = APP_ACTIONS.REMOVE_NOTE;
  await callApi(
    {
      group,
      action,
      payload: {
        noteId,
        taskId,
      },
    },
    removeNoteSchema,
  );
}

export function blankTask(): Task {
  const client = clientStore.getState().client;
  return {
    id: "",
    title: "",
    description: "",
    reporterId: authStore.getState().payload?.id || "",
    priority: _priorityIdToString(1, client),
    status: _statusIdToString(0, client),
    startDate: new Date().setHours(8, 0, 0, 0),
    endDate: new Date().setHours(17, 0, 0, 0),
    percent: 0,
    notes: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function statusColors() {
  if (cache.has("statusColors")) {
    return cache.get("statusColors") as Record<
      string,
      [string, string, string]
    >;
  }
  const client = clientStore.getState().client;
  const colors = Object.fromEntries(
    Object.values(client?.tasks?.statusMap || {}).map(
      ([value, , badge, color, bg]) => [
        value,
        [badge, color, bg] as [string, string, string],
      ],
    ),
  );
  cache.set("statusColors", colors, { ttl: 1000 * 60 * 60 });
  return colors;
}

function _statusIdToString(
  statusId: number,
  client?: ClientMetaData,
) {
  const statusMap = client?.tasks?.statusMap || {};
  const [status] = statusMap[statusId] || ["Unknown", 0];
  return status;
}

function _statusToId(status: string, client?: ClientMetaData) {
  const statusMap = client?.tasks?.statusMap || {};
  const map = Object.fromEntries(
    Object.entries(statusMap).map(([key, [value]]) => [value, key]),
  );
  if (map[status] === undefined) {
    throw new Error(`Unknown status: ${status}`);
  }
  return Number(map[status]);
}

function _priorityIdToString(
  priorityId: number,
  client?: ClientMetaData,
) {
  const priorityMap = client?.tasks?.priorityMap || {};
  logger.info("Priority map", priorityMap, priorityMap[priorityId]);
  const [priority] = priorityMap[priorityId] || ["Unknown", 0];
  return priority;
}

function _priorityToId(priority: string, client?: ClientMetaData) {
  const priorityMap = client?.tasks?.priorityMap || {};
  const map = Object.fromEntries(
    Object.entries(priorityMap).map(([key, [value]]) => [value, key]),
  );
  if (map[priority] === undefined) {
    throw new Error(`Unknown priority: ${priority}`);
  }
  return Number(map[priority]);
}
