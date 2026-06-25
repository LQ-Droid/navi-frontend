import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockBranches, calcWaitTime, calcDistance } from '../utils/mock';

// 默认位置（成都中心）- 定位失败时的降级
const DEFAULT_LAT = 30.575;
const DEFAULT_LNG = 104.065;

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, intent } = location.state || {};

  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [locating, setLocating] = useState(true);
  const [locError, setLocError] = useState('');

  // 获取用户实时位置
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError('浏览器不支持定位，使用默认位置');
      setUserLat(DEFAULT_LAT);
      setUserLng(DEFAULT_LNG);
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        console.warn('定位失败:', err.message);
        setLocError('定位失败，使用默认位置（北京）');
        setUserLat(DEFAULT_LAT);
        setUserLng(DEFAULT_LNG);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  // 根据意图筛选网点
  const service = intent?.service || '定存';
  const filtered = mockBranches.filter((b) =>
    b.services.includes(service)
  );

  // 计算综合评分（距离权重40% + 等待时间权重40% + 评分权重20%）
  const scored = (userLat !== null && userLng !== null)
    ? filtered.map((b) => {
        const dist = calcDistance(userLat, userLng, b.lat, b.lng);
        const wait = calcWaitTime(b.id);
        const score = dist * 0.4 + wait * 0.4 + (5 - b.rating) * 5 * 0.2;
        return { ...b, distance: dist.toFixed(1), waitTime: wait, score };
      })
    : [];

  scored.sort((a, b) => a.score - b.score);

  return (
    <div className="results">
      <div className="results-header">
        <h2>搜索结果</h2>
        <p className="query-text">"{query}"</p>
        {intent && (
          <div className="intent-badge">
            <span className="intent-label">识别意图：</span>
            <span className="intent-value">{intent.service}</span>
            <span className="intent-confidence">
              置信度 {(intent.confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
        {locating && (
          <div className="locating-badge">
            <span className="locating-spinner">⏳</span>
            <span>正在获取您的位置...</span>
          </div>
        )}
        {locError && !locating && (
          <div className="loc-error-badge">
            <span>⚠️ {locError}</span>
          </div>
        )}
        {!locating && !locError && userLat && (
          <div className="loc-success-badge">
            <span>📍 已定位</span>
          </div>
        )}
      </div>

      {locating ? (
        <div className="loading-state">
          <p>正在定位并搜索附近网点...</p>
        </div>
      ) : (
        <>
          <div className="branch-list">
            {scored.map((branch, index) => (
              <div
                key={branch.id}
                className="branch-card"
                onClick={() => navigate(`/branch/${branch.id}`)}
              >
                <div className="branch-rank">#{index + 1}</div>
                <div className="branch-info">
                  <h3 className="branch-name">{branch.name}</h3>
                  <p className="branch-address">📍 {branch.address}</p>
                  <div className="branch-meta">
                    <span className="meta-item">
                      ⏱️ 预估等待 <strong>{branch.waitTime}分钟</strong>
                    </span>
                    <span className="meta-item">
                      📏 距离 <strong>{branch.distance}km</strong>
                    </span>
                    <span className="meta-item">
                      ⭐ {branch.rating}分
                    </span>
                  </div>
                  <div className="branch-services">
                    {branch.services.map((s) => (
                      <span
                        key={s}
                        className={`service-tag ${s === service ? 'active' : ''}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="branch-action">
                  <button className="detail-btn">查看详情</button>
                </div>
              </div>
            ))}
          </div>

          {scored.length === 0 && (
            <div className="empty-state">
              <p>未找到提供「{service}」服务的网点</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
