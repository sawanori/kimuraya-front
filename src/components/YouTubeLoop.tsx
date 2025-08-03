'use client'

import React, { useEffect, useRef } from 'react'

interface YouTubeLoopProps {
  videoId: string
  loopDuration?: number // デフォルト5秒
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function YouTubeLoop({ videoId, loopDuration = 5 }: YouTubeLoopProps) {
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // YouTube IFrame APIをロード
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // APIが準備できたら呼ばれる
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          mute: 1,
          origin: window.location.origin,
          cc_load_policy: 0,  // 字幕を非表示
          hl: 'ja',          // 言語設定
          widget_referrer: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // 既存のインターバルをクリア
              if (intervalRef.current) {
                clearInterval(intervalRef.current)
              }
              
              // 5秒ごとに最初に戻る
              intervalRef.current = setInterval(() => {
                if (playerRef.current && playerRef.current.seekTo) {
                  playerRef.current.seekTo(0)
                }
              }, loopDuration * 1000)
            }
          }
        }
      })
    }

    // 既にAPIがロードされている場合
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [videoId, loopDuration])

  return (
    <>
      <style jsx>{`
        /* YouTube埋め込みのUI要素を隠す */
        :global(.ytp-gradient-top),
        :global(.ytp-chrome-top),
        :global(.ytp-show-cards-title),
        :global(.ytp-pause-overlay),
        :global(.ytp-watermark),
        :global(.ytp-title),
        :global(.ytp-title-channel),
        :global(.ytp-title-text) {
          display: none !important;
        }
        
        /* iframeのポインターイベントを無効化 */
        :global(#youtube-player-${videoId} iframe) {
          pointer-events: none !important;
        }
      `}</style>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
        <div
          id={`youtube-player-${videoId}`}
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            width: '177.77777778vh', 
            height: '100vh',
            minWidth: '100%',
            minHeight: '100%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </>
  )
}