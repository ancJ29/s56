import logger from "@/common/helpers/logger";
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
import { Navigate } from "react-router-dom";

const initialValues = {
  userName: "",
  password: "",
};

const validate = {
  password: (val: string) =>
    val.length <= 6
      ? "Password should include at least 6 characters"
      : null,
};

export default function Login() {
  const form = useForm({ initialValues, validate });
  const { payload, setToken } = useAuthStore();
  const width = useMatches({
    base: "70dvw",
    sm: "70dvw",
    lg: "30dvw",
  });
  if (payload?.id) {
    logger.info("User already logged in", payload);
    return <Navigate to="/dashboard" />;
  }
  logger.trace("Login page rendered");
  return (
    <Flex w="100dvw" h="100dvh" align="center" justify="center">
      <Center>
        <Paper radius="md" p="xl" withBorder w={width}>
          <Text size="lg" fw={500}>
            Login to your account
          </Text>
          <SimpleForm
            form={form}
            submit={{
              label: "Login",
              handler: (values) => {
                logger.trace("login...", values);
                login(values).then((token) => {
                  if (token) {
                    logger.info("login success", token);
                    setToken(token, true);
                  } else {
                    logger.error("login failed");
                  }
                });
              },
            }}
          >
            <Stack>
              <TextInput
                required
                label="Username"
                placeholder="Your Username"
                value={form.values.userName}
                onChange={(event) =>
                  form.setFieldValue(
                    "userName",
                    event.currentTarget.value,
                  )
                }
                radius="md"
              />
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue(
                    "password",
                    event.currentTarget.value,
                  )
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />
            </Stack>
          </SimpleForm>
        </Paper>
      </Center>
    </Flex>
  );
}
