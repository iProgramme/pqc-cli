exports.umirc = `import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Login",layout: false, },
    { path: "/docs", component: "docs" },
    // 建议路由处，将父文件夹路径加载 component 里，不加入path
    { path: "/login", component: "Login",layout: false, },
    // { path: "/deviceSelfTest", component: "DeviceSelfTest" },
    // 不匹配的路由跳到 404
    // { path: '/*', component: '@/pages/404' },
  ],
  npmClient: 'pnpm',
  mock:{
    include: ['src/mock/**.js'],
  },
  alias:{
    '@': './src',
  }
});
`