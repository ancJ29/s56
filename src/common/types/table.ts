import { UnknownRecord } from "@/configs/types";
import { MantineStyleProp } from "@mantine/core";

export type TableDataConfig<T extends UnknownRecord> = {
  key?: string;
  field?: string;
  label?: string | React.ReactNode;
  styles?: {
    tableTh?: MantineStyleProp;
    mobile?: {
      content?: MantineStyleProp;
    };
  };
  render?: (props: T) => React.ReactNode;
};

export type TableData<T extends UnknownRecord> = {
  configs: TableDataConfig<T>[];
  styles?: {
    tableTr?: MantineStyleProp;
  };
  rowStyles?: (props: T) => MantineStyleProp;
  data: T[];
};
