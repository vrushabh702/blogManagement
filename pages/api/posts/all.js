import db from "./../../../libs/db"
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end()

  try {
    const [posts] = await db.query(
      "select id, title, slug, created_at FROM posts ORDER BY created_at DESC"
    )
    res.status(200).json(posts)
  } catch (e) {
    console.error("GET /api/posts/all:", e)
    res.status(500).json({ error: "Failed to fetch posts all" })
  }
}
