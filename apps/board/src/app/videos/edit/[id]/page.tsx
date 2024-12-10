"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import React from "react";

export default function VideoEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});

  const videosData = queryResult?.data?.data;

  const { selectProps: channelSelectProps } = useSelect({
    resource: "channels",
    defaultValue: videosData?.channel?.id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
    </Edit>
  );
}
