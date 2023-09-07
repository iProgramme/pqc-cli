export default {
    'POST /auth/login':{
        code: 0,
        data: {
            msg: '登陆成功了',
            user: {"authorities":[{"authority":"aksk:list"},{"authority":"user:list"},{"authority":"archive:list"},{"authority":"key:list"},{"authority":"schedule:list"},{"authority":"archive:list"},{"authority":"delete:list"},{"authority":"key:add"},{"authority":"key:forbidden"},{"authority":"key:delete"},{"authority":"key:candel"},{"authority":"key:archive"},{"authority":"user:add"},{"authority":"user:edit"},{"authority":"user:delete"},{"authority":"aksk:add"},{"authority":"aksk:reset"},{"authority":"aksk:del"},{"authority":"aksk:list"},{"authority":"key:backup"},{"authority":"key:restore"}],"user":{"account":"pqc","email":"abc@1qq.com","enabled":true,"menus":["/key-management","/AKSK-management","/user-management","/approve-archive","/lifecycle-management","/deletion-management","/archive-management","/approve-deletion","/approve-management","/online-files","/system-congifuration","/keys-backup","/keys-restoration","/resource-monitoring"],"phone":"1888888888","roleName":"管理员","updateTime":"2023-09-06 09:01:03","userId":11,"username":"pqc"}},
            access_token: 'fghjkl'
        }
    },

    // 修改信息
    'POST /auth/editInfo':{
        code: 0,
        data: {
            msg: '成功修改了信息'
        }
    },
    // 修改密码
    'POST /auth/editPassword':{
        code: 0,
        data: {
            msg: '成功修改了密码'
        }
    },

    // 白名单
    'POST /api/table': {
        code: 0,
        data: {
            total: 100,
            records: [
                { key: '1', protocol: 'TCP', ip: '192.168.1.1;192.168.1.1;192.168.1.1;192.168.1.1;192.168.1.1;192.168.1.1', note: '备注1' },
                { key: '2', protocol: 'UDP', ip: '192.168.1.2', note: '备注2' },
            ]
        }
    },
    'POST /api/createWhiteList': {
        code: 0,
        data: {
            msg: '创建成功'
        }
    },
    'POST /api/deleteWhiteList': {
        code: 0,
        data: {
            msg: '删除成功'
        }
    },
}