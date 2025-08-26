'use client'

import { useState } from 'react'
import InputSection from '@/components/InputSection'
import ResultDisplay from '@/components/ResultDisplay'
import UserMenu from '@/components/UserMenu'
import { DivinationRecord } from '@/lib/database.types'

export default function Home() {
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [hexagramInfo, setHexagramInfo] = useState<any>(null)

  const handleSelectRecord = (record: DivinationRecord) => {
    setQuestion(record.question)
    setResult(record.interpretation || '')
    setHexagramInfo({
      benGua: record.ben_gua,
      bianYao: record.bian_yao,
      zhiGua: record.zhi_gua,
      yaoResults: record.yao_results
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ink-bg">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <nav className="flex justify-end mb-8 fade-in-up">
          <UserMenu onSelectRecord={handleSelectRecord} />
        </nav>

        <header className="text-center mb-12 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold font-serif-sc text-slate-800 dark:text-slate-100 mb-4 float-animation">
            周易智慧命运解读
          </h1>
          <p className="text-lg font-sans-sc text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            运用古老的《周易》智慧，为您的人生问题提供深刻的启发与指导
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="w-2 h-2 bg-slate-400 rounded-full opacity-60"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full opacity-40"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full opacity-60"></div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <InputSection
            onResult={setResult}
            onLoading={setIsLoading}
            onQuestionChange={setQuestion}
            onHexagramInfo={setHexagramInfo}
            initialQuestion={question}
          />

          {(result || isLoading) && (
            <ResultDisplay
              result={result}
              isLoading={isLoading}
              question={question}
              hexagramInfo={hexagramInfo}
            />
          )}
        </div>
      </div>
    </div>
  )
}
