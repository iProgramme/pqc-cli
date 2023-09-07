import { Link, Outlet, useLocation, useNavigate } from 'umi';
import {
    Menu,
    Breadcrumb,
    ConfigProvider,
    Dropdown,
    Layout,
    Popconfirm,
    Space
} from 'antd'
const { Header, Footer, Sider, Content } = Layout;
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useState } from 'react'
import {
    CaretDownOutlined,
    BellFilled,
} from '@ant-design/icons';
import NavLogo from '../assets/logo.png'
import {
    logoutService,
} from '@/services/login'
import './index.less';

// 不需要权限控制的路由
const noAuthRoutes = ['/personInfo', '/systemInfo', '/whitelist', '/docs','/init', '/deviceSelfTest',];

// 所有菜单
const MENU_CONFIG = [
    {
        name:'设备自检',
        route: '/deviceSelfTest',
        key: '/deviceSelfTest',
    },
    {
        name: '资源监控',
        route: '/docs',
        key: '/docs',
    },
    {
        name: '资源监控2',
        route: '/docs2',
        key: '/docs2',
    },
    {
        name: '系统配置',
        route: '/',
        key: '/',
        subMenu: [
            {
                name: '系统信息',
                route: '/systemInfo',
                key: '/systemInfo',
            },
            {
                name: '白名单管理',
                route: '/whitelist',
                key: '/whitelist',
            },
        ]
    },
]
const findMenuPath = (menuConfig, targetRoute) => {
    const menuPath = []; // 用于存储菜单名称数组
    const routePath = []; // 用于存储路径数组
    const findPath = (menuConfig, targetRoute) => {
        for (const item of menuConfig) {
            const { name, route, subMenu } = item;
            if (route === targetRoute) {
                menuPath.push(name);
                routePath.push(route);
                return true;
            }
            if (subMenu && findPath(subMenu, targetRoute)) {
                menuPath.unshift(name); // 将父菜单名称添加到数组的开头
                routePath.unshift(route); // 将父路径添加到数组的开头
                return true;
            }
        }
        return false;
    };
    findPath(menuConfig, targetRoute);
    console.log('[menuPath, routePath]：', [menuPath, routePath]);
    return [menuPath, routePath];
};
const filterMenus = (menuConfig, menuPermissions) => {
    return menuConfig.reduce((result, config) => {
        if (menuPermissions.includes(config.route)) {
            result.push({
                label: config.name,
                key: config.key,
                icon: config.icon,
                children: config.subMenu ? filterMenus(config.subMenu, menuPermissions) : undefined,
            });
        }
        return result;
    }, []);
};
export default function Index() {
    const location = useLocation();
    const navigate = useNavigate()
    const [breadcrumb, setBreadcrumb] = useState([])
    const [current, setCurrent] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const [userData, setUserData] = useState({});
    const [items, setItems] = useState([])

    const pathname = location.pathname;
    const initPage = () => {
        // todo
        // const { menus: menuPermissions = [] } = JSON.parse(localStorage.getItem('userData'))?.user || {}
        const menuPermissions = ['/docs', '/whitelist', '/systemInfo', '/','/deviceSelfTest'];
        const items = filterMenus(MENU_CONFIG, menuPermissions);
        // 设置菜单
        setItems(items)

        // 设置面包屑、选中的菜单，打开的菜单
        const [menuNames, routePaths] = findMenuPath(MENU_CONFIG, pathname);
        setBreadcrumb(menuNames)
        setCurrent(routePaths)
        setOpenKeys(routePaths)
    }
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData") || '{}')
        setUserData(userData)
        initPage()
        // 不需要权限的页面可直接访问
        if (noAuthRoutes.includes(pathname)) {
            navigate(pathname)
        }
    }, [pathname])
    // 切换路由时，跳到对应路由，并修改面包屑
    const onClick = (e) => {
        const keyPath = e.keyPath[0];
        console.log('keyPath：', keyPath);
        navigate(keyPath)
    };
    const handleLogout = async () => {
        const { data } = await logoutService()
        navigate('/login')
    }
    const gotoPersonalDetail = () => {
        navigate('/personInfo')
    }
    // 个人信息下拉菜单
    const dropdownItems = [
        {
            key: '1',
            label: (
                <a onClick={gotoPersonalDetail}>
                    个人信息
                </a>
            ),
            icon: <i className='iconfont icon-gerenzhongxin'></i>,
        },
        {
            key: '2',
            label: (
                <Popconfirm
                    placement="bottomRight"
                    title='你确定要退出登录吗？'
                    onConfirm={handleLogout}
                    okText="确定"
                    cancelText="取消"
                >
                    <a>退出登录</a>
                </Popconfirm>
            ),
            icon: <i className='iconfont icon-tuichudenglu'></i>,
        }
    ]
    return (
        <>
            <Layout>
                <Header className='header-main'>

                    {/* logo */}
                    <div className='nav-top'>
                        {/* logo */}
                        <div className='nav-logo'>
                            <img src={NavLogo} alt="" />
                            云服务器密码机
                        </div>
                    </div>

                    {/* 面包屑 */}
                    <Breadcrumb
                        className='nav-breadcrumb'
                        items={[
                            {
                                title: '云服务器密码机',
                            },
                            ...breadcrumb.map(v => ({ title: v }))
                        ]}
                    />
                    {/* 个人信息 */}
                    <div className='personal-info'>
                        {/* 头像 */}
                        <div className='personal-img'>
                            <img src="https://img1.baidu.com/it/u=700819009,3287863552&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1684342800&t=d7919f035c88e35c6ba1993e0b9f6014" alt="" />
                        </div>
                        <div className='personal-summary' onClick={gotoPersonalDetail}>
                            <span className='account-number'>{userData?.user?.account}</span>
                            <br />
                            {/* <span className='account-type'>{userData?.user?.roleName}</span> */}
                            <span className='account-type'>管理员</span>
                        </div>
                        {/* 问号按钮 */}
                        <Dropdown
                            menu={{
                                items: dropdownItems,
                            }}
                            placement="bottomRight"
                            arrow
                        >
                            <i className='personal-arrow'><CaretDownOutlined /></i>
                        </Dropdown>

                    </div>
                </Header>
                <Layout hasSider>
                    <Sider className='sider-main'>
                        <Menu
                            onClick={onClick}
                            onOpenChange={setOpenKeys}
                            selectedKeys={current}
                            openKeys={openKeys}
                            mode="inline"
                            items={items}
                            style={{
                                background: 'transparent',
                                borderInlineEnd: 'none',
                                marginTop: '10px',
                            }}
                        />
                    </Sider>
                    <Content className='content-main'>
                        <ConfigProvider locale={zhCN}>
                            <Outlet />
                        </ConfigProvider>
                    </Content>
                </Layout>
            </Layout>
        </>

    );
}
