import http from '@/utils/http';
import { useRequest } from '@umijs/max';

import { Button, Flex, Form, Input, Modal, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

// todo 域名审批没过，暂时直接用公网ip进行访问
// const BASE_URL = 'http://120.55.101.5:3005/';
console.log(process.env.NODE_ENV);

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://120.55.101.5:3005/';

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
          <Form.Item name={'password'} label="密码">
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
        title="修改"
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
const Login = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>登录</Button>
      <Modal title="登录" open={open} footer={[]} onCancel={() => setOpen(false)}>
        <Form
          initialValues={{ name: '小白', password: '111' }}
          onFinish={(v) => {
            http.post('/login', v);
          }}
        >
          <Form.Item label="账号" name={'name'}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name={'password'}>
            <Input />
          </Form.Item>
          <Button htmlType="submit">提交</Button>
        </Form>
      </Modal>
    </>
  );
};
export default function Home() {
  const { data, refresh, run } = useRequest((params: any) => http.post('/user/query', params || {}));

  const handleDelete = async (id: string) => {
    await http('/user/delete', { method: 'post', baseURL: BASE_URL, data: { id: id } });
    refresh();
  };

  const handleAdd = async (data: any) => {
    await http('/user/create', {
      method: 'post',
      baseURL: BASE_URL,
      data: {
        ...data,
        startTime: dayjs().valueOf(),
      },
    });
    refresh();
  };

  const handleUpdate = async (data: any) => {
    await http('/user/update', {
      method: 'post',
      baseURL: BASE_URL,
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
        <Login />
      </Flex>
      <Table
        dataSource={data?.records}
        pagination={{
          current: data?.current,
          pageSize: data?.pageSize,
          total: data?.total,
          onChange: (current, pageSize) => {
            run({ current, pageSize });
          },
        }}
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
            render: (v) => v && dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '操作',
            key: 'options',
            render: (row) => {
              return (
                <Space>
                  <Button danger type="link" onClick={() => handleDelete(row.id)}>
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
