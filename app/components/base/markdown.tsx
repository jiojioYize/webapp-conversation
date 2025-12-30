'use client'
import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ThinkBlock } from './think-block'

// 解析内容，分离 think 标签和普通内容
interface ContentPart {
  type: 'think' | 'text'
  content: string
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = []
  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi
  let lastIndex = 0
  let match

  while ((match = thinkRegex.exec(content)) !== null) {
    // 添加 think 标签之前的文本
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim()
      if (text)
        parts.push({ type: 'text', content: text })
    }
    // 添加 think 内容
    const thinkContent = match[1].trim()
    if (thinkContent)
      parts.push({ type: 'think', content: thinkContent })

    lastIndex = match.index + match[0].length
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim()
    if (text)
      parts.push({ type: 'text', content: text })
  }

  return parts
}

export function Markdown(props: { content: string }) {
  const parts = parseContent(props.content)

  return (
    <div className="markdown-body">
      {parts.map((part, index) => (
        part.type === 'think'
          ? (
            <ThinkBlock key={index} content={part.content} />
          )
          : (
            <ReactMarkdown
              key={index}
              remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
              rehypePlugins={[RehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return (!inline && match)
                    ? (
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={atelierHeathLight}
                        language={match[1]}
                        showLineNumbers
                        PreTag="div"
                      />
                    )
                    : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    )
                },
              }}
              linkTarget={'_blank'}
            >
              {part.content}
            </ReactMarkdown>
          )
      ))}
    </div>
  )
}
