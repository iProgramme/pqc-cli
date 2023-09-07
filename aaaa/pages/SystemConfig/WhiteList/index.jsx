import React, { useState } from 'react';
import {
    Button,
    Form,
    Input,
    Select,
    Modal,
    Table,
    message,
    Tooltip
} from 'antd';
import { useRequest, useBoolean, useAntdTable } from 'ahooks';
import {
    getTableListService,
    createWhiteListService,
    deleteWhiteListService
} from '@/services/whiteList'
import { FilterFilled, DownOutlined } from '@ant-design/icons';
import './index.less'

const SystemInfo = () => {
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const [modalVisible, { setTrue, setFalse }] = useBoolean(false);

    const getDataList = async ({ current: pageNum, pageSize }, formData) => {
        return getTableListService({ ...formData, pageNum, pageSize }).then(res => ({
            total: res.data?.total,
            list: res.data?.records.map((v, i) => ({
                ...v,
                key: v.id,
                order: (pageNum - 1) * pageSize + i + 1
            }))
        }))
    }
    // 请求表格
    const { tableProps, search } = useAntdTable(getDataList, { defaultPageSize: 10, form });
    const { submit, reset } = search;
    // 新增白名单
    const { run: doAdd } = useRequest(createWhiteListService, {
        manual: true,
        onSuccess: () => {
            message.success('新增成功!');
            setFalse();
            createForm.resetFields();
            submit();
        },
    });
    // 删除
    const { run: doDelete } = useRequest(deleteWhiteListService, {
        manual: true,
        onSuccess: () => {
            message.success('删除成功!');
            submit();
        },
    });

    const handleAdd = () => {
        createForm.validateFields().then(values => {
            doAdd(values);
        });
    };

    const columns = [
        { title: '序号', dataIndex: 'key', key: 'key', width: 80 },
        { title: 'IP用户协议', dataIndex: 'protocol', key: 'protocol' },
        {
            title: 'IP/IP段',
            dataIndex: 'ip',
            key: 'ip',
            with: 200,
            ellipsis: true,
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            )
        },
        { title: '备注', dataIndex: 'note', key: 'note' },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (text, record) => (
                <a onClick={() => doDelete(record)}>
                    删除
                </a>
            ),
        },
    ];

    return (
        <div style={{ marginBottom: '20px' }}>
            <div className='search-form'>
                <Form form={form} layout="inline">
                    <Form.Item name="protocol">
                        <Select placeholder="IP协议" style={{ width: 200 }}
                            suffixIcon={
                                <div style={{ display: 'flex', width: 180, justifyContent: 'space-between' }}>
                                    <FilterFilled />
                                    <DownOutlined />
                                </div>
                            }
                        >
                            <Option value="TCP">TCP</Option>
                            <Option value="UDP">UDP</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="IP/IP段" name="ip">
                        <Input placeholder="IP/IP段" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={submit}>
                            查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={reset}>重置</Button>
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={setTrue}>
                    新增
                </Button>
            </div>

            <Table className='common-table' columns={columns} {...tableProps} />
            <Modal
                title="新增"
                open={modalVisible}
                onOk={handleAdd}
                onCancel={setFalse}
                width={460}
            >
                <Form form={createForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item label="IP协议" name="protocol" rules={[{ required: true, message: '请选择IP协议' }]}>
                        <Select placeholder="IP协议">
                            <Option value="TCP">TCP</Option>
                            <Option value="UDP">UDP</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="IP/IP段" name="ip" rules={[{ required: true }]}>
                        <Input placeholder="IP/IP段" />
                    </Form.Item>
                    <Form.Item label="备注" name="note">
                        <Input placeholder="备注" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SystemInfo;
