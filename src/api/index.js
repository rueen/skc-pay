import axios from 'axios';
import { showToast } from 'vant';
import { createHash } from '@/utils/crypto';

const API_BASE_URL = 'https://72pay.la2568.site/api';
const DEBUG_MODE = true;

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.status != 1) {
      showToast({
        message: res.message || '请求失败',
        type: 'fail'
      });
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res;
  },
  error => {
    console.error('API错误:', error);
    showToast({
      message: error.message || '网络错误',
      type: 'fail'
    });
    return Promise.reject(error);
  }
);

/**
 * 创建代付交易
 * @param {Object} data 交易数据
 * @param {string} channelType 渠道类型 'GCASH' 或 'MAYA'
 */
export async function createTransfer(data, secretKey) {
  // 创建签名
  const signStr = createSignature(data, secretKey);
  data.sign = signStr;
  
  // 开发调试 - 验证签名计算
  if (DEBUG_MODE) {
    console.log('======= 代付请求 - 签名验证 =======');
    console.log('请求数据:', data);
    console.log('计算得到的签名:', signStr);
  }
  
  return api.post('/daifu', data);
}

/**
 * 创建签名 - 严格按照文档中的签名算法实现
 * 1. 参数名ASCII码从小到大排序（字典序）
 * 2. 参数名区分大小写
 * 3. 排除空值参数和sign参数
 * 4. 最后拼接key={secretKey}
 * 5. 对拼接字符串进行MD5计算并转大写
 * 
 * @param {Object} data 请求数据
 * @param {string} secretKey 密钥
 * @returns {string} 签名
 */
function createSignature(data, secretKey) {
  // 过滤掉空值参数和sign参数
  const filteredData = {};
  for (const key in data) {
    if (key !== 'sign' && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      // 确保数字值不会转换为科学计数法
      if (typeof data[key] === 'number') {
        filteredData[key] = data[key].toString();
      } else {
        filteredData[key] = data[key];
      }
    }
  }
  
  // 按照ASCII码从小到大排序（字典序）
  const sortedKeys = Object.keys(filteredData).sort();
  
  // 构建签名字符串：key1=value1&key2=value2&...
  let signStr = '';
  for (const key of sortedKeys) {
    signStr += `${key}=${filteredData[key]}&`;
  }
  
  // 添加密钥
  signStr += `key=${secretKey}`;
  
  if (DEBUG_MODE) {
    console.log('签名原始字符串:', signStr);
  }
  
  // 使用MD5进行加密并转为大写
  return createHash(signStr);
}

export default api; 