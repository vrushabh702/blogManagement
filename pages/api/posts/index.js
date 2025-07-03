// pages/api/posts/index.js
import db from "./../../../libs/db"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { title, slug, blocks } = req.body
  if (!title || !slug || !Array.isArray(blocks)) {
    return res.status(400).json({ error: "Invalid payload" })
  }

  const conn = db
  const trx = await conn.getConnection()
  try {
    await trx.beginTransaction()

    const [result] = await trx.query(
      "INSERT INTO posts (title, slug) VALUES (?, ?)",
      [title, slug]
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
