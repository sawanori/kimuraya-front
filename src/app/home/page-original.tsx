'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  TrendingUp, TrendingDown, Users, Eye, MousePointer,
  Monitor, Smartphone, Tablet,
  LogOut, ArrowRight, Sparkles,
  Activity, Zap, Target, ChartBar
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function HomePage() {
  const router = useRouter()
  const [_user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7days')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // リアルタイムカウンター用
  const [currentUsers, setCurrentUsers] = useState(127)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUsers(prev => prev + Math.floor(Math.random() * 7) - 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // アクセス分析用モックデータ
  const realtimeData = [
    { time: '10秒前', users: 124 },
    { time: '20秒前', users: 118 },
    { time: '30秒前', users: 132 },
    { time: '40秒前', users: 127 },
    { time: '50秒前', users: 135 },
    { time: '60秒前', users: 129 },
  ]

  const pageViewsData = [
    { date: '月', views: 4200, users: 2890, bounce: 32 },
    { date: '火', views: 5480, users: 3820, bounce: 28 },
    { date: '水', views: 6890, users: 4950, bounce: 25 },
    { date: '木', views: 6150, users: 4280, bounce: 29 },
    { date: '金', views: 7950, users: 5620, bounce: 22 },
    { date: '土', views: 9100, users: 6560, bounce: 20 },
    { date: '日', views: 8820, users: 6290, bounce: 21 },
  ]

  const userBehavior = [
    { metric: '直帰率', value: 25, fullMark: 100 },
    { metric: 'ページ/セッション', value: 85, fullMark: 100 },
    { metric: '平均滞在時間', value: 78, fullMark: 100 },
    { metric: 'コンバージョン', value: 45, fullMark: 100 },
    { metric: 'リピート率', value: 68, fullMark: 100 },
  ]

  const trafficFlow = [
    { source: 'Google', target: 'ホーム', value: 3500 },
    { source: 'SNS', target: 'メニュー', value: 2100 },
    { source: '直接', target: 'アクセス', value: 1800 },
    { source: 'メール', target: '予約', value: 950 },
  ]

  const heatmapData = [
    { hour: '09', mon: 45, tue: 52, wed: 48, thu: 51, fri: 58, sat: 72, sun: 68 },
    { hour: '12', mon: 85, tue: 89, wed: 92, thu: 88, fri: 95, sat: 98, sun: 94 },
    { hour: '15', mon: 65, tue: 68, wed: 70, thu: 72, fri: 75, sat: 88, sun: 85 },
    { hour: '18', mon: 92, tue: 95, wed: 88, thu: 91, fri: 98, sat: 95, sun: 89 },
    { hour: '21', mon: 78, tue: 82, wed: 75, thu: 85, fri: 92, sat: 88, sun: 72 },
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-r-2 border-l-2 border-white animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* アニメーション背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-75"></div>
                <h1 className="relative text-2xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-8 h-8" />
                  Analytics Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">ライブ</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/home/editor')}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg flex items-center gap-2 text-purple-300 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm">ページ編集</span>
              </button>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="7days">過去7日間</option>
                <option value="30days">過去30日間</option>
                <option value="90days">過去90日間</option>
              </select>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-300 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative p-8">
        {/* リアルタイムインジケーター */}
        <div className="mb-10 p-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h2 className="text-xl font-bold text-white">リアルタイムアクティビティ</h2>
              </div>
              <p className="text-gray-400">現在サイトを閲覧中のユーザー</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {currentUsers}
              </div>
              <div className="flex items-center gap-2 mt-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">前週比 +23%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeData}>
                <defs>
                  <linearGradient id="realtimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="users" stroke="#8B5CF6" fillOpacity={1} fill="url(#realtimeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: Eye, label: 'ページビュー', value: '48,590', change: '+12.5%', color: 'from-blue-500 to-cyan-500', trend: 'up' },
            { icon: Users, label: 'ユーザー数', value: '32,970', change: '+8.3%', color: 'from-purple-500 to-pink-500', trend: 'up' },
            { icon: MousePointer, label: 'クリック率', value: '3.45%', change: '+0.8%', color: 'from-green-500 to-emerald-500', trend: 'up' },
            { icon: Target, label: 'コンバージョン', value: '4.2%', change: '-0.3%', color: 'from-orange-500 to-red-500', trend: 'down' },
          ].map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-75 rounded-2xl blur-xl transition-all duration-300 group-hover:opacity-100"
                style={{
                  backgroundImage: `linear-gradient(to right, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`
                }}
              ></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {item.change}
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">{item.label}</h3>
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <div className={`mt-4 h-1 bg-gray-800 rounded-full overflow-hidden ${hoveredCard === index ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  <div className={`h-full bg-gradient-to-r ${item.color} animate-pulse`} style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* メイングラフエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* トラフィックトレンド */}
          <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ChartBar className="w-6 h-6 text-blue-400" />
                トラフィックトレンド
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">ビュー</button>
                <button className="px-3 py-1 bg-white/10 text-gray-400 rounded-lg text-sm">ユーザー</button>
                <button className="px-3 py-1 bg-white/10 text-gray-400 rounded-lg text-sm">直帰率</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pageViewsData}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#3B82F6" fillOpacity={1} fill="url(#viewsGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="users" stroke="#8B5CF6" fillOpacity={1} fill="url(#usersGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ユーザー行動分析 */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              ユーザー行動分析
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={userBehavior}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#374151" />
                  <Radar name="パフォーマンス" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* デバイス別アクセス */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">デバイス別アクセス</h2>
            <div className="space-y-6">
              {[
                { device: 'モバイル', icon: Smartphone, percentage: 68, color: 'from-blue-500 to-blue-600' },
                { device: 'デスクトップ', icon: Monitor, percentage: 27, color: 'from-purple-500 to-purple-600' },
                { device: 'タブレット', icon: Tablet, percentage: 5, color: 'from-pink-500 to-pink-600' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-300 font-medium">{item.device}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      <div className="h-full bg-white/20 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アクセスヒートマップ */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">アクセスヒートマップ</h2>
            <div className="grid grid-cols-8 gap-1">
              <div></div>
              {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
                <div key={day} className="text-xs text-gray-400 text-center">{day}</div>
              ))}
              {heatmapData.map((row) => (
                <>
                  <div className="text-xs text-gray-400 text-right pr-1">{row.hour}時</div>
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                    const value = row[day as keyof typeof row] as number
                    const intensity = value / 100
                    return (
                      <div
                        key={day}
                        className="aspect-square rounded transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: `rgba(139, 92, 246, ${intensity})`,
                          boxShadow: intensity > 0.7 ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none'
                        }}
                      />
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* トラフィックフロー */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-10">トラフィックフロー</h2>
          <div className="space-y-8">
            {trafficFlow.map((flow, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center gap-4">
                  {/* ソース */}
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-white/10 group-hover:border-blue-500/50 transition-all">
                      <div className="text-gray-400 text-sm mb-1">流入元</div>
                      <div className="text-white font-bold text-lg">{flow.source}</div>
                      <div className="text-blue-400 text-2xl font-bold mt-1">{flow.value.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {/* アニメーション矢印 */}
                  <div className="flex items-center justify-center px-4">
                    <div className="relative w-24">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <div className="bg-gray-900 px-1">
                          <ArrowRight className="w-6 h-6 text-purple-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 w-full">
                        <div className="w-4 h-4 bg-purple-400 rounded-full opacity-50 animate-flow"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* ターゲット */}
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-white/10 group-hover:border-purple-500/50 transition-all">
                      <div className="text-gray-400 text-sm mb-1">ランディングページ</div>
                      <div className="text-white font-bold text-lg">{flow.target}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-2 flex-1 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000"
                            style={{ width: `${(flow.value / 3500) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{Math.round((flow.value / 3500) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-flow {
          animation: flow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}