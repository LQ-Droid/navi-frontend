import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recognizeIntent, mockIntentResult } from '../utils/mock';

const suggestions = [
  '我工资到账了想办定存',
  '我想买理财产品',
  '我要申请房贷',
  '办信用卡哪家强',
  '我想换外汇',
];

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    // MVP：使用模拟意图识别
    await new Promise((r) => setTimeout(r, 800));
    const intent = mockIntentResult;

    // 保存查询意图到 sessionStorage
    sessionStorage.setItem('lastQuery', input);
    sessionStorage.setItem('lastIntent', JSON.stringify(intent));

    setLoading(false);
    navigate('/results', { state: { query: input, intent } });
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>银行智能网点导航</h1>
        <p className="subtitle">说出您的需求，AI 为您推荐最佳网点</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <span className="input-icon">💬</span>
          <input
            type="text"
            className="search-input"
            placeholder="例如：我工资到账了想办定存"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? '识别中...' : '智能搜索'}
          </button>
        </div>
      </form>

      <div className="suggestions">
        <p className="suggestions-title">试试这样说：</p>
        <div className="suggestion-list">
          {suggestions.map((s) => (
            <button
              key={s}
              className="suggestion-item"
              onClick={() => handleSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <span className="feature-icon">🧠</span>
          <h3>多模态意图识别</h3>
          <p>理解自然语言，精准识别业务需求</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⏱️</span>
          <h3>实时等待时间</h3>
          <p>AI 预测柜面等待时长，节省您的时间</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🗺️</span>
          <h3>智能路线规划</h3>
          <p>综合距离、等待时间、服务质量推荐</p>
        </div>
      </div>
    </div>
  );
}