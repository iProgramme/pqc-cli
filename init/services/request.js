exports.requestService = `import axios from 'axios';
import { 
    getTenantId, 
    getToken 
} from '@/utils/auth';
import { message } from 'antd'
// import { RESPONSE_CODE } from './constants';

// const baseURL = 'http://172.16.0.96:8081';
// export const baseURL = 'http://172.16.0.209:8088/';
export const baseURL = 'http://localhost:8000/';

const service = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

service.interceptors.request.use((config) => {
    // const tenantId = getTenantId();
    if (!config.headers) {
        config.headers = {};
    }
    // config.headers = Object.assign({ 'x-tenant-id': tenantId }, config.headers)
    return config
}, (error) => {
    return Promise.reject();
})


service.interceptors.response.use((response) => {
    // 下载文件接口直接返回 response
    if(response.headers['x-filename']){
        return response
    }
    const { code, data } = response.data;
    if (code && code !== 0) {
        message.error(response.data.message || '返回错误！')
        return {}
    }
    return response.data;
}, (error) => {
    const status = error.response?.status
    switch (status) {
    case 401: {
        message.warning('token失效, 请重新登录');
        setTimeout(() => {
            const url = window.location.origin + '/login';
            window.location.replace(url)
        }, 2000)
    }
        break;
    case 403:
        // toast.warning('拒绝访问')
        break;
    case 404:
        // toast.warning('请求地址错误')
        break;
    case 500:
        // toast.warning('服务器故障')
        break;
    default:
        // toast.warning('网络连接故障')
    }
    return Promise.reject(error)
})



const setHeaderToken = (isNeedToken, url) => {
    const accessToken = isNeedToken ? getToken() : null;
    if (isNeedToken) {
        if (!accessToken) {
            console.log('不存在access_token, 跳转到首页');
        }
        
        // service.defaults.headers.common.Authorization = 'Bearer '+ accessToken;
        service.defaults.headers.common.Authorization = accessToken;
    }
}

export const http = {
    get(url, isNeedToken = true, config) {
        setHeaderToken(isNeedToken, url)
        return service.get(url, config);
    },

    post(url, data, isNeedToken = true, config) {
        setHeaderToken(isNeedToken, url)
        return service.post(url, data, config)
    },

    put(url, data, isNeedToken = true, config) {
        setHeaderToken(isNeedToken, url)
        return service.put(url, data, config)
    },

    delete(url, data, isNeedToken = true, config) {
        setHeaderToken(isNeedToken, url)
        return service.delete(url, config)
    }
}`