import useIsMobile from "@/common/hooks/useIsMobile";
import { UnknownRecord } from "@/configs/types";
import {
  MobileDataList,
  MobileDataListProps,
} from "../MobileDataList";
import { SimpleTable, SimpleTableProps } from "../SimpleTable";

export function SimpleResponsiveTable<T extends UnknownRecord>({
  scrollAreaHeight,
  ...props
}: MobileDataListProps<T> & SimpleTableProps<T>) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDataList scrollAreaHeight={scrollAreaHeight} {...props} />
  ) : (
    <SimpleTable {...props} />
  );
}
