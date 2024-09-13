import { SimpleResponsiveTable } from "@/common/ui-components/Table/SimpleResponsiveTable";
import { useViewportSize } from "@mantine/hooks";
import { configs, data } from "./config";

export default function Client() {
  const { height } = useViewportSize();

  return (
    <>
      <SimpleResponsiveTable
        scrollAreaHeight={height * 0.9}
        tableData={{ configs, data }}
      />
    </>
  );
}
