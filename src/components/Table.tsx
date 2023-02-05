import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';
import { useLayoutEffect, useRef, useState } from 'react';

const Table = <T extends Object>({ dataSource, ...props }: AntdTableProps<T>) => {

  const TABLE_HEADER_HEIGHT = 55
  const [tableHeight, setTableHeight] = useState<number>(600);
  const tableRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!tableRef.current) { return }

    const node = tableRef.current;
    const { top } = node.getBoundingClientRect();
    setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT);
  }, [tableRef]);

  return (
    <AntdTable
      ref={tableRef}
      scroll={{ y: tableHeight }}
      dataSource={dataSource?.map((data, index) => ({...data, key: index}))}
      {...props}
    />
  )
}

export default Table