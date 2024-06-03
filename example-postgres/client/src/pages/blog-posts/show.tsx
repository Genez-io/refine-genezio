import {
  DateField,
  MarkdownField,
  NumberField,
  Show,
  TextField,
} from "@refinedev/antd";
import { useOne, useShow, useMany } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const BlogPostShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const categoryIds = record?.category_ids ?? [];
  const { data: categoryData, isLoading: isCategoryLoading } = useMany({
    resource: "Categories",
    ids: categoryIds,
  });

  const categoryNames = categoryData?.data?.map((category:any) => category.title) || [];

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>{"Title"}</Title>
      <TextField value={record?.title} />
      <Title level={5}>{"Content"}</Title>
      <MarkdownField value={record?.content} />
      <Title level={5}>{"Author"}</Title>
      <TextField value={record?.author_name} />
      <Title level={5}>{"Categories"}</Title>
      <TextField value={categoryNames.join(", ")} />
      <Title level={5}>{"Status"}</Title>
      <TextField value={record?.status} />
      <Title level={5}>{"Created At"}</Title>
      <DateField value={record?.created_at} />
    </Show>
  );
};
