'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, Users, Eye, MousePointer,
  Clock, Globe, Monitor, Smartphone, Tablet,
  LogOut, Calendar,
  Activity, Zap, Target, ChartBar, Edit3, FileText
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7days')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // リアルタイムカウンター用（アニメーション削除）
  const currentUsers = 127

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
      } catch (error) {
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
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-[#ececec] text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#212121]">
      {/* ヘッダー */}
      <header className="relative bg-[#171717] border-b border-[#424242]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <h1 className="relative text-2xl font-bold text-[#ececec] flex items-center gap-2">
                  <Activity className="w-8 h-8" />
                  店舗データベース
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-[#10a37f]/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-[#10a37f] rounded-full"></div>
                <span className="text-[#10a37f] text-sm font-medium">ライブ</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/home/articles')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <FileText className="w-5 h-5" />
                <span>記事管理</span>
              </button>
              <button
                onClick={() => router.push('/home/editor')}
                className="px-6 py-3 bg-[#10a37f] hover:bg-[#0d8f6f] text-white rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>ページを編集する</span>
              </button>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-[#2f2f2f] border border-[#424242] rounded-lg text-sm text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition-all"
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
        <div className="mb-10 p-8 bg-[#2a2a2a] rounded-2xl border border-[#424242]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-[#ececec]">リアルタイムアクティビティ</h2>
              </div>
              <p className="text-[#a8a8a8]">現在サイトを閲覧中のユーザー</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-[#10a37f]">
                {currentUsers}
              </div>
              <div className="flex items-center gap-2 mt-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">前週比 +23%</span>
              </div>
            </div>
          </div>
          {/* 編集CTA */}
          <div className="mt-6 p-4 bg-[#10a37f]/10 rounded-lg border border-[#10a37f]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#ececec] font-medium">サイトの内容を更新しますか？</p>
                <p className="text-[#a8a8a8] text-sm mt-1">テキスト、画像、レイアウトを簡単に編集できます</p>
              </div>
              <button
                onClick={() => router.push('/home/editor')}
                className="px-6 py-3 bg-[#10a37f] hover:bg-[#0d8f6f] text-white rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <Edit3 className="w-5 h-5" />
                <span>編集画面へ</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: Eye, label: 'ページビュー', value: '48,590', change: '+12.5%', color: 'from-[#10a37f] to-[#0d8f6f]', trend: 'up' },
            { icon: Users, label: 'ユーザー数', value: '32,970', change: '+8.3%', color: 'from-[#0d8f6f] to-[#10a37f]', trend: 'up' },
            { icon: MousePointer, label: 'クリック率', value: '3.45%', change: '+0.8%', color: 'from-[#10a37f] to-[#0b7e60]', trend: 'up' },
            { icon: Target, label: 'コンバージョン', value: '4.2%', change: '-0.3%', color: 'from-orange-500 to-red-500', trend: 'down' },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="relative bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242] transform transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {item.change}
                  </div>
                </div>
                <h3 className="text-[#a8a8a8] text-sm mb-1">{item.label}</h3>
                <p className="text-3xl font-bold text-[#ececec]">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* トラフィックトレンド */}
        <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242] mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#ececec] flex items-center gap-2">
              <ChartBar className="w-6 h-6 text-blue-400" />
              トラフィックトレンド
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] rounded-lg text-sm">ビュー</button>
              <button className="px-3 py-1 bg-[#2f2f2f] text-[#a8a8a8] rounded-lg text-sm">ユーザー</button>
              <button className="px-3 py-1 bg-[#2f2f2f] text-[#a8a8a8] rounded-lg text-sm">直帰率</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pageViewsData}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10a37f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10a37f" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d8f6f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d8f6f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                <XAxis dataKey="date" stroke="#a8a8a8" />
                <YAxis stroke="#a8a8a8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #424242', borderRadius: '8px' }}
                  labelStyle={{ color: '#ececec' }}
                />
                <Area type="monotone" dataKey="views" stroke="#10a37f" fillOpacity={1} fill="url(#viewsGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="users" stroke="#0d8f6f" fillOpacity={1} fill="url(#usersGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* デバイス別アクセス */}
        <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242] mb-10">
          <h2 className="text-xl font-bold text-[#ececec] mb-6">デバイス別アクセス</h2>
          <div className="space-y-6">
            {[
              { device: 'モバイル', icon: Smartphone, percentage: 68, color: 'from-[#10a37f] to-[#0d8f6f]' },
              { device: 'デスクトップ', icon: Monitor, percentage: 27, color: 'from-[#0d8f6f] to-[#0b7e60]' },
              { device: 'タブレット', icon: Tablet, percentage: 5, color: 'from-[#0b7e60] to-[#10a37f]' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[#a8a8a8] font-medium">{item.device}</span>
                  </div>
                  <span className="text-2xl font-bold text-[#ececec]">{item.percentage}%</span>
                </div>
                <div className="h-3 bg-[#171717] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}