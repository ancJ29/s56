import logger from "@/common/helpers/logger";
import { Button } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type SimpleFormProps<T> = {
  form: UseFormReturnType<T>;
  children?: React.ReactNode;
  submit?: {
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
        form.validate();
        if (form.isValid()) {
          logger.trace("submit...", payload);
          submit?.handler?.(payload);
        }
      })}
    >
      {children}
      {submit?.label && (
        <Button type="submit" radius="xl" mt={20}>
          {submit.label}
        </Button>
      )}
    </form>
  );
}
