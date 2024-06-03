import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select, Checkbox } from "antd";

export const BlogPostEdit = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm({});
  const [searchParams] = useSearchParams();

  const blogPostsData = queryResult?.data?.data;

  const { selectProps } = useSelect({
    resource: "Authors",
    optionLabel: "name"
  });

  useEffect(() => {
    const author_id = searchParams.get("author_id");

    if (author_id && author_id !== "null") {
      formProps.form?.setFieldsValue({
        author_id,
      });
    }
  }, [searchParams]);

  const { selectProps: categorySelectProps, queryResult: categoryQueryResult } = useSelect({
    resource: "Categories",
    optionLabel: "title",
  });



  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical" >
        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Content"}
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Author"}
          name={"author_id"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...selectProps} />
        </Form.Item>
        <Form.Item
          label="Categories"
          name="category_ids"
          rules={[{ required: true }]}
        >
          <Checkbox.Group options={categoryQueryResult?.data?.data?.map((category: any) => ({
            label: category.title,
            value: category.id,
          }))} />
        </Form.Item>

        <Form.Item
          label={"Status"}
          name={["status"]}
          initialValue={"draft"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"draft"}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "rejected", label: "Rejected" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
