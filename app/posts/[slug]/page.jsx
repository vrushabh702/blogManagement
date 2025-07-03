// app/posts/[slug]/page.jsx
import BlockRenderer from "../../../components/BlockRender"

export const dynamicParams = true

export async function generateStaticParams() {
  // Optionally fetch published slugs to pre-render
  return []
}

export default async function PostPage({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${params.slug}`
  )
  if (!res.ok) {
    return <p className="text-red-600">Post not found.</p>
  }

  const post = await res.json()

  return (
    <article className="prose mx-auto py-6">
      <h1>{post.title}</h1>
      <BlockRenderer blocks={post.blocks} />
    </article>
  )
}
