// axios
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/openapi/collect/login',
    method: 'post',
    data
  })
}
// 管理员短信验证码登录
export function smsLogin(data) {
  return request({
    url: '/openapi/collect/smsLogin',
    method: 'post',
    data
  })
}
// 修改密码
export function updatePwd(data) {
  return request({
    url: '/openapi/collect/updatePwd',
    method: 'post',
    data
  })
}

// 创建车场信息接口
export function createParkInfo(data) {
  return request({
    url: '/openapi/collect/createParkInfo',
    method: 'post',
    data,
    hideloading: true
  })
}
// 创建支付和微信账号
export function createPayInfo(data) {
  return request({
    url: '/openapi/collect/createPayInfo',
    method: 'post',
    data,
    hideloading: true
  })
}
// 创建建行账号
export function createCcbAccountInfo(data) {
  return request({
    url: '/openapi/collect/createCcbAccountInfo',
    method: 'post',
    data,
    hideloading: true
  })
}
// 创建车道信息
export function createGatewayInfo(data) {
  return request({
    url: 'openapi/collect/createGatewayInfo',
    method: 'post',
    data,
    hideloading: true
  })
}
// 创建车道信息
export function createFeeRuleInfo(data) {
  return request({
    url: '/openapi/collect/createFeeRuleInfo',
    method: 'post',
    data,
    hideloading: true
  })
}
// 创建电子发票
export function createInvoiceInfo(data) {
  return request({
    url: '/openapi/collect/createInvoiceInfo',
    method: 'post',
    data,
    hideloading: true
  })
}
// 上传图片接口
export function uploadFile(data) {
  return request({
    url: 'openapi/collect/uploadFile',
    method: 'post',
    data,
    hideloading: true
  })
}

// 获取区域下拉列表接口
export function getAreaList(params) {
  return request({
    url: '/openapi/collect/getAreaList',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取车场信息采集列表接口
export function getDeviceList(params) {
  return request({
    url: '/openapi/collect/getDeviceList',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取车场信息接口
export function getParkInfo(params) {
  return request({
    url: 'openapi/collect/getParkInfo',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取车场类型下拉列表接口
export function getParkTypeList(params) {
  return request({
    url: 'openapi/collect/getParkTypeList',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取微信或支付宝信息
export function getPayInfo(params) {
  return request({
    url: '/openapi/collect/getPayInfo',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取建行信息
export function getCcbAccountInfo(params) {
  return request({
    url: '/openapi/collect/getCcbAccountInfo',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取车道信息接口
export function getGatewayInfo(params) {
  return request({
    url: '/openapi/collect/getGatewayInfo',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取建行信息
export function getFeeRuleInfo(params) {
  return request({
    url: '/openapi/collect/getFeeRuleInfo',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取电子发票信息
export function getInvoiceInfo(params) {
  return request({
    url: '/openapi/collect/getInvoiceInfo',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取设备/相机类型下拉列表接口
export function getDeviceTypeList(params) {
  return request({
    url: '/openapi/collect/getDeviceTypeList',
    method: 'get',
    params,
    hideloading: true
  })
}
// 获取验证码
export function sendSms(params) {
  return request({
    url: '/openapi/collect/sendSms',
    method: 'get',
    params,
    hideloading: true
  })
}
