import { request, useRequest } from '@umijs/max';
import { Button, Flex, Form, Input, Modal, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const Add = (props: { onSuccess: (data: any) => void }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        新增
      </Button>
      <Modal
        title="新增"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          props.onSuccess(form.getFieldsValue());
          setOpen(false);
        }}
      >
        <Form form={form}>
          <Form.Item name={'name'} label="名称">
            <Input />
          </Form.Item>
          <Form.Item name={'age'} label="年领">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const Update = (props: { onSuccess: (data: any) => void; initValue: any }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        修改
      </Button>
      <Modal
        title="修改g"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          props.onSuccess(form.getFieldsValue());
          setOpen(false);
        }}
      >
        <Form form={form} initialValues={props.initValue}>
          <Form.Item name={'name'} label="名称">
            <Input />
          </Form.Item>
          <Form.Item name={'age'} label="年领">
            <Input />
          </Form.Item>
          <Form.Item name={'startTime'} hidden label="年领">
            <Input />
          </Form.Item>
          <Form.Item name={'id'} hidden label="年领">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default function Home() {
  const { data, refresh } = useRequest(() =>
    request('/user', {
      method: 'get',
      baseURL: 'http://localhost:3005/',
    }),
  );

  const handleDelete = async (id: string) => {
    await request('/user/delete', { method: 'post', baseURL: 'http://localhost:3005/', data: { id: id } });
    refresh();
  };

  const handleAdd = async (data: any) => {
    await request('/user/create', {
      method: 'post',
      baseURL: 'http://localhost:3005/',
      data: {
        ...data,
        startTime: dayjs().valueOf(),
      },
    });
    refresh();
  };

  const handleUpdate = async (data: any) => {
    await request('/user/update', {
      method: 'post',
      baseURL: 'http://localhost:3005/',
      data: {
        ...data,
      },
    });
    refresh();
  };

  return (
    <>
      <Flex justify="space-between">
        <Add onSuccess={(data) => handleAdd(data)} />
      </Flex>
      <Table
        dataSource={data}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
          },
          { title: '年龄', dataIndex: 'age' },
          {
            title: '创建时间',
            dataIndex: 'startTime',
            render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '操作',
            key: 'options',
            render: (row) => {
              return (
                <Space>
                  <Button danger type="link" onClick={() => handleDelete(row._id)}>
                    删除
                  </Button>
                  <Update
                    initValue={row}
                    onSuccess={(data) => {
                      handleUpdate(data);
                    }}
                  />
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}
