import { NextRequest, NextResponse } from 'next/server'
import { generateHexagram, parseHexagram, formatQuery } from '@/lib/yijing'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { question, mode, yaos } = await request.json()

    if (!question || !question.trim()) {
      return NextResponse.json({ error: '问题不能为空' }, { status: 400 })
    }

    // 生成或使用提供的爻结果
    let yaoResults: number[]
    if (mode === 'auto') {
      yaoResults = generateHexagram()
    } else if (mode === 'manual' && yaos && yaos.length === 6) {
      yaoResults = yaos
    } else {
      return NextResponse.json({ error: '无效的占筮模式或爻数据' }, { status: 400 })
    }

    // 解析卦象
    const hexagramData = parseHexagram(yaoResults)
    
    // 格式化查询字符串
    const queryString = formatQuery(question, hexagramData)

    // 调用Dify AI API
    const difyResponse = await fetch(process.env.DIFY_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: queryString,
        user: uuidv4(),
        response_mode: 'streaming'
      }),
    })

    if (!difyResponse.ok) {
      throw new Error(`Dify API error: ${difyResponse.status}`)
    }

    // 创建流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // 首先发送卦象信息
        const hexagramMessage = `data: ${JSON.stringify({
          type: 'hexagram',
          data: hexagramData
        })}\n\n`
        controller.enqueue(encoder.encode(hexagramMessage))

        // 然后处理Dify的流式响应
        const reader = difyResponse.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  
                  if (data.event === 'message') {
                    // 转发内容
                    const contentMessage = `data: ${JSON.stringify({
                      type: 'content',
                      content: data.answer || ''
                    })}\n\n`
                    controller.enqueue(encoder.encode(contentMessage))
                  } else if (data.event === 'message_end') {
                    // 流结束
                    controller.close()
                    break
                  }
                } catch (e) {
                  // 忽略解析错误，继续处理下一行
                  console.warn('Failed to parse Dify response line:', line)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing Dify stream:', error)
          controller.error(error)
        } finally {
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    )
  }
}
