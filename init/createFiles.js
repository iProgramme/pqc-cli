// 初始化登陆页面
const fs = require('fs');
// 登陆页
const { login } = require('./pages/Login/index');
const { loginLess } = require('./pages/Login/index.less.js');
const { AccountFormComponent } = require('./pages/Login/AccountFormComponent');
const { UsbKeyFormComponent } = require('./pages/Login/UsbKeyFormComponent');
// layouts
const { layouts } = require('./layouts/index');
const { layoutsLess } = require('./layouts/index.less.js');
// mock
const { mock } = require('./mock/index');
// .umirc.js
const { umirc } = require('./umirc/index')
// services
const { personInfoService } = require('./services/personInfo');
const { requestService } = require('./services/request')
const { loginService } = require('./services/login')
// utils
const { auth } = require('./utils/auth')
const { esstd_usbkey_modern } = require('./utils/USBkey/esstd_usbkey_modern')
const { esstd_usbkey_util } = require('./utils/USBkey/esstd_usbkey_util')


exports.createFiles = () => {
    // 创建文件夹
    const arr = [
        'src',
        'src/assets',
        'src/pages',
        'src/pages/Login',
        'src/mock',
        'src/services',
        'src/services/personInfo',
        'src/services/login',
        'src/utils',
        'src/utils/auth',
        'src/utils/USBkey',
    ]
    arr.forEach(item => {
        if(!fs.existsSync(item)){
            fs.mkdirSync(item);
        }
    })

    // 创建并写入文件
    fs.writeFileSync('src/pages/Login/index.jsx', login);
    fs.writeFileSync('src/pages/Login/index.less', loginLess);
    fs.writeFileSync('src/pages/Login/AccountFormComponent.jsx', AccountFormComponent);
    fs.writeFileSync('src/pages/Login/UsbKeyFormComponent.jsx', UsbKeyFormComponent);

    // layouts
    fs.writeFileSync('src/layouts/index.jsx', layouts);
    fs.writeFileSync('src/layouts/index.less', layoutsLess);

    // mock
    fs.writeFileSync('src/mock/index.js', mock);

    // .umirc.js
    fs.writeFileSync('.umirc.js', umirc);

    // services
    fs.writeFileSync('src/services/personInfo/index.js', personInfoService);
    fs.writeFileSync('src/services/login/index.js', loginService);
    fs.writeFileSync('src/services/request.js', requestService);
    // utils
    fs.writeFileSync('src/utils/auth/index.js', auth);
    fs.writeFileSync('src/utils/USBkey/esstd_usbkey_modern', esstd_usbkey_modern);
    fs.writeFileSync('src/utils/USBkey/esstd_usbkey_util', esstd_usbkey_util);


    copyPng( '../init/assets/login_bg.png', 'src/assets/login_bg.png');
    copyPng( '../init/assets/login_logo@2x.png', 'src/assets/login_logo@2x.png');
    copyPng( '../init/assets/logo.png', 'src/assets/logo.png');
    
}

function copyPng(sourcePath, targetPath) {
    fs.readFile(sourcePath, (err, data) => {
        if (err) {
            console.error('读取文件失败: ' + err);
            return;
        }

        // 使用fs.writeFile写入数据到目标文件
        fs.writeFile(targetPath, data, (err) => {
            if (err) {
                console.error('写入文件失败: ' + err);
                return;
            }
            console.log('文件复制成功');
        });
    });
}
