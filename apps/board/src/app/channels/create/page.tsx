"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import React from "react";

export default function ChannelCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="YouTube ID"
          name="youtubeId"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
}
