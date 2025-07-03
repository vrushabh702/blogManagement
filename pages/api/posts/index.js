// pages/api/posts/index.js
import db from "./../../../libs/db"

export default async function handler(req, res) {
  const conn = db
  if (req.method !== "POST") return res.status(405).end()

  const { slugs } = req.query

  const { title, slug, author, blocks } = req.body
  if (!title || !slug || author || !Array.isArray(blocks)) {
    return res.status(400).json({ error: "Invalid payload" })
  }

  if (req.method !== "GET") return res.status(405).end()
  try {
    const [posts] = await conn.query(
      "select * from posts where slug = ? limit 1",
      [slugs]
    )
    if (posts.length == 0) {
      return res.status(404).json({ error: "Post not found" })
    }

    const post = post[0]
    const [blocks] = await conn.query(
      "select block_type AS type,content FROM post_blocks where post_id = ? ORDER BY `order` ASC",
      [post.id]
    )

    const parseBlocks = blocks.map((b) => ({
      type: b.type,
      content: JSON.parse(b.content),
    }))
    res.status(200).json({ ...post, blocks: parseBlocks })
  } catch (e) {
    console.error("GET /api/posts/[slug]:", e)
    res.status(500).json({ error: "Failed to fetch post" })
  }

  const trx = await conn.getConnection()
  try {
    await trx.beginTransaction()

    const [result] = await trx.query(
      "INSERT INTO posts (title, slug, author) VALUES (?, ?,?)",
      [title, slug, author]
    )
    const postId = result.insertId

    const stmt =
      "INSERT INTO post_blocks (post_id, block_type, content, `order`) VALUES (?, ?, ?, ?)"
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i]
      await trx.query(stmt, [postId, b.type, JSON.stringify(b.content), i])
    }

    await trx.commit()
    res.status(201).json({ id: postId })
  } catch (e) {
    await trx.rollback()
    console.error(e)
    res.status(500).json({ error: "DB error" })
  } finally {
    trx.release()
  }
}
