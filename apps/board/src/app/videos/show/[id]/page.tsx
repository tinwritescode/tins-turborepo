"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

export default function VideoShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: channelData, isLoading: channelIsLoading } = useOne({
    resource: "channels",
    id: record?.channel?.id || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />
      <Title level={5}>Title</Title>
      <TextField value={record?.title} />
      <Title level={5}>YouTube ID</Title>
      <TextField value={record?.youtubeId} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Channel</Title>
      <TextField
        value={
          channelIsLoading ? <>Loading...</> : <>{channelData?.data?.name}</>
        }
      />
      <Title level={5}>Published At</Title>
      <DateField value={record?.publishedAt} />
      <Title level={5}>Created At</Title>
      <DateField value={record?.createdAt} />
    </Show>
  );
}
