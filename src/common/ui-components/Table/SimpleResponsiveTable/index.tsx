import { UnknownRecord } from "@/configs/types";
import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  MobileDataList,
  MobileDataListProps,
} from "../MobileDataList";
import { SimpleTable, SimpleTableProps } from "../SimpleTable";

export function SimpleResponsiveTable<T extends UnknownRecord>({
  scrollAreaHeight,
  ...props
}: MobileDataListProps<T> & SimpleTableProps<T>) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return isMobile ? (
    <MobileDataList scrollAreaHeight={scrollAreaHeight} {...props} />
  ) : (
    <SimpleTable {...props} />
  );
}
