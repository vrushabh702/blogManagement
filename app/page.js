// app/page.js
"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to My Medium-like Blog</h1>
      <p>Create and read dynamic blog posts with rich content.</p>
      <div className="space-x-4">
        <Link
          href="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Post
        </Link>
        {/* Optional: add link to list all posts if implemented */}
      </div>
    </div>
  )
}
