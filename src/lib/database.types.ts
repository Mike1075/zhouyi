export interface DivinationRecord {
  id: string
  user_id: string
  question: string
  mode: 'auto' | 'manual'
  yao_results: number[]
  ben_gua: string
  bian_yao: number[]
  zhi_gua: string
  interpretation: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  divination_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      divination_records: {
        Row: DivinationRecord
        Insert: Omit<DivinationRecord, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DivinationRecord, 'id' | 'created_at' | 'updated_at'>>
      }
      chat_messages: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>
      }
    }
  }
}
