#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const {createFiles} = require('./init/createFiles');

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
// 执行脚本
const availablePackageManager = findAvailablePackageManager();
if (!availablePackageManager) {
    console.error('未找到可用的包管理器。请安装 pnpm、yarn、cnpm 或 npm。');
}
// -------------------------------------------- 华丽的分界线 --------------------------------------------
// 1. 获取用户输入的项目名称
const projectName = process.argv[2];

if (!projectName) {
    console.error('请输入项目名称！');
    process.exit(1);
}

// 2. 创建项目目录并进入
const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
    console.error('项目目录已存在，请选择其他名称！');
    process.exit(1);
}

fs.mkdirSync(projectPath);
process.chdir(projectPath);

// 3. 初始化 Umi 项目
console.log(`正在初始化 ${projectName} 项目...`);

const cmd = `${availablePackageManager} dlx create-umi@latest`;
const child = spawn(cmd, {
    stdio: ['inherit', 'pipe', 'pipe'], // 将子进程的标准输出和标准错误连接到父进程的标准输入
    shell: true, // 启用 shell 模式以支持交互
});

child.stdout.on('data', (data) => {
    // 将子进程的输出实时显示在父进程的控制台上
    console.log(data.toString());
});

child.stderr.on('data', (data) => {
    // 将子进程的错误输出实时显示在父进程的控制台上
    console.error(data.toString());
});

child.on('close', (code) => {
    if (code === 0) {
        console.log(`项目初始化成功！开始修改文件名`);
        changeFilesExtension();
        
        console.log('安装依赖中...');

        const installCmd = `${availablePackageManager} install umi antd ahooks axios @ant-design/icons jsencrypt`;
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
                createProjectFiles()


            } else {
                console.error('安装依赖失败。');
            }
        });
    } else {
        console.error(`初始化项目失败：退出码 ${code}`);
    }
});

// 修改文件扩展名
function changeFilesExtension() {

    // 遍历项目目录，将.tsx改为.jsx，将.ts改为.js
    function renameFiles(dirPath) {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                if (!filePath.includes('node_modules')) {
                    renameFiles(filePath); // 递归处理子目录
                }
            } else {
                if (file.endsWith('.tsx')) {
                    const newFileName = file.replace('.tsx', '.jsx');
                    fs.renameSync(filePath, path.join(dirPath, newFileName));
                } else if (file.endsWith('.d.ts') || file.endsWith('tsconfig.json')) {
                    fs.unlinkSync(filePath);
                    console.log(`删除.d.ts文件: ${filePath}`);
                } else if (file.endsWith('.ts')) {
                    const newFileName = file.replace('.ts', '.js');
                    fs.renameSync(filePath, path.join(dirPath, newFileName));
                }
            }
        });
    }

    console.log('正在修改文件扩展名...');
    renameFiles(process.cwd());
    console.log('文件名修改完成。开始安装依赖');
}
function createProjectFiles() {
    createFiles()
}