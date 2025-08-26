'use client'

import { useEffect, useState } from 'react'

interface DivinationAnimationProps {
  isVisible: boolean
  duration?: number
}

export default function DivinationAnimation({ isVisible }: DivinationAnimationProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const phases = [
      { text: '静心凝神...', delay: 0 },
      { text: '意念集中...', delay: 1000 },
      { text: '天地感应...', delay: 2000 },
      { text: '卦象显现...', delay: 3000 }
    ]

    phases.forEach((phaseData, index) => {
      setTimeout(() => {
        setPhase(index)
      }, phaseData.delay)
    })
  }, [isVisible])

  if (!isVisible) return null

  const phases = [
    { text: '静心凝神...', delay: 0 },
    { text: '意念集中...', delay: 1000 },
    { text: '天地感应...', delay: 2000 },
    { text: '卦象显现...', delay: 3000 }
  ]

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      {/* 主要动画区域 */}
      <div className="relative w-32 h-32">
        {/* 外圈 - 太极图样式 */}
        <div className="absolute inset-0 border-4 border-slate-300 dark:border-slate-600 rounded-full animate-spin" 
             style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-slate-600 dark:bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
        </div>
        
        {/* 中圈 - 八卦符号 */}
        <div className="absolute inset-2 border-2 border-slate-400 dark:border-slate-500 rounded-full animate-spin" 
             style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
            <div
              key={index}
              className="absolute w-1 h-4 bg-slate-500 dark:bg-slate-400"
              style={{
                top: '10%',
                left: '50%',
                transformOrigin: '50% 350%',
                transform: `translateX(-50%) rotate(${rotation}deg)`
              }}
            />
          ))}
        </div>
        
        {/* 内圈 - 阴阳鱼 */}
        <div className="absolute inset-6 bg-slate-800 dark:bg-slate-200 rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-slate-200 dark:bg-slate-800"></div>
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-200 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-slate-200 dark:bg-slate-800 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* 涟漪效果 */}
        <div className="absolute inset-0 rounded-full border border-blue-400 opacity-30 ripple-animation"></div>
        <div className="absolute inset-0 rounded-full border border-blue-400 opacity-20 ripple-animation" 
             style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* 文字提示 */}
      <div className="text-center">
        <p className="text-lg font-serif-sc text-slate-700 dark:text-slate-300 mb-2 fade-in-up">
          {phases[phase]?.text}
        </p>
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                (phase + dot) % 3 === 0 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-slate-400 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 float-animation"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
