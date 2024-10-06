import { failed, success } from "@/common/helpers/toast";
import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
import {
  addUserByAdmin,
  getUsers,
  User,
} from "@/common/services/users";
import useAuthStore from "@/common/stores/auth";
import useClientStore from "@/common/stores/client";
import { CAddIcon } from "@/common/ui-components/CKits/CAddIcon";
import { CDrawer } from "@/common/ui-components/CKits/CDrawer";
import { CMobileFull } from "@/common/ui-components/CKits/CMobileFull";
import { SimpleForm } from "@/common/ui-components/SimpleForm";
import { SimpleResponsiveTable } from "@/common/ui-components/Table/SimpleResponsiveTable";
import {
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./config";

export default function Users() {
  const t = useTranslation();
  const { height } = useViewportSize();
  const { payload } = useAuthStore();
  const isMobile = useIsMobile();
  const [opened, { open, close }] = useDisclosure(false);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  if (isMobile && opened) {
    return (
      <CMobileFull title={t("Add new user")} onClose={close}>
        <InputForm />
      </CMobileFull>
    );
  }

  return (
    <>
      <SimpleResponsiveTable
        scrollAreaHeight={height * 0.9}
        tableData={{ configs, data: users }}
      />
      <CDrawer onClose={close} opened={opened}>
        <InputForm withTitle />
      </CDrawer>
      <CAddIcon
        onClick={open}
        hidden={opened || payload?.permission?.isAdmin !== true}
      />
    </>
  );
}

function InputForm({ withTitle = false }: { withTitle?: boolean }) {
  const { client } = useClientStore();
  const t = useTranslation();

  const departmentOptions = useMemo(() => {
    return Object.entries(client?.departments || {}).map(
      ([code, department]) => {
        return { value: code, label: t(department) };
      },
    );
  }, [t, client]);

  const staffLevelOptions = useMemo(() => {
    return Object.entries(client?.staffLevels || {}).map(
      ([code, level]) => {
        return { value: code, label: t(level) };
      },
    );
  }, [t, client]);

  const form = useForm({
    initialValues: {
      userName: "",
      fullName: "",
      title: "",
      password: "",
      departmentCode: "",
      levelCode: "",
    },
    validate: {
      title: (value) =>
        value.length < 1 ? t("Staff title is required") : null,
      levelCode: (value) =>
        value.length < 1 ? t("Level is required") : null,
      departmentCode: (value) =>
        value.length < 1 ? t("Department is required") : null,
      fullName: (value) =>
        value.length < 1 ? t("Full name is required") : null,
      userName: (value) =>
        value.length < 5
          ? t("Name must have at least 5 characters")
          : null,
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value,
        )
          ? null
          : t(
              "Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
            ),
    },
  });

  const _register = useCallback(
    (values: {
      title: string;
      userName: string;
      fullName: string;
      password: string;
      levelCode: string;
      departmentCode: string;
    }) => {
      addUserByAdmin(values).then((res) => {
        if (res) {
          success(t("Success"), t("New user registered"));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          failed(
            t("Something went wrong"),
            t("Cannot to register new user"),
          );
        }
      });
    },
    [t],
  );

  return (
    <>
      <SimpleForm
        form={form}
        submit={{
          label: t("Register"),
          handler: _register,
        }}
      >
        <Stack gap="md">
          <Text fw="bold" fz="lg" hidden={!withTitle}>
            {t("Add new user")}
          </Text>
          <TextInput
            label={t("Full name")}
            withAsterisk
            {...form.getInputProps("fullName")}
          />
          <TextInput
            label={t("User name")}
            withAsterisk
            {...form.getInputProps("userName")}
          />
          <PasswordInput
            withAsterisk
            label={t("Password")}
            {...form.getInputProps("password")}
          />
          <TextInput
            label={t("Staff title")}
            withAsterisk
            {...form.getInputProps("title")}
          />
          <Select
            withAsterisk
            label={t("Department")}
            data={departmentOptions}
            {...form.getInputProps("departmentCode")}
          />
          <Select
            withAsterisk
            label={t("Staff level")}
            data={staffLevelOptions}
            {...form.getInputProps("levelCode")}
          />
        </Stack>
      </SimpleForm>
    </>
  );
}
