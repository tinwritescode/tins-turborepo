"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

export default function ChannelShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />
      <Title level={5}>Name</Title>
      <TextField value={record?.name} />
      <Title level={5}>YouTube ID</Title>
      <TextField value={record?.youtubeId} />
      <Title level={5}>Created At</Title>
      <DateField value={record?.createdAt} />
    </Show>
  );
}
