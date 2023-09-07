exports.UsbKeyFormComponent = `import { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Tabs, Space, Divider, message, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { esKeyEnum, esKeyVerifyPin, esKeyEnumCert, esKeyAsymEnc } from '@/utils/USBkey/esstd_usbkey_modern'
import {
    setToken,
} from '@/utils/auth'
import {
    getCodeService,
    loginService,
    UKeyLoginService,
    getLoginWayService,
} from '@/services/login'
import { useNavigate } from 'umi';
// USBkey PIN 类型
const PIN_TYPE = {
    USER: '1',// 用户 
    ADMIN: '2',// 管理员
}
const Index = ({ jse, captchaData, updateCaptchaSrc, callback, loginType }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    // 若用户重新输入了密码，则不使用存的密码
    let keyVerifyTimes = 0

    useEffect(() => {
        OnRefreshDevList()
    },[])
    const loginProcess = async (pinType) => {
        keyVerifyTimes = 0
        const sn = form.getFieldValue('sn');
        const pin = form.getFieldValue('pin');
        if (!CheckPin(pin)) {
            message.warning("PIN不合法！（要求长度6-16位，使用字母和数字）");
            return;
        }
        // 验证数据
        const valid = await checkPinFn(sn, pin)
        if (!valid) {
            // 错误处理
            setLoading(false)
            // 如果校验不通过，修改 pinType 的值，重新校验
            // pin 校验失败
            setLoading(false)
            message.error('PIN 码错误，请重新输入 PIN 码')
            form.setFieldValue('pin', '')
            form.setFieldValue('captchaCode', '')
            updateCaptchaSrc()
            return
        }
        // 验证通过
        // 组装请求数据
        let params = await validParams()
        if (!params) {
            message.warning('密码加密失败')
            setLoading(false)
            return
        }
        // 登录
        try {
            const res = await UKeyLoginService(params)
            if (res.code === 0) {
                // 登录成功
                const { data } = res
                callback(data)
            } else {
                updateCaptchaSrc()
            }
        } catch (error) {
            message.warning('登录失败')
        }
        setLoading(false)
    }
    const validParams = async () => {
        let params = null
        try {
            const values = form.getFieldsValue()
            // UKey 加密方法加密 password
            // const passwordToBase64 = btoa(encodeURI("values.password"))
            // const password = await OnAsymEnc(dn, passwordToBase64)
            // UKey 加密方法加密 password
            const password = jse.encrypt(values.password)
            params = {
                ...values,
                password,
                uuid: captchaData.uuid,
            }
        } catch (error) {
        }
        return params
    }
    const CheckPin = (pin) => {
        if (0 == pin.length) {
            return false;
        }
        if (pin.length < 6 || pin.length > 16) {
            return false;

        }
        const pattern = /[^0-9a-zA-Z]/g
        return !pattern.test(pin);
    }
    const checkPinFn = async (sn, pin) => {
        keyVerifyTimes += 1
        let valid = false
        try {
            await esKeyVerifyPin(sn, PIN_TYPE.USER, pin)
            valid = true
        } catch (error) {
        }
        if (!valid && keyVerifyTimes < 2) {
            valid = await checkPinFn(sn, PIN_TYPE.ADMIN, pin)
            return valid
        }
        return valid
    }
    const usbKeyLogin = async () => {
        setLoading(true)
        loginProcess(PIN_TYPE.USER)
    }
    const retEnumKey = (retValue) => {
        form.setFieldValue('sn', '')
        if (0 == parseInt(retValue.code, 16)) {
            form.setFieldValue('sn', retValue.data)
            OnRefreshCertList()
        } else {
            message.error("获取 USBkey 设备错误：" + retValue.code);
        }
    }
    // 获取 USBKey 设备
    const OnRefreshDevList = () => {
        let retValue = {};
        try {
            esKeyEnum().then(function (data) {
                if (!data) {
                    setModalText({
                        title: '系统提示',
                        content: '请插入USBkey，然后刷新页面重试！'
                    })
                    setShowModal(true);
                }
                retValue.data = data;
                retValue.code = "0";
                retEnumKey(retValue);
            }).catch(function (reason) {
                retValue.code = reason;
                retValue.data = null;
                retEnumKey(retValue);
            });
        }
        catch (err) {
            message.error("刷新设备列表错误：" + err);
        }
    }
    // 获取 USBKey 证书
    const OnRefreshCertList = () => {
        try {
            esKeyEnumCert().then(function (data) {
                const dnList = data.split('||')
                setDn(dnList[0])
            }).catch(function (reason) {
                console.log('获取证书失败：', reason)
            });
        }
        catch (err) {
            message.error("刷新证书列表错误：" + err);
        }
    }
    return (
        <div>
            <Form
                form={form}
                name='form'
                autoComplete='off'
                onFinish={usbKeyLogin}
            >
                <Form.Item
                    name='sn'
                    rules={[{ required: true, message: '请插入USBkey' }]}
                >
                    <Input
                        prefix={<></>}
                        readOnly
                        size='large'
                        placeholder='USB key自动获取序列号，不可更改'
                    />
                </Form.Item>
                <Form.Item
                    name='pin'
                    rules={[{ required: true, message: '请输入 PIN 码' }]}
                >
                    <Input.Password
                        size="large"
                        prefix={<></>}
                        placeholder='请输入 PIN 码'
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
                        prefix={<></>}
                        type="password"
                        allowClear
                        placeholder="请输入密码"
                    />
                </Form.Item>
                <Form.Item
                    name="code"
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
                    <Button loading={loading} type="primary" htmlType="submit" className="login-form-button" size='large'>
                        登&nbsp;&nbsp;&nbsp;&nbsp;录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Index`