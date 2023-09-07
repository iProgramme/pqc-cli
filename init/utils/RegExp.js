// 只包含：常用字符 + 数字 + 英文字母 + 汉字
export const COMMONUSE_REG = /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、0-9a-zA-Z\u4e00-\u9fa5]+$/im
// 使用方式
// if(!COMMONUSE_REG.test(str)) {
//     message.error("标签内容含有特殊字符串，请修改后重试！")
//     return 
// }
// 校验手机号
export const RegExpPhone = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
// 校验email
export const RegExpEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/