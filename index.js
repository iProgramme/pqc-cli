#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// -------------------------------------------- 查找是否安装npm --------------------------------------------
// 定义要检查的包管理器列表
const packageManagers = ['pnpm', 'yarn', 'cnpm', 'npm'];
// 查找第一个可用的包管理器
function findAvailablePackageManager() {
    for (const manager of packageManagers) {
        try {
            execSync(`${manager} --version`, { stdio: 'ignore' });
            return manager;
        } catch (error) {
            // 如果执行失败，继续下一个包管理器
        }
    }
    return null; // 如果没有可用的包管理器，则返回null
}
const availablePackageManager = findAvailablePackageManager();
if (!availablePackageManager) {
    console.error('未找到可用的包管理器。请安装 pnpm、yarn、cnpm 或 npm。');
}
// -------------------------------------------- 输入项目名称 --------------------------------------------
// 1. 获取用户输入的项目名称
const projectName = process.argv[2];

if (!projectName) {
    console.error('请输入项目名称！');
    process.exit(1);
}
// -------------------------------------------- 复制到该项目下 --------------------------------------------
// 使用递归函数复制文件夹
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    const files = fs.readdirSync(source);

    files.forEach(file => {
        const sourceFilePath = path.join(source, file);
        const targetFilePath = path.join(target, file);

        if (fs.statSync(sourceFilePath).isDirectory()) {
            // 如果是文件夹，则递归复制子文件夹
            copyFolderSync(sourceFilePath, targetFilePath);
        } else {
            // 如果是文件，则使用fs.copyFileSync复制文件
            fs.copyFileSync(sourceFilePath, targetFilePath);
        }
    });
}
// 2. 判断项目目录
const projectPath = path.join(process.cwd(), projectName);
if (fs.existsSync(projectPath)) {
    console.error('项目目录已存在，请选择其他名称！');
    process.exit(1);
}
fs.mkdirSync(projectPath);
// 复制该项目
console.log('正在初始化项目...');
copyFolderSync('./init', projectPath);
console.log('项目初始化完成，开始安装依赖...');
// -------------------------------------------- 安装依赖 --------------------------------------------
// 进入项目目录
process.chdir(projectPath);
console.log(`正在安装项目依赖...`);

const installCmd = `${availablePackageManager} install`;
const installChild = spawn(installCmd, {
    stdio: ['inherit', 'pipe', 'pipe'], // 将子进程的标准输出和标准错误连接到父进程的标准输入
    shell: true, // 启用 shell 模式以支持交互
});

installChild.stdout.on('data', (data) => {
    // 将子进程的输出实时显示在父进程的控制台上
    console.log(data.toString());
});

installChild.stderr.on('data', (data) => {
    // 将子进程的错误输出实时显示在父进程的控制台上
    console.error(data.toString());
});

installChild.on('close', (installCode) => {
    if (installCode === 0) {
        console.log('依赖安装成功！');
        console.log(`进入项目目录：cd ${projectName}`);
        console.log('开始开发吧！')
    } else {
        console.error('安装依赖失败。');
    }
});
