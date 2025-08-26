-- 创建占筮记录表
CREATE TABLE IF NOT EXISTS divination_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('auto', 'manual')),
    yao_results INTEGER[] NOT NULL,
    ben_gua TEXT NOT NULL,
    bian_yao INTEGER[] NOT NULL DEFAULT '{}',
    zhi_gua TEXT NOT NULL,
    interpretation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建聊天消息表
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    divination_id UUID REFERENCES divination_records(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_divination_records_user_id ON divination_records(user_id);
CREATE INDEX IF NOT EXISTS idx_divination_records_created_at ON divination_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_divination_id ON chat_messages(divination_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为占筮记录表创建更新时间戳触发器
CREATE TRIGGER update_divination_records_updated_at 
    BEFORE UPDATE ON divination_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略
ALTER TABLE divination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 创建占筮记录的安全策略
CREATE POLICY "Users can view their own divination records" ON divination_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own divination records" ON divination_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own divination records" ON divination_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own divination records" ON divination_records
    FOR DELETE USING (auth.uid() = user_id);

-- 创建聊天消息的安全策略
CREATE POLICY "Users can view chat messages for their divination records" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM divination_records 
            WHERE divination_records.id = chat_messages.divination_id 
            AND divination_records.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert chat messages for their divination records" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM divination_records 
            WHERE divination_records.id = chat_messages.divination_id 
            AND divination_records.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update chat messages for their divination records" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM divination_records 
            WHERE divination_records.id = chat_messages.divination_id 
            AND divination_records.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete chat messages for their divination records" ON chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM divination_records 
            WHERE divination_records.id = chat_messages.divination_id 
            AND divination_records.user_id = auth.uid()
        )
    );
