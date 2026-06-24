import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 从 localStorage 读取历史记录
    const saved = localStorage.getItem('navHistory') || '[]';
    setHistory(JSON.parse(saved));
  }, []);

  const handleRequery = (item) => {
    navigate('/results', { state: { query: item.query, intent: item.intent } });
  };

  const handleClear = () => {
    localStorage.removeItem('navHistory');
    setHistory([]);
  };

  return (
    <div className="history">
      <div className="history-header">
        <h2>查询历史</h2>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            清空历史
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>暂无查询历史</p>
          <button className="primary-btn" onClick={() => navigate('/')}>
            开始搜索
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-content">
                <p className="history-query">"{item.query}"</p>
                <div className="history-meta">
                  <span className="history-intent">
                    意图：{item.intent?.service || '未知'}
                  </span>
                  <span className="history-time">{item.time}</span>
                </div>
              </div>
              <button
                className="requery-btn"
                onClick={() => handleRequery(item)}
              >
                重新查询
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}