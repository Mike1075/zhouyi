'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { getUserDivinationHistory, deleteDivinationRecord } from '@/lib/database'
import { DivinationRecord } from '@/lib/database.types'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectRecord: (record: DivinationRecord) => void
}

export default function HistoryModal({ isOpen, onClose, onSelectRecord }: HistoryModalProps) {
  const { user } = useAuth()
  const [records, setRecords] = useState<DivinationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      loadHistory()
    }
  }, [isOpen, user])

  const loadHistory = async () => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const data = await getUserDivinationHistory(user.id)
      setRecords(data)
    } catch (error: any) {
      setError('加载历史记录失败')
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return

    try {
      await deleteDivinationRecord(id)
      setRecords(records.filter(record => record.id !== id))
    } catch (error: any) {
      alert('删除失败，请重试')
      console.error('Error deleting record:', error)
    }
  }

  const handleSelectRecord = (record: DivinationRecord) => {
    onSelectRecord(record)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-4xl max-h-[80vh] mx-4 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            占筮历史
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600 dark:text-slate-400">加载中...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={loadHistory}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重试
              </button>
            </div>
          )}

          {!loading && !error && records.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">暂无占筮记录</p>
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                        {record.question.length > 50 
                          ? record.question.substring(0, 50) + '...' 
                          : record.question
                        }
                      </h3>
                      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <div>
                          <span className="font-medium">本卦：</span>{record.ben_gua}
                          {record.bian_yao.length > 0 && (
                            <>
                              <span className="ml-4 font-medium">变爻：</span>
                              第{record.bian_yao.join('、')}爻动
                            </>
                          )}
                          <span className="ml-4 font-medium">之卦：</span>{record.zhi_gua}
                        </div>
                        <div>
                          <span className="font-medium">时间：</span>{formatDate(record.created_at)}
                          <span className="ml-4 font-medium">模式：</span>
                          {record.mode === 'auto' ? '自动占筮' : '手动占筮'}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleSelectRecord(record)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
