"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import React from "react";

export default function VideoList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { data: channelData, isLoading: channelIsLoading } = useMany({
    resource: "channels",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.channel?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="youtubeId" title="YouTube ID" />
        <Table.Column
          dataIndex="description"
          title="Description"
          render={(value: string) => value?.slice(0, 80) + "..."}
        />
        <Table.Column
          dataIndex={["channel"]}
          title="Channel"
          render={(value) =>
            channelIsLoading ? (
              <>Loading...</>
            ) : (
              channelData?.data?.find((item) => item.id === value?.id)?.name
            )
          }
        />
        <Table.Column
          dataIndex="publishedAt"
          title="Published at"
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
