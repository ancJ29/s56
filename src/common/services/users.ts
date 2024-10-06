import { callApi } from "@/common/helpers/axios";
import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
} from "@/configs/enums/actions";
import {
  addUserByAdminSchema,
  getAllUserSchema,
} from "@/configs/schema/user";
import { hashMd5 } from "@/utils";
import * as z from "zod";
import { _clientId, _getClient } from "./_helpers";

export type User = z.infer<typeof getAllUserSchema.result>[0] & {
  department?: string;
};

const group = APP_ACTION_GROUPS.USER;

export async function addUserByAdmin({
  userName,
  password,
  fullName,
  title,
  levelCode,
  departmentCode,
}: {
  title: string;
  userName: string;
  password: string;
  fullName?: string;
  levelCode: string;
  departmentCode?: string;
}) {
  const action = APP_ACTIONS.ADD_USER_BY_ADMIN;
  const res = await callApi(
    {
      group,
      action,
      payload: {
        userName,
        title,
        fullName,
        password: hashMd5(password),
        clientId: _clientId(),
        levelCode,
        departmentCode,
      },
    },
    addUserByAdminSchema,
  );
  return res?.success || false;
}

export async function getUsers(): Promise<User[]> {
  const action = APP_ACTIONS.GET_ALL_USERS;
  const client = await _getClient();
  const departments = client?.departments || {};
  const users = await callApi(
    {
      group,
      action,
      payload: {
        clientId: _clientId(),
      },
    },
    getAllUserSchema,
    {
      failed: null,
    },
  );
  return (users || []).map((user) => {
    return {
      ...user,
      department: user.departmentCode
        ? departments[user.departmentCode]
        : "",
    };
  });
}
