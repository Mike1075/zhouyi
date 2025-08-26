import { supabase } from './supabase'
import { DivinationRecord, ChatMessage } from './database.types'

// 保存占筮记录
export async function saveDivinationRecord(record: Omit<DivinationRecord, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('divination_records')
    .insert(record)
    .select()
    .single()

  if (error) {
    console.error('Error saving divination record:', error)
    throw error
  }

  return data
}

// 获取用户的占筮历史
export async function getUserDivinationHistory(userId: string, limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('divination_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching divination history:', error)
    throw error
  }

  return data
}

// 获取特定占筮记录
export async function getDivinationRecord(id: string) {
  const { data, error } = await supabase
    .from('divination_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching divination record:', error)
    throw error
  }

  return data
}

// 保存聊天消息
export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select()
    .single()

  if (error) {
    console.error('Error saving chat message:', error)
    throw error
  }

  return data
}

// 获取占筮记录的聊天历史
export async function getChatHistory(divinationId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('divination_id', divinationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching chat history:', error)
    throw error
  }

  return data
}

// 删除占筮记录（包括相关的聊天消息）
export async function deleteDivinationRecord(id: string) {
  // 先删除相关的聊天消息
  const { error: chatError } = await supabase
    .from('chat_messages')
    .delete()
    .eq('divination_id', id)

  if (chatError) {
    console.error('Error deleting chat messages:', chatError)
    throw chatError
  }

  // 再删除占筮记录
  const { error } = await supabase
    .from('divination_records')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting divination record:', error)
    throw error
  }
}

// 更新占筮记录的解读内容
export async function updateDivinationInterpretation(id: string, interpretation: string) {
  const { data, error } = await supabase
    .from('divination_records')
    .update({ interpretation })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating divination interpretation:', error)
    throw error
  }

  return data
}
