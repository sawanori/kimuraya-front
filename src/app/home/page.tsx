'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  Activity, FileText, Edit3, LogOut, Users, Eye, MousePointer, Settings, MessageSquare
} from 'lucide-react'
import './responsive-home.css'
import SettingsModal from '@/components/SettingsModal'
import ApiStatusIndicator from '@/components/ApiStatusIndicator'
import MEODashboard from '@/components/MEODashboard'
import { ApiSettingsProvider } from '@/contexts/ApiSettingsContext'

interface User {
  id: string
  email: string
  name: string
  role: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

const COLORS = ['#10a37f', '#0d8f6f', '#0b7e60', '#4ade80', '#22c55e']

function HomePageContent() {
  const router = useRouter()
  const [_user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [_dateRange, _setDateRange] = useState('30d')
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly')
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  // Plausible Analytics データの取得
  const [domain, setDomain] = useState<string>('')
  const { data: analyticsData } = useSWR(
    domain ? `/api/plausible?domain=${domain}` : null, 
    fetcher, 
    { refreshInterval: 60000 }
  )

  useEffect(() => {
    setDomain(window.location.host)
  }, [])

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

  const handleMonthClick = (data: any) => {
    console.log('=== Chart click event ===')
    console.log('Full event data:', JSON.stringify(data, null, 2))
    
    // Handle different possible event structures from Recharts
    let monthKey: string | null = null
    
    // Try multiple ways to extract the month key
    if (data && data.activePayload && data.activePayload.length > 0) {
      const payload = data.activePayload[0].payload
      console.log('Payload from activePayload:', payload)
      monthKey = payload?.date || payload?.month
      console.log('Found monthKey from activePayload:', monthKey)
    } 
    
    if (!monthKey && data && data.activeLabel) {
      // Alternative: activeLabel might contain the month
      monthKey = data.activeLabel
      console.log('Found monthKey from activeLabel:', monthKey)
    }
    
    if (!monthKey && data && data.payload) {
      // Direct payload access
      monthKey = data.payload.date || data.payload.month
      console.log('Found monthKey from direct payload:', monthKey)
    }
    
    if (monthKey) {
      console.log('✅ Setting selected month:', monthKey)
      console.log('Available daily data keys:', Object.keys(analyticsData?.dailyDataByMonth || {}))
      
      // Check if we have daily data for this month
      if (analyticsData?.dailyDataByMonth && analyticsData.dailyDataByMonth[monthKey]) {
        console.log('✅ Daily data found for month:', monthKey)
        console.log('Number of days:', analyticsData.dailyDataByMonth[monthKey].length)
        setSelectedMonth(monthKey)
        setViewMode('daily')
      } else {
        console.error('❌ No daily data found for month:', monthKey)
        console.log('Available months:', Object.keys(analyticsData?.dailyDataByMonth || {}))
      }
    } else {
      console.warn('❌ Could not extract month key from click event')
    }
  }

  const handleBackToMonthly = () => {
    setViewMode('monthly')
    setSelectedMonth(null)
  }



  // デバッグ情報をログ出力（useEffectはすべて最初に宣言）
  useEffect(() => {
    if (analyticsData) {
      const data = viewMode === 'daily' && selectedMonth && analyticsData.dailyDataByMonth
        ? analyticsData.dailyDataByMonth[selectedMonth]
        : analyticsData.monthlyData || analyticsData.timeseries || []
      
      if (data && data.length > 0) {
        console.log('Current data sample:', data[0])
        console.log('Current view mode:', viewMode)
        console.log('Selected month:', selectedMonth)
        console.log('Analytics data keys:', Object.keys(analyticsData))
      }
    }
  }, [viewMode, selectedMonth, analyticsData])

  // データソースを決定（月別表示か日別表示かに応じて）
  const getCurrentData = () => {
    if (!analyticsData) {
      console.log('No analytics data available')
      return []
    }
    
    if (viewMode === 'daily' && selectedMonth && analyticsData.dailyDataByMonth) {
      const dailyData = analyticsData.dailyDataByMonth[selectedMonth]
      console.log(`Daily data for ${selectedMonth}:`, dailyData)
      return dailyData || []
    } else if (viewMode === 'monthly' && analyticsData.monthlyData) {
      console.log('Monthly data:', analyticsData.monthlyData)
      return analyticsData.monthlyData
    }
    
    // フォールバック: 従来の30日データ
    console.log('Fallback to timeseries data:', analyticsData.timeseries)
    return analyticsData.timeseries || []
  }

  const currentData = getCurrentData()

  // コンバージョン率の計算
  const conversionRate = analyticsData?.reserveClicks && currentData?.length
    ? ((analyticsData.reserveClicks / currentData.reduce((a: number, b: any) => a + b.visitors, 0)) * 100).toFixed(2)
    : '0.00'

  // 期間の総訪問者数とページビュー数
  const totalVisitors = currentData.reduce((a: number, b: any) => a + b.visitors, 0) || 0
  const totalPageviews = currentData.reduce((a: number, b: any) => a + b.pageviews, 0) || 0

  // 期間の表示用テキスト
  const getPeriodText = () => {
    if (viewMode === 'daily' && selectedMonth) {
      const date = new Date(selectedMonth + '-01')
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
    }
    return '過去12か月'
  }

  // 条件付きレンダリング（すべてのHooksの後）
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-[#ececec] text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#212121] overflow-x-hidden overflow-y-auto">
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
              <div className="hidden md:flex items-center gap-2 bg-[#10a37f]/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                <span className="text-[#10a37f] text-sm font-medium">ライブ</span>
              </div>
              <ApiStatusIndicator />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2 bg-[#424242]/50 hover:bg-[#424242] border border-[#424242] rounded-lg flex items-center gap-2 text-[#ececec] transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">詳細設定</span>
              </button>
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

      <main className="relative p-8 overflow-y-auto">
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
                  <h3 className="text-[#a8a8a8]">総ページビュー ({getPeriodText()})</h3>
                </div>
                <p className="text-3xl font-bold text-[#ececec]">{totalPageviews.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-[#0d8f6f]" />
                  <h3 className="text-[#a8a8a8]">総訪問者数 ({getPeriodText()})</h3>
                </div>
                <p className="text-3xl font-bold text-[#ececec]">{totalVisitors.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
                <div className="flex items-center gap-3 mb-2">
                  <MousePointer className="w-6 h-6 text-[#0b7e60]" />
                  <h3 className="text-[#a8a8a8]">予約ボタン CVR ({getPeriodText()})</h3>
                </div>
                <p className="text-3xl font-bold text-[#ececec]">{conversionRate}%</p>
              </div>
            </div>

            {/* ページビューと訪問者数の折線グラフ */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-[#ececec]">
                    {viewMode === 'monthly' ? '過去12か月のトラフィック' : `${getPeriodText()}の日別トラフィック`}
                  </h2>
                  {viewMode === 'daily' && (
                    <button
                      onClick={handleBackToMonthly}
                      className="px-3 py-1 bg-[#10a37f]/20 hover:bg-[#10a37f]/30 text-[#10a37f] text-sm rounded-lg transition-colors"
                    >
                      ← 月別表示に戻る
                    </button>
                  )}
                </div>
                {viewMode === 'monthly' && (
                  <div className="text-sm text-[#a8a8a8]">
                    月をクリックして日別データを表示
                  </div>
                )}
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={currentData}
                    onClick={viewMode === 'monthly' ? handleMonthClick : undefined}
                    onMouseDown={viewMode === 'monthly' ? (e) => console.log('Chart mouse down:', e) : undefined}
                    style={{ cursor: viewMode === 'monthly' ? 'pointer' : 'default' }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                    <XAxis 
                      dataKey="date"
                      stroke="#a8a8a8"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        if (viewMode === 'monthly') {
                          // 月別表示の場合、YYYY-MM形式を日本語表示に変換
                          const [_year, month] = value.split('-')
                          return `${parseInt(month)}月`
                        } else {
                          // 日別表示の場合
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }
                      }}
                    />
                    <YAxis stroke="#a8a8a8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #424242', borderRadius: '8px' }}
                      labelStyle={{ color: '#ececec' }}
                      formatter={(value: any) => value.toLocaleString()}
                      labelFormatter={(label) => {
                        if (viewMode === 'monthly') {
                          return label
                        } else {
                          const date = new Date(label)
                          return date.toLocaleDateString('ja-JP')
                        }
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pageviews" 
                      name="ページビュー" 
                      stroke="#10a37f" 
                      strokeWidth={2} 
                      dot={viewMode === 'monthly' ? { 
                        fill: '#10a37f', 
                        strokeWidth: 2, 
                        r: 4,
                        onClick: handleMonthClick
                      } : false}
                      activeDot={viewMode === 'monthly' ? { 
                        r: 6, 
                        stroke: '#10a37f', 
                        strokeWidth: 2,
                        onClick: handleMonthClick
                      } : undefined}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      name="訪問者" 
                      stroke="#0d8f6f" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      dot={viewMode === 'monthly' ? { 
                        fill: '#0d8f6f', 
                        strokeWidth: 2, 
                        r: 4,
                        onClick: handleMonthClick
                      } : false}
                      activeDot={viewMode === 'monthly' ? { 
                        r: 6, 
                        stroke: '#0d8f6f', 
                        strokeWidth: 2,
                        onClick: handleMonthClick
                      } : undefined}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* デバイス別アクセス円グラフ */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#424242]">
              <h2 className="text-xl font-bold text-[#ececec] mb-6">デバイス別アクセス ({getPeriodText()})</h2>
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

            {/* MEO Dashboard - SERP API Data */}
            <MEODashboard />

            {/* 口コミ管理 */}
            <div className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg border border-purple-500/30">
              <div className="mb-4">
                <p className="text-[#ececec] font-medium text-lg">顧客エンゲージメント</p>
                <p className="text-[#a8a8a8] text-sm mt-1">Googleビジネスプロフィールの口コミを管理し、顧客との関係を強化</p>
              </div>
              <button
                onClick={() => router.push('/home/gbp')}
                className="w-full p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-10 h-10" />
                <div className="text-center">
                  <span className="text-xl font-bold block">口コミ管理</span>
                  <span className="text-sm opacity-90 mt-1 block">Googleビジネスプロフィールのレビュー管理・返信</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-2xl font-bold">234</span>
                  <span className="text-xs opacity-75">件のレビュー</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export default function HomePage() {
  return (
    <ApiSettingsProvider>
      <HomePageContent />
    </ApiSettingsProvider>
  )
}