import { failed, success } from "@/common/helpers/toast";
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
import { SimpleResponsiveTable } from "@/common/ui-components/Table/SimpleResponsiveTable";
import {
  Button,
  InputLabel,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { configs } from "./config";

export default function Users() {
  const { height } = useViewportSize();
  const { payload } = useAuthStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <>
      <CAddIcon
        onClick={open}
        hidden={opened || payload?.isAdmin !== true}
      />
      <SimpleResponsiveTable
        scrollAreaHeight={height * 0.9}
        tableData={{ configs, data: users }}
      />
      <CDrawer onClose={close} opened={opened}>
        <InputForm />
      </CDrawer>
    </>
  );
}

function InputForm() {
  const { client } = useClientStore();
  const t = useTranslation();

  const departmentOptions = useMemo(() => {
    return Object.entries(client?.departments || {}).map(
      ([code, department]) => {
        return { value: code, label: t(department) };
      },
    );
  }, [t, client]);

  const form = useForm({
    initialValues: {
      userName: "",
      fullName: "",
      password: "",
      departmentCode: "",
    },
    validate: {
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
  return (
    <>
      <Text fw="bold" fz="lg" mb="lg">
        Add new user
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.validate();
          if (form.isValid()) {
            addUserByAdmin(form.values).then((res) => {
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
          }
        }}
      >
        <TextInput
          label={t("Full name")}
          withAsterisk
          {...form.getInputProps("fullName")}
        />
        <TextInput
          label={t("UserName")}
          withAsterisk
          {...form.getInputProps("userName")}
        />
        <InputLabel>{t("Password")}</InputLabel>
        <PasswordInput {...form.getInputProps("password")} />
        <InputLabel>{t("Department")}</InputLabel>
        <Select
          data={departmentOptions}
          {...form.getInputProps("departmentCode")}
        />
        <Button type="submit" mt="lg">
          {t("Register")}
        </Button>
      </form>
    </>
  );
}
