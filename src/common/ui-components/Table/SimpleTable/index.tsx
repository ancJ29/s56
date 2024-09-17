import useTranslation from "@/common/hooks/useTranslation";
import { TableData } from "@/common/types";
import { UnknownRecord } from "@/configs/types";
import { Table, TableProps } from "@mantine/core";

export type SimpleTableProps<T extends UnknownRecord> = TableProps & {
  tableData: TableData<T>;
};

export function SimpleTable<T extends UnknownRecord>({
  striped = true,
  highlightOnHover = true,
  withTableBorder = true,
  withColumnBorders = true,
  tableData,
  ...props
}: SimpleTableProps<T>) {
  const t = useTranslation();
  return (
    <Table
      striped={striped}
      highlightOnHover={highlightOnHover}
      withColumnBorders={withColumnBorders}
      withTableBorder={withTableBorder}
      {...props}
    >
      <Table.Thead>
        <Table.Tr style={tableData?.styles?.tableTr}>
          {tableData.configs.map((config, idx) => {
            let label = config.label || "";
            if (typeof label === "string") {
              label = t(label);
            }
            return (
              <Table.Th style={config.styles?.tableTh} key={idx}>
                {label}
              </Table.Th>
            );
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tableData.data.map((el, idx) => (
          <Table.Tr key={idx}>
            {tableData.configs.map((config, idx) => {
              if (config.field) {
                return (
                  <Table.Td key={idx}>
                    {_render(el, config.field, t)}
                  </Table.Td>
                );
              }
              if (config.render) {
                return (
                  <Table.Td key={idx}>{config.render(el)}</Table.Td>
                );
              }
              return <Table.Td key={idx}></Table.Td>;
            })}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
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
