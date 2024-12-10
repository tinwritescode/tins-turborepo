"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import React from "react";

export default function VideoCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: channelSelectProps } = useSelect({
    resource: "channels",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="YouTube ID"
          name="youtubeId"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
        <Form.Item
          label="Channel"
          name={["channel", "id"]}
          rules={[{ required: true }]}
        >
          <Select {...channelSelectProps} />
        </Form.Item>
        <Form.Item
          label="Published At"
          name="publishedAt"
          rules={[{ required: true }]}
        >
          <DatePicker showTime />
        </Form.Item>
      </Form>
    </Create>
  );
}
