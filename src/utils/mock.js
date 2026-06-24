// 模拟网点数据（MVP 阶段使用）
export const mockBranches = [
  {
    id: 'b1',
    name: '工商银行中关村支行',
    address: '北京市海淀区中关村大街1号',
    lat: 39.983,
    lng: 116.314,
    services: ['定存', '理财', '贷款', '外汇'],
    waitTime: 12,
    rating: 4.5,
    hours: '09:00-17:00',
    phone: '010-12345678',
  },
  {
    id: 'b2',
    name: '建设银行五道口支行',
    address: '北京市海淀区成府路28号',
    lat: 39.993,
    lng: 116.338,
    services: ['定存', '理财', '信用卡'],
    waitTime: 8,
    rating: 4.2,
    hours: '09:00-17:00',
    phone: '010-87654321',
  },
  {
    id: 'b3',
    name: '农业银行西单支行',
    address: '北京市西城区西单北大街120号',
    lat: 39.908,
    lng: 116.374,
    services: ['定存', '贷款', '外汇', '对公业务'],
    waitTime: 25,
    rating: 4.0,
    hours: '09:00-17:00',
    phone: '010-11223344',
  },
  {
    id: 'b4',
    name: '招商银行国贸支行',
    address: '北京市朝阳区建国门外大街1号',
    lat: 39.909,
    lng: 116.460,
    services: ['定存', '理财', '贷款', '信用卡', '外汇'],
    waitTime: 5,
    rating: 4.8,
    hours: '09:00-18:00',
    phone: '010-55667788',
  },
];

// 模拟意图识别结果
export const mockIntentResult = {
  intent: 'deposit',
  service: '定存',
  amount: null,
  urgency: 'normal',
  confidence: 0.92,
};

// 计算预估等待时间（基于历史数据模拟）
export const calcWaitTime = (branchId, hour = new Date().getHours()) => {
  const branch = mockBranches.find((b) => b.id === branchId);
  if (!branch) return 15;
  const peakMultiplier = hour >= 10 && hour <= 14 ? 1.5 : 1.0;
  return Math.round(branch.waitTime * peakMultiplier);
};

// 计算距离（Haversine 公式简化版）
export const calcDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};