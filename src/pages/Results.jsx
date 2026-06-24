import { useLocation, useNavigate } from 'react-router-dom';
import { mockBranches, calcWaitTime, calcDistance } from '../utils/mock';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, intent } = location.state || {};

  // 根据意图筛选网点
  const service = intent?.service || '定存';
  const filtered = mockBranches.filter((b) =>
    b.services.includes(service)
  );

  // 模拟用户位置（北京中心）
  const userLat = 39.9042;
  const userLng = 116.4074;

  // 计算综合评分（距离权重40% + 等待时间权重40% + 评分权重20%）
  const scored = filtered.map((b) => {
    const dist = calcDistance(userLat, userLng, b.lat, b.lng);
    const wait = calcWaitTime(b.id);
    const score = dist * 0.4 + wait * 0.4 + (5 - b.rating) * 5 * 0.2;
    return { ...b, distance: dist.toFixed(1), waitTime: wait, score };
  });

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
      </div>

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
    </div>
  );
}