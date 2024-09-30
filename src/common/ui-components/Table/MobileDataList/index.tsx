import useIsMobile from "@/common/hooks/useIsMobile";
import useTranslation from "@/common/hooks/useTranslation";
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
import { CNoRecord } from "../../CKits/CNoRecord";

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
  const isMobile = useIsMobile();
  const t = useTranslation();
  if (!isMobile) {
    return <></>;
  }
  return (
    <>
      <ScrollArea h={scrollAreaHeight} hiddenFrom="md">
        {!tableData.data.length ? (
          <Flex h="60vh" justify="center" align="center">
            <CNoRecord />
          </Flex>
        ) : (
          <Stack gap={gap}>
            {tableData.data.map((el, idx) => {
              return (
                <Card
                  key={idx}
                  withBorder
                  onClick={() => onClick?.(el)}
                >
                  {tableData.configs.map((config, idx) => {
                    let label = config.label || "";
                    if (typeof label === "string") {
                      label = t(label);
                    }
                    return (
                      <Flex justify="space-between" key={idx}>
                        <Text fw="500">{label}</Text>
                        {_content(config, el, t)}
                      </Flex>
                    );
                  })}
                </Card>
              );
            })}
          </Stack>
        )}
      </ScrollArea>
    </>
  );
}

function _content<T extends UnknownRecord>(
  config: TableDataConfig<T>,
  el: T,
  t?: (key: string) => string,
) {
  if (config.field) {
    const value = _render(el, config.field, t);
    return (
      <Text
        style={{
          ...config.styles?.mobile?.content,
        }}
      >
        {t?.(value) || value}
      </Text>
    );
  }
  if (config.render) {
    return config.render(el);
  }
  return "";
}

function _render<T>(
  el: T,
  field: keyof T,
  t?: (key: string) => string,
) {
  const value = field ? el[field] : undefined;
  if (["string", "number", "boolean"].includes(typeof value)) {
    const v = (value as string).toString();
    return t?.(v) || v;
  }
  return "";
}
