import logger from "@/common/helpers/logger";
import { Button, Flex, FlexProps } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type SimpleFormProps<T> = {
  form: UseFormReturnType<T>;
  children?: React.ReactNode;
  submit?: {
    justify?: FlexProps["justify"];
    handler?: (values: T) => void;
    label?: string;
  };
};

export function SimpleForm<T extends Record<string, string>>({
  form,
  children,
  submit,
}: SimpleFormProps<T>) {
  return (
    <form
      onSubmit={form.onSubmit(async () => {
        const payload = form.getValues();
        logger.trace("submit...", payload);
        form.validate();
        if (form.isValid()) {
          logger.trace("submit...", payload);
          submit?.handler?.(payload);
        }
      })}
    >
      {children}
      {submit?.label && (
        <Flex justify={submit?.justify || "start"}>
          <Button type="submit" radius="xl" mt={20}>
            {submit.label}
          </Button>
        </Flex>
      )}
    </form>
  );
}
