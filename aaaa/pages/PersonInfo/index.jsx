
import { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Tabs, Space, Divider, message, Modal } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';

import { useAntdTable, useToggle, useBoolean } from 'ahooks';
import {
    editPersonInfoService,
    editPasswordService,
} from '@/services/personInfo'
import Upload from '../components/Upload';
import { RegExpPhone, RegExpEmail } from '@/utils/RegExp'
import './index.less'
const reg = {
    phone: RegExpPhone,
    email: RegExpEmail
}
/**
 * 一个可重用的表单项组件。
 *
 * @param {string} label - 表单项的标签。
 * @param {string} fieldName - 表单中字段的名称。
 * @param {object} form - 表单实例。
 * @param {object} userData - 用户数据。
 * @param {boolean} required - 是否为必填项。
 * @param {function} afterChange - 表单项值改变后的回调函数。
 * @returns {JSX.Element} - 表单项组件。
 */
const EditableFormItem = ({ label, fieldName, userData, form, required, afterChange }) => {
    const [state, { setTrue, setFalse }] = useBoolean(false);
    useEffect(() => {
        setInputValue(userData[fieldName] || '');
        form.setFieldValue(fieldName, userData[fieldName] || '');
    }, [userData[fieldName]]);
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };
    const handlePressEnter = () => {
        form.setFieldValue(fieldName, inputValue);
        setFalse();
        afterChange && afterChange();
    };
    return (
        <Form.Item label={label} name={fieldName} rules={[
            {
                required,
                pattern: reg[fieldName],
                message: `请输入正确的${label}!`,
            },
        ]}>
            {state ? (
                <Input style={{ width: '60%' }} onPressEnter={handlePressEnter} autoFocus onChange={handleInputChange} value={inputValue} />
            ) : (
                <div>
                    <span style={{ display: 'inline-block', width: '60%', marginRight: '10px' }}>{inputValue}</span>
                    <EditOutlined onClick={setTrue} />
                </div>
            )}
        </Form.Item>
    );
};

const PersonInfo = (props) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const user = {
            account: '123',
            email: '123kkk'
        };
        setUserData(user);
        form.setFieldsValue(user);
    }, []);

    const onFinish = async values => {
        console.log('表单数据:', values, form.getFieldValue('account'));
        const res = await editPersonInfoService(values);
        console.log('res:', res);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields(['oldPassword', 'newPassword', 'confirmPassword']).then(async values => {
            console.log('修改密码:', values);
            // todo
            const res = await editPasswordService(values);
            console.log('res：', res);

            // 加个请求
            form.setFieldValue("password", values.newPassword);
            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const afterChange = () => {
        const values = form.getFieldsValue();
        console.log('values：', values);

        // todo
        // 发送请求
    };

    return (
        <div className='person-info'>
            <Form form={form} onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: 600 }}>
                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                    <Upload />
                </Form.Item>
                <EditableFormItem label="账号" fieldName="account" userData={userData} form={form} afterChange={afterChange} required />
                <Form.Item label="展示角色" name="role">
                    <span>用户角色</span>
                </Form.Item>
                <EditableFormItem label="手机号码" fieldName="phone" userData={userData} form={form} afterChange={afterChange} required />
                <EditableFormItem label="电子邮箱" fieldName="email" userData={userData} form={form} afterChange={afterChange} required />
                <Form.Item label="密码" name="password">
                    <span style={{ display: 'inline-block', width: '60%', marginRight: '10px' }}>******</span>
                    <Button type="primary" onClick={showModal}>
                        修改密码
                    </Button>
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button type="primary" htmlType="submit">
                        确定
                    </Button>
                    <Button onClick={() => form.resetFields()}>取消</Button>
                </div>
            </Form>
            {/* 修改密码的Modal */}
            <Modal title="修改密码" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                    <Form.Item label="原密码" name="oldPassword" rules={[{ required: true, message: '请输入原密码' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="确认新密码" name="confirmPassword" dependencies={['newPassword']} rules={[
                        { required: true, message: '请再次输入新密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致'));
                            },
                        }),
                    ]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PersonInfo;
