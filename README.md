# 周易智慧命运解读

一个现代化的周易占筮网站，运用古老的《周易》智慧为用户提供人生问题的启发与指导。

## 功能特性

### 🎯 核心功能
- **自动占筮**：系统自动生成卦象，模拟传统三枚铜钱占筮法
- **手动占筮**：用户可手动输入六爻结果，支持传统占筮方式
- **AI智能解读**：集成Dify AI，提供深度的卦象解读和人生指导
- **流式响应**：实时显示AI解读过程，提升用户体验

### 👤 用户系统
- **用户认证**：基于Supabase Auth的安全登录注册系统
- **历史记录**：保存用户的占筮历史，支持查看和管理
- **数据安全**：采用行级安全策略，确保用户数据隐私

### 🎨 设计特色
- **水墨风格**：融合传统中国文化元素的现代化设计
- **仪式感动画**：精心设计的占筮过程动画，营造神秘氛围
- **响应式设计**：完美适配桌面和移动设备
- **暗色模式**：支持明暗主题切换

## 技术栈

### 前端
- **Next.js 15** - React全栈框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **React Markdown** - Markdown内容渲染

### 后端
- **Vercel Serverless Functions** - 无服务器API
- **Dify AI API** - 智能解读服务
- **Supabase** - 数据库和认证服务

### 部署
- **Vercel** - 自动化部署和托管
- **GitHub** - 代码版本控制

## 环境配置

### 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Dify AI API Configuration
DIFY_API_KEY=your_dify_api_key
DIFY_API_URL=https://pro.aifunbox.com/v1/chat-messages
```

### 数据库设置

1. 在Supabase控制台中执行 `database/schema.sql` 文件
2. 确保启用了行级安全策略
3. 配置认证提供商（如需要）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 自动部署完成

## 核心算法

### 占筮算法
- 模拟传统三枚铜钱占筮法
- 生成6个爻值（6、7、8、9）
- 解析本卦、变爻、之卦

### 卦象解析
- 64卦完整映射表
- 自动识别卦象名称
- 变爻位置计算

## 许可证

MIT License
