'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import AuthModal from './AuthModal'
import HistoryModal from './HistoryModal'
import { DivinationRecord } from '@/lib/database.types'

interface UserMenuProps {
  onSelectRecord?: (record: DivinationRecord) => void
}

export default function UserMenu({ onSelectRecord }: UserMenuProps) {
  const { user, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleShowHistory = () => {
    setShowHistoryModal(true)
    setShowUserMenu(false)
  }

  const handleSelectRecord = (record: DivinationRecord) => {
    if (onSelectRecord) {
      onSelectRecord(record)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          登录
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.email?.[0]?.toUpperCase()}
        </div>
        <span className="text-slate-700 dark:text-slate-300 hidden sm:block">
          {user.email}
        </span>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              {user.email}
            </div>
            <button
              onClick={handleShowHistory}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              占筮历史
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      )}

      {/* 点击外部关闭菜单 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* 历史记录模态框 */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectRecord={handleSelectRecord}
      />
    </div>
  )
}
