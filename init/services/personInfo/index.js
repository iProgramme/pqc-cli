exports.personInfoService = `import { http } from '../request';

// 新增白名单
export const createWhiteListService = (data) => {
    return http.post('/api/createWhiteList', data, false);
}
// 删除白名单
export const deleteWhiteListService = (data) => {
    return http.post('/api/deleteWhiteList', data, false);
}
// 获取表格数据
export const getTableListService = (data) => {
    return http.post('/api/table', data, false);
}`