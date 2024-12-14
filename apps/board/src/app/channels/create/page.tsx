"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function ChannelCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="YouTube Username Or ID"
          name="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
}
