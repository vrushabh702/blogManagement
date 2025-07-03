// components/BlockRenderer.jsx
"use client"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import { useEffect } from "react"

export default function BlockRenderer({ blocks }) {
  useEffect(() => Prism.highlightAll(), [])

  return (
    <>
      {blocks.map((block, i) => {
        const { type, content } = block
        if (type === "paragraph") return <p key={i}>{content.text}</p>
        if (type === "heading") return <h2 key={i}>{content.text}</h2>
        if (type === "image")
          return (
            <img
              key={i}
              src={content.url}
              alt={content.alt}
              className="mx-auto"
            />
          )
        if (type === "code")
          return (
            <pre key={i} className="bg-gray-800 text-white p-4 rounded my-4">
              <code className={`language-${content.language}`}>
                {content.code}
              </code>
            </pre>
          )
        if (type === "list") {
          const Tag = content.style === "ol" ? "ol" : "ul"
          return (
            <Tag key={i} className="list-inside list-disc">
              {content.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </Tag>
          )
        }
        return null
      })}
    </>
  )
}
