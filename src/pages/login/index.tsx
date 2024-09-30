import logger from "@/common/helpers/logger";
import useTranslation from "@/common/hooks/useTranslation";
import { login } from "@/common/services/auth";
import useAuthStore from "@/common/stores/auth";
import { SimpleForm } from "@/common/ui-components/SimpleForm";
import {
  Center,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  useMatches,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { Navigate } from "react-router-dom";

export default function Login() {
  const t = useTranslation();
  const { payload, setToken } = useAuthStore();
  const form = useForm({
    initialValues: {
      userName: "",
      password: "",
    },
  });

  const width = useMatches({
    base: "70dvw",
    sm: "70dvw",
    lg: "30dvw",
  });

  const _login = useCallback(
    (values: { userName: string; password: string }) => {
      login(values).then((token) => {
        if (token) {
          logger.info("login success", token);
          setToken(token, true);
        } else {
          logger.error("login failed");
        }
      });
    },
    [setToken],
  );

  if (payload?.id) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Flex w="100dvw" h="100dvh" align="center" justify="center">
      <Center>
        <Paper radius="md" p="xl" withBorder w={width}>
          <Text size="lg" fw={500}>
            {t("Login to your account")}
          </Text>
          <SimpleForm
            form={form}
            submit={{
              label: t("Login"),
              handler: _login,
            }}
          >
            <Stack>
              <TextInput
                required
                label={t("User name")}
                placeholder={t("User name")}
                radius="md"
                {...form.getInputProps("userName")}
              />
              <PasswordInput
                required
                label={t("Password")}
                placeholder={t("Your password")}
                radius="md"
                {...form.getInputProps("password")}
              />
            </Stack>
          </SimpleForm>
        </Paper>
      </Center>
    </Flex>
  );
}
