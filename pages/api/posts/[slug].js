// pages/api/posts/[slug].js
import db from "./../../../libs/db"

export default async function handler(req, res) {
  const { slug } = req.query

  const conn = db
  const [posts] = await conn.query(
    "SELECT id, title, created_at FROM posts WHERE slug = ?",
    [slug]
  )
  if (posts.length === 0) {
    return res.status(404).json({ error: "Not found" })
  }

  const post = posts[0]

  const [blocks] = await conn.query(
    "SELECT block_type AS type, content, `order` FROM post_blocks WHERE post_id = ? ORDER BY `order` ASC",
    [post.id]
  )

  post.blocks = blocks.map((b) => ({
    type: b.type,
    content: JSON.parse(b.content),
  }))

  res.status(200).json(post)
}
