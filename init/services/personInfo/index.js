import { http } from '../request';

// 修改信息
export const editPersonInfoService = (data) => {
    return http.post('/auth/editPersonInfo', data, false);
}
// 修改密码
export const editPasswordService = (data) => {
    return http.post('/auth/editPassword', data, false);
}