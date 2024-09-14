import { TableData, TableDataConfig } from "@/common/types";
import { UnknownRecord } from "@/configs/types";
import {
  Card,
  Flex,
  MantineSpacing,
  MantineStyleProps,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";

export type MobileDataListProps<T extends UnknownRecord> = {
  tableData: TableData<T>;
  gap?: MantineSpacing;
  scrollAreaHeight?: MantineStyleProps["h"];
  onClick?: (el: T) => void;
};

export function MobileDataList<T extends UnknownRecord>({
  tableData,
  gap = 2,
  scrollAreaHeight = "100%",
  onClick,
}: MobileDataListProps<T>) {
  return (
    <>
      <ScrollArea h={scrollAreaHeight} hiddenFrom="md">
        <Stack gap={gap}>
          {tableData.data.map((el, idx) => {
            return (
              <Card
                key={idx}
                withBorder
                onClick={() => onClick?.(el)}
              >
                {tableData.configs.map((config, idx) => {
                  return (
                    <Flex justify="space-between" key={idx}>
                      <Text fw="500">{config.label}</Text>
                      {_content(config, el)}
                    </Flex>
                  );
                })}
              </Card>
            );
          })}
        </Stack>
      </ScrollArea>
    </>
  );
}

function _content<T extends UnknownRecord>(
  config: TableDataConfig<T>,
  el: T,
) {
  if (config.field) {
    const value = _render(el, config.field);
    return (
      <Text
        style={{
          ...config.styles?.mobile?.content,
        }}
      >
        {value}
      </Text>
    );
  }
  if (config.render) {
    return config.render(el);
  }
  return "";
}

function _render<T>(el: T, field: keyof T) {
  const value = field ? el[field] : undefined;
  if (["string", "number", "boolean"].includes(typeof value)) {
    return (value as string).toString();
  }
  return "";
}
