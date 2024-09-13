import { APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import { builder, numberSchema, optionalNumberSchema, optionalStringSchema, stringSchema, successSchema, timestampSchema } from "./_base";

export const registerTaskSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_REGISTER_TASK),
  params: z.object({
    title: stringSchema,
    description: stringSchema,
    assigneeId: optionalStringSchema,
    status: numberSchema,
  }),
  result: z.object({
    taskId: stringSchema,
  }),
});

export const addNoteSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_ADD_NOTE),
  params: z.object({
    taskId: stringSchema,
    note: stringSchema,
  }),
  result: z.object({
    noteId: stringSchema,
  }),
});

export const removeNoteSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_REMOVE_NOTE),
  params: z.object({
    taskId: stringSchema,
    noteId: stringSchema,
  }),
  result: successSchema,
});

export const updateTaskSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_UPDATE_TASK),
  params: z.object({
    taskId: stringSchema,
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

export const getTasksSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_GET_TASKS),
  params: z.object({
    taskIds: stringSchema.array().optional(),
    assigneeId: optionalStringSchema,
    status: optionalNumberSchema,
    limit: optionalNumberSchema,
    cursor: optionalStringSchema,
  }),
  result: z.object({
    id: stringSchema,
    title: stringSchema,
    description: stringSchema,
    status: numberSchema,
    assigneeId: optionalStringSchema,
    notes: noteSchema.array(),
    startDate: timestampSchema.optional(),
    endDate: timestampSchema.optional(),
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
  }).array(),
});

export const getTaskSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_GET_TASK),
  params: z.object({
    taskId: stringSchema,
  }),
  result: z.object({
    id: stringSchema,
    title: stringSchema,
    description: stringSchema,
    status: numberSchema,
    assigneeId: optionalStringSchema,
    notes: noteSchema.array(),
    startDate: timestampSchema.optional(),
    endDate: timestampSchema.optional(),
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
  }),
});


export const deleteTaskSchema = builder({
  action: z.literal(APP_ACTIONS.TASK_DELETE_TASK),
  params: z.object({
    taskId: stringSchema,
  }),
  result: successSchema,
});
