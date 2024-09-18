import { callApi } from "@/common/helpers/axios";
import clientStore from "@/common/stores/client";
import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
} from "@/configs/enums/actions";
import {
  addNoteSchema,
  getTasksSchema,
  registerTaskSchema,
  removeNoteSchema,
  updateTaskSchema,
} from "@/configs/schema/task";
import { ClientMetaData } from "@/configs/types";
import * as z from "zod";
import { cache } from "../helpers/cache";
import logger from "../helpers/logger";
import { _getClient } from "./_helpers";

type TaskFromServer = z.infer<typeof getTasksSchema.result>[0];

const group = APP_ACTION_GROUPS.TASK;

export type Task = Omit<TaskFromServer, "status"> & {
  status: string;
};

export type Note = Task["notes"][0];

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
  }));
  logger.debug("Tasks", tasks);
  return tasks || [];
}

export async function registerTask(task: Task) {
  const action = APP_ACTIONS.REGISTER_TASK;
  const client = await _getClient();
  const res = await callApi(
    {
      group,
      action,
      payload: {
        title: task.title,
        assigneeId: task.assigneeId,
        description: task.description,
        status: _statusToId(task.status, client),
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
  await callApi(
    {
      group,
      action,
      payload: {
        taskId: task.id,
        title: task.title,
        assigneeId: task.assigneeId,
        description: task.description,
        startDate: task.startDate,
        status: _statusToId(task.status, client),
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
  return {
    id: "",
    title: "",
    description: "",
    reporterId: "",
    status: _statusIdToString(0),
    notes: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function statusColors() {
  if (cache.has("statusColors")) {
    return cache.get("statusColors") as Record<string, string>;
  }
  const client = clientStore.getState().client;
  const colors = Object.fromEntries(
    Object.values(client?.tasks?.statusMap || {}).map(
      ([value, , color, bg]) => [value, [color, bg]],
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
  logger.debug("Status map", map);
  if (map[status] === undefined) {
    throw new Error(`Unknown status: ${status}`);
  }
  return Number(map[status]);
}
