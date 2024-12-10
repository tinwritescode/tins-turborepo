"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import React from "react";

export default function ChannelEdit() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
    </Edit>
  );
}
