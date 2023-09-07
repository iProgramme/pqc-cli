import { http } from '../request';

// 账户密码登录
export const loginService = (data) => {
    return http.post('/auth/login', data, false);
}
// UKey登录
export const UKeyLoginService = (data) => {
    return http.post('/auth/login0', data, false);
}
// 退出登录
export const logoutService = (data) => {
    return http.delete('/auth/logout', data, false);
}
// 获取当前用户信息
export const getUserInfoService = () => {
    return http.get('/api/sys/user/get/current');
}
// 修改用户信息
export const updateUserInfoService = (data) => {
    return http.post('/api/sys/user/updateInfo', data);
}
export const getCodeService = () => {
    return http.get('/api/sys/code', false);
}
// 修改密码
export const updatePasswordService = (data) => {
    return http.post('/api/sys/user/updatePassword', data);
}
// 获取登录方式
export const getLoginWayService = () => {
    return http.get('/auth/login/way');
}