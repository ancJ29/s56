import { callApi } from "@/common/helpers/axios";
import { APP_ACTIONS } from "@/configs/enums/actions";
import { addNoteSchema, getTasksSchema, removeNoteSchema, updateTaskSchema } from "@/configs/schema/task";
import { z } from "zod";

export type Task = z.infer<typeof getTasksSchema.result>[0];
export type Note = Task["notes"][0]

export async function getTasks(): Promise<Task[]> {
  const action = APP_ACTIONS.TASK_GET_TASKS;
  const res = await callApi(
    {
      action,
      payload: {},
    },
    getTasksSchema,
  ) as Task[];
  return res || [];
}

export async function saveTask(task: Task) {
  const action = APP_ACTIONS.TASK_UPDATE_TASK;
  await callApi(
    {
      action,
      payload: {
        taskId: task.id,
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
      },
    },
    updateTaskSchema
  );
}

export async function addNote(note: string, taskId: string) {
  const action = APP_ACTIONS.TASK_ADD_NOTE;
  const res = await callApi(
    {
      action,
      payload: {
        note, taskId
      },
    },
    addNoteSchema,
    {
      failed: null
    }
  );
  return res?.noteId;
}

export async function removeNote(noteId: string, taskId: string) {
  const action = APP_ACTIONS.TASK_REMOVE_NOTE;
  await callApi(
    {
      action,
      payload: {
        noteId,
        taskId
      },
    },
    removeNoteSchema,
  );
}
