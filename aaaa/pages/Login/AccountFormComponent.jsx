import { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Tabs, Space, Divider, message, Modal } from 'antd';
import {
    loginService,
} from '@/services/login'


const AccountFormComponent = ({ jse, captchaData, updateCaptchaSrc, setModalText, setShowModal, callback }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    // 若用户重新输入了密码，则不使用存的密码
    const [passwordChanged, setPasswordChanged] = useState(false)
    useEffect(() => {
        const values = localStorage.getItem('user') || '{}'
        form.setFieldsValue({
            ...JSON.parse(values),
            password: values === '{}' ? null : '000000'
        })
    }, [])
    const handleFocus = () => {
        setPasswordChanged(true)
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        // 密码栏聚焦时，若上次是记住密码，则清空密码栏
        if (userData.password) {
            form.setFieldValue("password", '')
        }
    }
    const onFinish = async (values) => {
        setLoading(true)
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const formPassword = values.password;
        // rsa加密
        const rsaPassword = jse.encrypt(formPassword)
        let password;
        // 若密码栏被改变则使用改变后的值
        if (passwordChanged) {
            password = rsaPassword;
        } else {
            password = userData.password
        }
        const params = {
            ...values,
            password,
            uuid: captchaData.uuid,
        }
        console.log("login params:", params)
        const { data } = await loginService(params)
        if (data) {
            callback(data)
            // 记住密码
            if (values.remember) {
                // 登录成功时才插入值
                localStorage.setItem('user', JSON.stringify({
                    ...params,
                    code: '',
                    remember: values.remember,
                }))
            } else {
                // 成功之后才会删除值
                localStorage.setItem('user', '{}')
            }

        } else {
            updateCaptchaSrc()
        }
        setLoading(false)

    };
    return (
        <div>
            <Form
                name="normal_login"
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入账号!',
                        },
                    ]}
                >
                    <Input
                        size="large"
                        key="username"
                        prefix={<></>}
                        placeholder="请输入账号"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                    ]}
                >
                    <Input
                        size="large"
                        key="password"
                        prefix={<></>}
                        type="password"
                        allowClear
                        onFocus={handleFocus}
                        placeholder="请输入密码"
                    />
                </Form.Item>
                <Form.Item
                    name="code"
                    style={{
                        marginBottom: 0,
                    }}
                    size="large"
                    rules={[
                        {
                            required: true,
                            message: '请输入验证码!',
                        },
                    ]}
                >
                    <Space>
                        <Input
                            size="large"
                            prefix={<></>}
                            type="text"
                            placeholder="请输入验证码"
                        />
                        <img
                            className='test-code'
                            src={captchaData.img}
                            onClick={updateCaptchaSrc}
                        />
                    </Space>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox style={{ color: '#C0C4CC' }}>记住密码</Checkbox>
                    </Form.Item>
                    <div className='forget-code' onClick={() => {
                        setShowModal(true)
                        setModalText({
                            title: '忘记密码',
                            content: '请联系管理员重置密码！'
                        })
                    }}>忘记密码？</div>
                </Form.Item>

                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className="login-form-button" size='large'>
                        登&nbsp;&nbsp;&nbsp;&nbsp;录
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )
}

export default AccountFormComponent