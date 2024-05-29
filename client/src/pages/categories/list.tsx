import React, { useState, useEffect, useRef } from "react";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, CrudFilters } from "@refinedev/core";
import { Space, Table, Input, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const CategoryList: React.FC = () => {
  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
  });

  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const oldValue = useRef<string | null>(null);

  useEffect(() => {
    // Debounce logic
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300); // 300ms debounce time

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchValue]);

  useEffect(() => {
    if (oldValue.current != debouncedValue) {
      const newFilters: CrudFilters = [
        {
          field: "title",
          operator: "contains",
          value: debouncedValue.length >= 3 ? debouncedValue : undefined,
        },
      ];
    
      setFilters(newFilters);
      oldValue.current = debouncedValue;
    }
  }, [debouncedValue, setFilters]);

  return (
    <List>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item>
          <Input
            placeholder="Search title"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>
      </Form>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
