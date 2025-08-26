'use client'

import { useState, useEffect } from 'react'
import ManualInput from './ManualInput'
import DivinationAnimation from './DivinationAnimation'
import { useAuth } from './AuthProvider'
import { saveDivinationRecord } from '@/lib/database'

interface InputSectionProps {
  onResult: (result: string) => void
  onLoading: (loading: boolean) => void
  onQuestionChange: (question: string) => void
  onHexagramInfo: (info: any) => void
  initialQuestion?: string
}

export default function InputSection({
  onResult,
  onLoading,
  onQuestionChange,
  onHexagramInfo,
  initialQuestion = ''
}: InputSectionProps) {
  const { user } = useAuth()
  const [question, setQuestion] = useState(initialQuestion)
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [manualYaos, setManualYaos] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setQuestion(initialQuestion)
  }, [initialQuestion])

  const handleQuestionChange = (value: string) => {
    setQuestion(value)
    onQuestionChange(value)
  }

  const handleSubmit = async () => {
    if (!question.trim()) {
      alert('请输入您的问题')
      return
    }

    if (mode === 'manual' && manualYaos.length !== 6) {
      alert('请完成所有六爻的选择')
      return
    }

    if (mode === 'auto') {
      setIsAnimating(true)
      // 播放3-5秒的动画
      await new Promise(resolve => setTimeout(resolve, 4000))
      setIsAnimating(false)
    }

    onLoading(true)
    onResult('')

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          mode,
          yaos: mode === 'manual' ? manualYaos : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('请求失败')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应')
      }

      let result = ''
      let hexagramInfo = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'hexagram') {
                hexagramInfo = data.data
                onHexagramInfo(hexagramInfo)
              } else if (data.type === 'content') {
                result += data.content
                onResult(result)
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 保存占筮记录到数据库
      if (user && hexagramInfo && result) {
        try {
          await saveDivinationRecord({
            user_id: user.id,
            question,
            mode,
            yao_results: hexagramInfo.yaoResults,
            ben_gua: hexagramInfo.benGua,
            bian_yao: hexagramInfo.bianYao,
            zhi_gua: hexagramInfo.zhiGua,
            interpretation: result
          })
        } catch (error) {
          console.error('Error saving divination record:', error)
          // 不影响用户体验，静默处理错误
        }
      }
    } catch (error) {
      console.error('Error:', error)
      onResult('抱歉，解读过程中出现了错误，请稍后重试。')
    } finally {
      onLoading(false)
    }
  }

  const isManualComplete = mode === 'manual' && manualYaos.length === 6
  const canSubmit = question.trim() && (mode === 'auto' || isManualComplete)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
      {/* 问题输入区域 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          请在此静心输入您想问询之事...
        </label>
        <textarea
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg 
                   bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-slate-400 dark:placeholder-slate-500"
          placeholder="请详细描述您的问题或困惑..."
        />
      </div>

      {/* 模式选择 */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setMode('auto')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'auto'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
            }`}
          >
            自动占筮
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
            }`}
          >
            手动占筮
          </button>
        </div>
      </div>

      {/* 手动输入区域 */}
      {mode === 'manual' && (
        <ManualInput
          yaos={manualYaos}
          onChange={setManualYaos}
        />
      )}

      {/* 动画区域 */}
      {isAnimating && (
        <div className="mb-6">
          <DivinationAnimation isVisible={isAnimating} duration={4000} />
        </div>
      )}

      {/* 提交按钮 */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isAnimating}
          className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
            canSubmit && !isAnimating
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          {mode === 'auto' ? '开始占筮' : '解读此卦'}
        </button>
      </div>
    </div>
  )
}
