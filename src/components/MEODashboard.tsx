'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Search,
  Star,
  Users,
  Eye,
  Phone,
  Navigation,
  Globe,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Target,
  Sparkles
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// モックデータ - SERP APIから取得するデータの例
const mockMEOData = {
  businessInfo: {
    name: '九州料理 きむら屋',
    address: '東京都渋谷区恵比寿1-22-3',
    phone: '03-1234-5678',
    rating: 4.6,
    reviews: 234,
    category: '居酒屋・九州料理'
  },
  rankings: {
    current: {
      '九州料理 恵比寿': 2,
      '恵比寿 居酒屋': 5,
      '恵比寿 もつ鍋': 1,
      '馬刺し 恵比寿': 3,
      '恵比寿 宴会': 4,
      '恵比寿 個室居酒屋': 6,
      '恵比寿 日本酒': 8,
      '恵比寿駅 居酒屋': 7
    },
    previous: {
      '九州料理 恵比寿': 3,
      '恵比寿 居酒屋': 7,
      '恵比寿 もつ鍋': 2,
      '馬刺し 恵比寿': 5,
      '恵比寿 宴会': 4,
      '恵比寿 個室居酒屋': 9,
      '恵比寿 日本酒': 10,
      '恵比寿駅 居酒屋': 8
    }
  },
  rankingHistory: [
    { date: '1月', average: 8.2 },
    { date: '2月', average: 7.5 },
    { date: '3月', average: 6.8 },
    { date: '4月', average: 5.9 },
    { date: '5月', average: 5.2 },
    { date: '6月', average: 4.5 }
  ],
  competitors: [
    { name: '九州魂 恵比寿店', avgRank: 3.2, rating: 4.4, reviews: 189 },
    { name: '博多ダイニング', avgRank: 4.8, rating: 4.3, reviews: 156 },
    { name: '薩摩黒豚屋', avgRank: 5.5, rating: 4.5, reviews: 201 },
    { name: '宮崎地鶏専門店', avgRank: 6.2, rating: 4.2, reviews: 134 }
  ],
  visibility: {
    mapViews: 15234,
    searchAppearances: 8921,
    websiteClicks: 2341,
    directionRequests: 892,
    phoneCalls: 456
  },
  dailyVisibility: [
    { day: '月', views: 2100, clicks: 320 },
    { day: '火', views: 1850, clicks: 280 },
    { day: '水', views: 1920, clicks: 295 },
    { day: '木', views: 2050, clicks: 310 },
    { day: '金', views: 2800, clicks: 425 },
    { day: '土', views: 3200, clicks: 485 },
    { day: '日', views: 2314, clicks: 356 }
  ],
  categoryPerformance: [
    { category: '検索表示', value: 85, max: 100 },
    { category: 'マップ表示', value: 92, max: 100 },
    { category: 'レビュー評価', value: 88, max: 100 },
    { category: '写真の魅力度', value: 76, max: 100 },
    { category: '情報充実度', value: 94, max: 100 },
    { category: '返信率', value: 82, max: 100 }
  ]
}

// 順位変動を計算
const getRankChange = (current: number, previous: number) => {
  const change = previous - current
  if (change > 0) return { value: change, type: 'up' as const }
  if (change < 0) return { value: Math.abs(change), type: 'down' as const }
  return { value: 0, type: 'same' as const }
}

// 平均順位を計算
const getAverageRank = (rankings: Record<string, number>) => {
  const values = Object.values(rankings)
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
}

export default function MEODashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)

  const averageCurrentRank = getAverageRank(mockMEOData.rankings.current)
  const averagePreviousRank = getAverageRank(mockMEOData.rankings.previous)
  const averageChange = getRankChange(Number(averageCurrentRank), Number(averagePreviousRank))

  const COLORS = ['#10a37f', '#0d8f6f', '#0b7e60', '#4ade80', '#22c55e']

  return (
    <div className="meo-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <MapPin className="w-6 h-6 text-[#10a37f]" />
            <h2 className="text-xl font-bold text-[#ececec]">MEO順位トラッキング</h2>
            <span className="badge badge-success">
              <Sparkles className="w-3 h-3" />
              SERP API連携中
            </span>
          </div>
          <div className="period-selector">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            >
              週間
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            >
              月間
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            >
              年間
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper primary">
              <Target className="w-5 h-5" />
            </div>
            <span className="kpi-label">平均MEO順位</span>
          </div>
          <div className="kpi-value-wrapper">
            <span className="kpi-value">{averageCurrentRank}位</span>
            {averageChange.type === 'up' && (
              <span className="kpi-change positive">
                <TrendingUp className="w-4 h-4" />
                {averageChange.value}
              </span>
            )}
            {averageChange.type === 'down' && (
              <span className="kpi-change negative">
                <TrendingDown className="w-4 h-4" />
                {averageChange.value}
              </span>
            )}
          </div>
          <div className="kpi-progress">
            <div 
              className="kpi-progress-bar"
              style={{ width: `${100 - (Number(averageCurrentRank) * 10)}%` }}
            />
          </div>
          <span className="kpi-description">主要8キーワードの平均</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper success">
              <Eye className="w-5 h-5" />
            </div>
            <span className="kpi-label">マップ表示回数</span>
          </div>
          <div className="kpi-value-wrapper">
            <span className="kpi-value">{mockMEOData.visibility.mapViews.toLocaleString()}</span>
            <span className="kpi-change positive">
              <ArrowUpRight className="w-4 h-4" />
              +23%
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper warning">
              <Star className="w-5 h-5" />
            </div>
            <span className="kpi-label">平均評価</span>
          </div>
          <div className="kpi-value-wrapper">
            <span className="kpi-value">{mockMEOData.businessInfo.rating}</span>
            <span className="kpi-subvalue">({mockMEOData.businessInfo.reviews}件)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper info">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="kpi-label">ルート検索</span>
          </div>
          <div className="kpi-value-wrapper">
            <span className="kpi-value">{mockMEOData.visibility.directionRequests}</span>
            <span className="kpi-change positive">
              <ArrowUpRight className="w-4 h-4" />
              +15%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Keyword Rankings Table */}
        <div className="dashboard-card rankings-table">
          <div className="card-header">
            <h3 className="card-title">
              <Search className="w-5 h-5" />
              キーワード別順位
            </h3>
            <button className="card-action">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
          <div className="table-container">
            <table className="rankings-table-content">
              <thead>
                <tr>
                  <th>キーワード</th>
                  <th>現在順位</th>
                  <th>変動</th>
                  <th>トレンド</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mockMEOData.rankings.current).map(([keyword, rank]) => {
                  const change = getRankChange(rank, mockMEOData.rankings.previous[keyword])
                  return (
                    <tr 
                      key={keyword}
                      className={selectedKeyword === keyword ? 'selected' : ''}
                      onClick={() => setSelectedKeyword(keyword)}
                    >
                      <td className="keyword-cell">
                        <span className="keyword-text">{keyword}</span>
                      </td>
                      <td className="rank-cell">
                        <span className={`rank-badge ${rank <= 3 ? 'top3' : rank <= 5 ? 'top5' : ''}`}>
                          {rank}位
                        </span>
                      </td>
                      <td className="change-cell">
                        {change.type === 'up' && (
                          <span className="change-indicator up">
                            <TrendingUp className="w-4 h-4" />
                            <span>{change.value}</span>
                          </span>
                        )}
                        {change.type === 'down' && (
                          <span className="change-indicator down">
                            <TrendingDown className="w-4 h-4" />
                            <span>{change.value}</span>
                          </span>
                        )}
                        {change.type === 'same' && (
                          <span className="change-indicator same">
                            <Minus className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                      <td className="trend-cell">
                        <div className="mini-chart">
                          <svg width="50" height="20">
                            <polyline
                              points={`0,${20 - (mockMEOData.rankings.previous[keyword] * 2)} 25,${20 - ((mockMEOData.rankings.previous[keyword] + rank) / 2 * 2)} 50,${20 - (rank * 2)}`}
                              fill="none"
                              stroke={change.type === 'up' ? '#10a37f' : change.type === 'down' ? '#ef4444' : '#6b7280'}
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ranking History Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp className="w-5 h-5" />
              順位推移
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockMEOData.rankingHistory}>
                <defs>
                  <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10a37f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10a37f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                <XAxis dataKey="date" stroke="#a8a8a8" />
                <YAxis 
                  reversed 
                  stroke="#a8a8a8"
                  domain={[1, 10]}
                  ticks={[1, 3, 5, 7, 10]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #424242' }}
                  labelStyle={{ color: '#ececec' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#10a37f" 
                  strokeWidth={2}
                  fill="url(#colorRank)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <Building2 className="w-5 h-5" />
              競合比較
            </h3>
          </div>
          <div className="competitors-list">
            {mockMEOData.competitors.map((competitor, index) => (
              <div key={index} className="competitor-item">
                <div className="competitor-info">
                  <span className="competitor-rank">{index + 2}</span>
                  <div className="competitor-details">
                    <span className="competitor-name">{competitor.name}</span>
                    <div className="competitor-stats">
                      <span className="stat">
                        <Star className="w-3 h-3" />
                        {competitor.rating}
                      </span>
                      <span className="stat">
                        <Users className="w-3 h-3" />
                        {competitor.reviews}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="competitor-ranking">
                  <span className="avg-rank">平均{competitor.avgRank}位</span>
                  {competitor.avgRank < Number(averageCurrentRank) ? (
                    <span className="position-indicator ahead">先行</span>
                  ) : (
                    <span className="position-indicator behind">追従</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility Metrics */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <Globe className="w-5 h-5" />
              表示パフォーマンス
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockMEOData.dailyVisibility}>
                <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                <XAxis dataKey="day" stroke="#a8a8a8" />
                <YAxis stroke="#a8a8a8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #424242' }}
                  labelStyle={{ color: '#ececec' }}
                />
                <Bar dataKey="views" fill="#10a37f" name="表示回数" />
                <Bar dataKey="clicks" fill="#0d8f6f" name="クリック数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Radar */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <Award className="w-5 h-5" />
              総合評価
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={mockMEOData.categoryPerformance}>
                <PolarGrid stroke="#424242" />
                <PolarAngleAxis dataKey="category" stroke="#a8a8a8" fontSize={12} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#424242" />
                <Radar 
                  name="スコア" 
                  dataKey="value" 
                  stroke="#10a37f" 
                  fill="#10a37f" 
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Metrics */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <Phone className="w-5 h-5" />
              ユーザーアクション
            </h3>
          </div>
          <div className="action-metrics">
            <div className="metric-item">
              <div className="metric-icon">
                <Globe className="w-8 h-8 text-[#10a37f]" />
              </div>
              <div className="metric-content">
                <span className="metric-value">{mockMEOData.visibility.websiteClicks.toLocaleString()}</span>
                <span className="metric-label">ウェブサイト訪問</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">
                <Phone className="w-8 h-8 text-[#0d8f6f]" />
              </div>
              <div className="metric-content">
                <span className="metric-value">{mockMEOData.visibility.phoneCalls}</span>
                <span className="metric-label">電話問い合わせ</span>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">
                <Navigation className="w-8 h-8 text-[#0b7e60]" />
              </div>
              <div className="metric-content">
                <span className="metric-value">{mockMEOData.visibility.directionRequests}</span>
                <span className="metric-label">ルート検索</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .meo-dashboard {
          width: 100%;
          padding: 24px;
          background: #212121;
        }

        .dashboard-header {
          margin-bottom: 24px;
          padding: 20px;
          background: #2a2a2a;
          border-radius: 12px;
          border: 1px solid #424242;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-success {
          background: #10a37f20;
          color: #10a37f;
          border: 1px solid #10a37f40;
        }

        .period-selector {
          display: flex;
          gap: 8px;
          background: #1a1a1a;
          padding: 4px;
          border-radius: 8px;
        }

        .period-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: #a8a8a8;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .period-btn:hover {
          background: #424242;
        }

        .period-btn.active {
          background: #10a37f;
          color: white;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: #2a2a2a;
          border: 1px solid #424242;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .kpi-card.highlight {
          background: linear-gradient(135deg, #2a2a2a 0%, #10a37f10 100%);
          border-color: #10a37f40;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .kpi-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon-wrapper.primary {
          background: #10a37f20;
          color: #10a37f;
        }

        .kpi-icon-wrapper.success {
          background: #4ade8020;
          color: #4ade80;
        }

        .kpi-icon-wrapper.warning {
          background: #fbbf2420;
          color: #fbbf24;
        }

        .kpi-icon-wrapper.info {
          background: #60a5fa20;
          color: #60a5fa;
        }

        .kpi-label {
          font-size: 14px;
          color: #a8a8a8;
        }

        .kpi-value-wrapper {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;
        }

        .kpi-value {
          font-size: 32px;
          font-weight: 700;
          color: #ececec;
        }

        .kpi-subvalue {
          font-size: 14px;
          color: #a8a8a8;
        }

        .kpi-change {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .kpi-change.positive {
          background: #10a37f20;
          color: #10a37f;
        }

        .kpi-change.negative {
          background: #ef444420;
          color: #ef4444;
        }

        .kpi-progress {
          width: 100%;
          height: 4px;
          background: #424242;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .kpi-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10a37f, #4ade80);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .kpi-description {
          font-size: 12px;
          color: #6b7280;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          background: #2a2a2a;
          border: 1px solid #424242;
          border-radius: 12px;
          padding: 20px;
        }

        .dashboard-card.rankings-table {
          grid-column: span 2;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #ececec;
        }

        .card-action {
          padding: 6px;
          background: transparent;
          border: 1px solid #424242;
          border-radius: 6px;
          color: #a8a8a8;
          cursor: pointer;
          transition: all 0.2s;
        }

        .card-action:hover {
          background: #424242;
          color: #ececec;
        }

        .table-container {
          overflow-x: auto;
        }

        .rankings-table-content {
          width: 100%;
          border-collapse: collapse;
        }

        .rankings-table-content th {
          text-align: left;
          padding: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #a8a8a8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #424242;
        }

        .rankings-table-content td {
          padding: 12px;
          border-bottom: 1px solid #42424220;
        }

        .rankings-table-content tr {
          cursor: pointer;
          transition: background 0.2s;
        }

        .rankings-table-content tr:hover {
          background: #42424240;
        }

        .rankings-table-content tr.selected {
          background: #10a37f10;
        }

        .keyword-cell {
          font-weight: 500;
          color: #ececec;
        }

        .keyword-text {
          display: inline-block;
          padding: 4px 8px;
          background: #424242;
          border-radius: 6px;
          font-size: 14px;
        }

        .rank-cell {
          text-align: center;
        }

        .rank-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          background: #424242;
          color: #ececec;
        }

        .rank-badge.top3 {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1a1a1a;
        }

        .rank-badge.top5 {
          background: #10a37f;
          color: white;
        }

        .change-cell {
          text-align: center;
        }

        .change-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .change-indicator.up {
          background: #10a37f20;
          color: #10a37f;
        }

        .change-indicator.down {
          background: #ef444420;
          color: #ef4444;
        }

        .change-indicator.same {
          background: #42424240;
          color: #6b7280;
        }

        .trend-cell {
          text-align: center;
        }

        .mini-chart {
          display: inline-block;
        }

        .chart-container {
          height: 250px;
        }

        .competitors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .competitor-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: #1a1a1a;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .competitor-item:hover {
          background: #424242;
        }

        .competitor-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .competitor-rank {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #424242;
          border-radius: 50%;
          font-weight: 600;
          font-size: 12px;
          color: #a8a8a8;
        }

        .competitor-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .competitor-name {
          font-weight: 500;
          color: #ececec;
          font-size: 14px;
        }

        .competitor-stats {
          display: flex;
          gap: 12px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #a8a8a8;
        }

        .competitor-ranking {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avg-rank {
          font-size: 14px;
          font-weight: 500;
          color: #ececec;
        }

        .position-indicator {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .position-indicator.ahead {
          background: #ef444420;
          color: #ef4444;
        }

        .position-indicator.behind {
          background: #10a37f20;
          color: #10a37f;
        }

        .action-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1a1a1a;
          border-radius: 8px;
          text-align: center;
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #424242;
          border-radius: 50%;
        }

        .metric-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 700;
          color: #ececec;
        }

        .metric-label {
          font-size: 12px;
          color: #a8a8a8;
        }

        @media (max-width: 1200px) {
          .dashboard-card.rankings-table {
            grid-column: span 1;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .meo-dashboard {
            padding: 16px;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .action-metrics {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
          }

          .period-selector {
            width: 100%;
          }

          .period-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}