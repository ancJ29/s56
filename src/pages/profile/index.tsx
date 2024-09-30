import { failed, success } from "@/common/helpers/toast";
import useTranslation from "@/common/hooks/useTranslation";
import { updatePassword } from "@/common/services/auth";
import authStore, {
  default as useAuthStore,
} from "@/common/stores/auth";
import { SimpleForm } from "@/common/ui-components/SimpleForm";
import {
  Center,
  Flex,
  Paper,
  PasswordInput,
  TextInput,
  useMatches,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";

export default function Profile() {
  const { payload } = useAuthStore();
  const t = useTranslation();
  const width = useMatches({
    base: "70dvw",
    sm: "70dvw",
    lg: "30dvw",
  });
  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      password: "",
    },
    validate: ({ newPassword, confirmPassword, password }) => {
      const errors: {
        confirmPassword: string | null;
        newPassword: string | null;
      } = {
        confirmPassword: null,
        newPassword: null,
      };
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = t("Passwords do not match");
      }
      if (newPassword === password) {
        errors.newPassword = t(
          "New password cannot be the same as the old one",
        );
      }
      return errors;
    },
  });

  const _updatePassword = useCallback(
    (values: { password: string; newPassword: string }) => {
      updatePassword(values).then((res) => {
        form.reset();
        if (res) {
          success(
            t("Password Updated"),
            t("Your password has been updated"),
            "bottom-right",
          );
          setTimeout(() => {
            authStore.getState().logout();
          }, 200);
        } else {
          failed(
            t("Something went wrong"),
            t("Can not update password!!!"),
            "bottom-right",
          );
        }
      });
    },
    [form, t],
  );
  return (
    <>
      <Flex w="100dvw" h="80dvh" align="center" justify="center">
        <Center>
          <Paper radius="md" p="xl" withBorder w={width}>
            <SimpleForm
              form={form}
              submit={{
                label: t("Update Password"),
                handler: _updatePassword,
              }}
            >
              <Flex
                gap={10}
                direction="column"
                justify="center"
                align="center"
                w="100%"
              >
                <TextInput
                  w="100%"
                  disabled
                  label={t("User name")}
                  value={payload?.userName}
                />
                <PasswordInput
                  w="100%"
                  label={t("Password")}
                  value={form.values.password}
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  w="100%"
                  label={t("New Password")}
                  value={form.values.newPassword}
                  {...form.getInputProps("newPassword")}
                />
                <PasswordInput
                  w="100%"
                  label={t("Confirm New Password")}
                  value={form.values.confirmPassword}
                  {...form.getInputProps("confirmPassword")}
                />
              </Flex>
            </SimpleForm>
          </Paper>
        </Center>
      </Flex>
    </>
  );
}
