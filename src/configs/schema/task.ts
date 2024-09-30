import { APP_ACTION_GROUPS, APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import {
  builder,
  numberSchema,
  optionalNumberSchema,
  optionalStringSchema,
  stringSchema,
  successSchema,
  timestampSchema,
} from "./_base";

export const registerTaskSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.REGISTER_TASK),
  params: z.object({
    title: stringSchema,
    description: stringSchema,
    assigneeId: optionalStringSchema,
    groupId: optionalStringSchema,
    group: optionalStringSchema,
    status: numberSchema,
    startDate: timestampSchema.optional(),
    endDate: timestampSchema.optional(),
  }),
  result: z.object({
    taskId: stringSchema,
  }),
});

export const addNoteSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.ADD_NOTE),
  params: z.object({
    taskId: stringSchema,
    note: stringSchema,
  }),
  result: z.object({
    noteId: stringSchema,
  }),
});

export const removeNoteSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.REMOVE_NOTE),
  params: z.object({
    taskId: stringSchema,
    noteId: stringSchema,
  }),
  result: successSchema,
});

export const updateTaskSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.UPDATE_TASK),
  params: z.object({
    taskId: stringSchema,
    groupId: optionalStringSchema,
    group: optionalStringSchema,
    title: optionalStringSchema,
    description: optionalStringSchema,
    startDate: timestampSchema.optional(),
    endDate: timestampSchema.optional(),
    assigneeId: optionalStringSchema,
    status: optionalNumberSchema,
  }),
  result: successSchema,
});

const noteSchema = z.object({
  id: stringSchema,
  content: stringSchema,
  userName: stringSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

const taskSchema = z.object({
  id: stringSchema,
  title: stringSchema,
  description: stringSchema,
  status: numberSchema,
  assigneeId: optionalStringSchema,
  reporterId: stringSchema,
  notes: noteSchema.array(),
  group: optionalStringSchema,
  groupId: optionalStringSchema,
  startDate: timestampSchema.optional(),
  endDate: timestampSchema.optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const getTasksSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.GET_TASKS),
  params: z.object({
    from: timestampSchema.optional(),
    to: timestampSchema.optional(),
    taskIds: stringSchema.array().optional(),
    assigneeId: optionalStringSchema,
    status: optionalNumberSchema,
    limit: optionalNumberSchema,
    cursor: optionalStringSchema,
  }),
  result: taskSchema.array(),
});

export const getTaskSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.GET_TASK),
  params: z.object({
    taskId: stringSchema,
  }),
  result: taskSchema,
});

export const deleteTaskSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.DELETE_TASK),
  params: z.object({
    taskId: stringSchema,
  }),
  result: successSchema,
});

export const getGroupsSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.TASK),
  action: z.literal(APP_ACTIONS.GET_GROUPS),
  params: z.object({}),
  result: z.array(
    z.object({
      id: stringSchema,
      title: stringSchema,
    }),
  ),
});
