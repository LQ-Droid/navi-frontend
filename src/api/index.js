import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 意图识别：用户输入自然语言，返回解析结果
export const recognizeIntent = (text) =>
  api.post('/intent', { text }).then((r) => r.data);

// 查询网点列表（带等待时间）
export const fetchBranches = (params) =>
  api.get('/branches', { params }).then((r) => r.data);

// 获取网点详情
export const fetchBranchDetail = (id) =>
  api.get(`/branches/${id}`).then((r) => r.data);

// 获取推荐路线
export const fetchRoute = (from, to) =>
  api.get('/route', { params: { from, to } }).then((r) => r.data);

// 保存查询历史
export const saveHistory = (data) =>
  api.post('/history', data).then((r) => r.data);

// 获取查询历史
export const fetchHistory = () =>
  api.get('/history').then((r) => r.data);

export default api;