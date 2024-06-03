import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import { useEffect, useState } from "react";

interface Author {
  id: number;
  name: string;
}

export const BlogPostList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

/*
  const [authorIds, setAuthorIds] = useState<number[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    if (tableProps.dataSource) {
      const ids:any[] = tableProps.dataSource.map((item) => item.author_id);
      setAuthorIds(ids);
    }
  }, [tableProps.dataSource]);

  const { data: authorData, isLoading: authorLoading } = useMany<Author>({
    resource: "Authors",
    ids: authorIds,
  });

  useEffect(() => {
    if (authorData) {
      setAuthors(authorData.data);
    }
  }, [authorData]);

  const getAuthorName = (id: number) => {
    const author = authors.find((author) => author.id === id);
    return author ? author.name : "-";
  };
  */

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="content"
          title={"Content"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column
          //dataIndex="author_id"
          dataIndex="author_name"
          title={"Author"}
          //render={(value: any) => getAuthorName(value)}
        />
        <Table.Column dataIndex="status" title={"Status"} />
        <Table.Column
          dataIndex={["created_at"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
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
