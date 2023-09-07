exports.login = `import { InfoCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Tabs, Space, Divider, message, Modal } from 'antd';
import Login from '@/assets/login_bg.png'
import LoginLogo from '@/assets/login_logo@2x.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'umi';
import JSEncrypt from 'jsencrypt';
import {
    // setLocalUserInfo, 
    // setMenus, 
    // setTenantId, 
    setToken,
    // useAuth 
} from '@/utils/auth'
import { esKeyEnum, esKeyVerifyPin, esKeyEnumCert, esKeyAsymEnc } from '@/utils/USBkey/esstd_usbkey_modern'
import AccountFormComponent from './AccountFormComponent'
import UsbKeyFormComponent from './UsbKeyFormComponent'
import './index.less'

var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCw3cxE9I8r4364kpZH+yyUzVRD4Gqm+v6OTBpBkCVMnUD5XDvyeFi2ifvGgMdC5taH2ADwU0jvloKRM9RXFZAcinhxHCdgOjsng2SNLB7qJQ0rmUp1ZUxVOEQMWn39Yax9p141JjMvaQKkqCIH7OdoANhKcvJtk1tiQsUDGEb8aQIDAQAB'
const jse = new JSEncrypt()
jse.setPublicKey(publicKey)
import {
    getCodeService,
    loginService,
    UKeyLoginService,
    getLoginWayService,
} from '@/services/login'
let TIME = null
// 登录表单类型
const FORM_TYPE = {
    ACCOUNT: 'account', // 账号登录
    USB_KEY: 'usbKey' //usbKey登录
}

// 登录类型
const LOGIN_TYPE = {
    ACCOUNT: 3,
    USB_KEY: 1,
    ACCOUNT_AND_USB_KEY: 2,
}
const SimpleLayout = () => {
    const [activeKey, setActiveKey] = useState(FORM_TYPE.ACCOUNT)
    const [loginType, setLoginType] = useState(LOGIN_TYPE.ACCOUNT)
    const [captchaData, setCaptchaData] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [modalText, setModalText] = useState({
        title: '系统提示',
        content: '请插入USBkey，然后刷新页面重试！'
    })
    const navigate = useNavigate()
    const items = [
        {
            key: FORM_TYPE.ACCOUNT,
            label: '账号登录',
        },
        {
            key: FORM_TYPE.USB_KEY,
            label: 'USBkey登录',
        },
    ];

    const getLoginWay = async () => {
        try {
            const { data: way } = await getLoginWayService()
            setLoginType(way)
        } catch {
            setLoginType(LOGIN_TYPE.ACCOUNT)
        }

    }
    useEffect(() => {
        getLoginWay()
        updateCaptchaSrc({})
    }, [])
    const onChange = (key) => {
        setActiveKey(key);
    };

    const updateCaptchaSrc = async () => {
        clearInterval(TIME)
        TIME = setInterval(() => {
            updateCaptchaSrc()
        }, 60 * 2 * 1000);
        const { data } = await getCodeService()
        setCaptchaData(data)
    }

    const afterLogin = (data) => {
        setToken(data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        const { roleName } = data.user?.user
        switch (roleName) {
            case '管理员':
                navigate('/personInfo')
                break
            case '操作员':
                navigate('/personInfo')
                break
            case '审计员':
                navigate('/personInfo')
                break
            default:
                navigate('/personInfo')
        }
    }

    return (
        <div className='login-main'>
            <img src={Login} alt="" className='bg-image' />
            <div className='logo'>
                <img src={LoginLogo} alt="" />
            </div>
            <div className='login'>
                <p className='title'>密钥管理系统 <span></span> </p>
                <div className='login-form'>
                    {loginType === LOGIN_TYPE.ACCOUNT && <AccountFormComponent jse={jse} captchaData={captchaData} updateCaptchaSrc={updateCaptchaSrc} callback={afterLogin} setModalText={setModalText} setShowModal={setShowModal} />}
                    {loginType === LOGIN_TYPE.USB_KEY && <UsbKeyFormComponent jse={jse} captchaData={captchaData} updateCaptchaSrc={updateCaptchaSrc} callback={afterLogin} />}
                    {loginType === LOGIN_TYPE.ACCOUNT_AND_USB_KEY && <><Tabs activeKey={activeKey} items={items} onChange={onChange} />
                        {activeKey === FORM_TYPE.ACCOUNT && <AccountFormComponent jse={jse} captchaData={captchaData} updateCaptchaSrc={updateCaptchaSrc} callback={afterLogin} setModalText={setModalText} setShowModal={setShowModal} />}
                        {activeKey === FORM_TYPE.USB_KEY && <UsbKeyFormComponent jse={jse} captchaData={captchaData} updateCaptchaSrc={updateCaptchaSrc} callback={afterLogin} />}</>
                    }
                </div>
                <div className='detail'>
                    <Divider plain>杭州后量子密码科技有限公司</Divider>
                </div>
            </div>
            <Modal
                title={modalText.title}
                open={showModal}
                maskClosable={false}
                footer={
                    <Button type="primary" onClick={() => setShowModal(false)}>
                        确定
                    </Button>
                }
                width={347}

            >
                <div className='only-tips'>
                    <InfoCircleFilled className='tips-icon' />
                    <div className='tips-content'>
                        {modalText.content}
                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default SimpleLayout;`