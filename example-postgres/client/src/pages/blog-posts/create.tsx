import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select, Checkbox } from "antd";

export const BlogPostCreate = () => {
  const { formProps, saveButtonProps } = useForm({});
  const [searchParams] = useSearchParams();

  const { selectProps: authorSelectProps } = useSelect({
    resource: "Authors",
    optionLabel: "name",
  });

  const { selectProps: categorySelectProps, queryResult: categoryQueryResult } = useSelect({
    resource: "Categories",
    optionLabel: "title",
  });

  useEffect(() => {
    const author_id = searchParams.get("author_id");

    if (author_id && author_id !== "null") {
      formProps.form?.setFieldsValue({
        author_id,
      });
    }
  }, [searchParams]);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
            label="Author"
            name="author_id"
            rules={[
              {
                required: true,
              },
            ]}>
            <Select
              {...authorSelectProps}
            />
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
    </Create>
  );
};
