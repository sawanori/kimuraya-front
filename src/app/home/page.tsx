'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  Activity, FileText, Edit3, LogOut, TrendingUp, Users, Eye, MousePointer
} from 'lucide-react'
import './responsive-home.css'

interface User {
  id: string
  email: string
  name: string
  role: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

const COLORS = ['#10a37f', '#0d8f6f', '#0b7e60', '#4ade80', '#22c55e']

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  
  // Plausible Analytics データの取得
  const domain = typeof window !== 'undefined' ? window.location.host : ''
  const { data: analyticsData } = useSWR(
    () => domain ? `/api/plausible?domain=${domain}` : null, 
    fetcher, 
    { refreshInterval: 60000 }
  )

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

  // コンバージョン率の計算
  const conversionRate = analyticsData?.reserveClicks && analyticsData?.timeseries?.length
    ? ((analyticsData.reserveClicks / analyticsData.timeseries.reduce((a: number, b: any) => a + b.visitors, 0)) * 100).toFixed(2)
    : '0.00'

  // 30日間の合計訪問者数とページビュー数
  const totalVisitors = analyticsData?.timeseries?.reduce((a: number, b: any) => a + b.visitors, 0) || 0
  const totalPageviews = analyticsData?.timeseries?.reduce((a: number, b: any) => a + b.pageviews, 0) || 0

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
                  サイトアクセス統計
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-[#10a37f]/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                <span className="text-[#10a37f] text-sm font-medium">ライブ</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">ログアウト</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative p-8">
        {!analyticsData ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#a8a8a8] text-lg">アナリティクスデータを読み込み中...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* コンテンツ管理 */}
            <div className="p-6 bg-[#10a37f]/10 rounded-lg border border-[#10a37f]/30">
              <div className="mb-4">
                <p className="text-[#ececec] font-medium text-lg">コンテンツ管理</p>
                <p className="text-[#a8a8a8] text-sm mt-1">サイトのコンテンツを管理・編集するための機能にアクセスできます</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/home/articles')}
                  className="p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex flex-col items-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-10 h-10" />
                  <div className="text-center">
                    <span className="text-lg font-bold block">記事管理</span>
                    <span className="text-sm opacity-90 mt-1 block">ブログ記事の作成・編集・削除</span>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/home/editor')}
                  className="p-6 bg-[#10a37f] hover:bg-[#0d8f6f] text-white rounded-xl flex flex-col items-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-10 h-10" />
                  <div className="text-center">
                    <span className="text-lg font-bold block">ページを編集する</span>
                    <span className="text-sm opacity-90 mt-1 block">サイトのコンテンツを直接編集</span>
                  </div>
                </button>
              </div>
            </div>

            {/* リアルタイム訪問者数 */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
              <h2 className="text-xl font-bold text-[#ececec] mb-4">現在アクティブユーザー</h2>
              <div className="flex items-center justify-between">
                <div className="text-[#a8a8a8]">現在サイトを閲覧中のユーザー数</div>
                <div className="text-5xl font-bold text-[#10a37f]">{analyticsData.realtime || 0}</div>
              </div>
            </div>

            {/* KPIカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-6 h-6 text-[#10a37f]" />
                  <h3 className="text-[#a8a8a8]">総ページビュー (30日)</h3>
                </div>
                <p className="text-3xl font-bold text-[#ececec]">{totalPageviews.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-[#0d8f6f]" />
                  <h3 className="text-[#a8a8a8]">総訪問者数 (30日)</h3>
                </div>
                <p className="text-3xl font-bold text-[#ececec]">{totalVisitors.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
                <div className="flex items-center gap-3 mb-2">
                  <MousePointer className="w-6 h-6 text-[#0b7e60]" />
                  <h3 className="text-[#a8a8a8]">予約ボタン CVR (30日)</h3>
                </div>
                <p className="text-3xl font-bold text-[#ececec]">{conversionRate}%</p>
              </div>
            </div>

            {/* ページビューと訪問者数の折線グラフ */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
              <h2 className="text-xl font-bold text-[#ececec] mb-6">過去30日間のトラフィック</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.timeseries || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#a8a8a8"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis stroke="#a8a8a8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #424242', borderRadius: '8px' }}
                      labelStyle={{ color: '#ececec' }}
                      formatter={(value: any) => value.toLocaleString()}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pageviews" 
                      name="ページビュー" 
                      stroke="#10a37f" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      name="訪問者" 
                      stroke="#0d8f6f" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* デバイス別アクセス円グラフ */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
              <h2 className="text-xl font-bold text-[#ececec] mb-6">デバイス別アクセス (30日)</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.devices || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percent }: any) => `${device}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="visitors"
                      nameKey="device"
                    >
                      {(analyticsData.devices || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #424242', borderRadius: '8px' }}
                      formatter={(value: any) => `${value.toLocaleString()} 訪問者`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* デバイス別の凡例 */}
              <div className="mt-4 space-y-2">
                {(analyticsData.devices || []).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-[#a8a8a8]">{item.device}</span>
                    </div>
                    <span className="text-[#ececec] font-medium">{item.visitors.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}