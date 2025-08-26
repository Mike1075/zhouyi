'use client'

import ReactMarkdown from 'react-markdown'

interface ResultDisplayProps {
  result: string
  isLoading: boolean
  question: string
  hexagramInfo: {
    benGua: string
    bianYao: number[]
    zhiGua: string
    yaoResults: number[]
  } | null
}

export default function ResultDisplay({ 
  result, 
  isLoading, 
  question, 
  hexagramInfo 
}: ResultDisplayProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
      {/* 占筮信息 */}
      {hexagramInfo && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
            占筮信息
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-slate-600 dark:text-slate-400">您的问题：</span>
              <span className="text-slate-800 dark:text-slate-200 ml-2">{question}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600 dark:text-slate-400">本卦：</span>
              <span className="text-slate-800 dark:text-slate-200 ml-2">{hexagramInfo.benGua}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600 dark:text-slate-400">变爻：</span>
              <span className="text-slate-800 dark:text-slate-200 ml-2">
                {hexagramInfo.bianYao.length > 0 
                  ? `第${hexagramInfo.bianYao.join('、')}爻动` 
                  : '无变爻'
                }
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600 dark:text-slate-400">之卦：</span>
              <span className="text-slate-800 dark:text-slate-200 ml-2">{hexagramInfo.zhiGua}</span>
            </div>
          </div>
        </div>
      )}

      {/* 解读结果 */}
      <div>
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
          智慧解读
        </h3>
        
        {isLoading && !result && (
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>正在为您解读卦象...</span>
          </div>
        )}

        {result && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2 mt-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-1">
                    {children}
                  </ol>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-700 dark:text-slate-200">
                    {children}
                  </em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        )}

        {isLoading && result && (
          <div className="mt-4 flex items-center space-x-2 text-slate-500 dark:text-slate-400">
            <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm">继续解读中...</span>
          </div>
        )}
      </div>
    </div>
  )
}
