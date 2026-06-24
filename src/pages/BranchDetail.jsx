import { useParams, useNavigate } from 'react-router-dom';
import { mockBranches, calcWaitTime, calcDistance } from '../utils/mock';

export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const branch = mockBranches.find((b) => b.id === id);

  if (!branch) {
    return (
      <div className="branch-detail">
        <div className="empty-state">
          <p>网点不存在</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
      </div>
    );
  }

  const userLat = 39.9042;
  const userLng = 116.4074;
  const distance = calcDistance(userLat, userLng, branch.lat, branch.lng);
  const waitTime = calcWaitTime(branch.id);

  return (
    <div className="branch-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 返回
      </button>

      <div className="detail-header">
        <h2>{branch.name}</h2>
        <div className="detail-rating">
          ⭐ {branch.rating}分
        </div>
      </div>

      <div className="detail-card">
        <h3>基本信息</h3>
        <div className="detail-row">
          <span className="detail-label">地址</span>
          <span className="detail-value">{branch.address}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">距离</span>
          <span className="detail-value">{distance.toFixed(1)} km</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">营业时间</span>
          <span className="detail-value">{branch.hours}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">联系电话</span>
          <span className="detail-value">{branch.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">预估等待</span>
          <span className="detail-value highlight">
            {waitTime} 分钟
          </span>
        </div>
      </div>

      <div className="detail-card">
        <h3>可办理业务</h3>
        <div className="service-list">
          {branch.services.map((s) => (
            <span key={s} className="service-tag active">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="detail-card">
        <h3>网点位置</h3>
        <div className="map-placeholder">
          <div className="map-pin">📍</div>
          <p>{branch.name}</p>
          <p className="map-coords">
            {branch.lat.toFixed(3)}, {branch.lng.toFixed(3)}
          </p>
        </div>
      </div>

      <div className="detail-actions">
        <button className="primary-btn">导航前往</button>
        <button className="secondary-btn">预约取号</button>
      </div>
    </div>
  );
}