import formidable from "formidable"
import fs from "fs"
import path from "path"
// import formidable from "formidable"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const uploadDir = path.join(process.cwd(), "/public/uploads")

  // Ensure the uploads folder exists
  fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" })

    const file = files.file
    const filename = path.basename(file[0].filepath)
    const filePath = `/uploads/${filename}`

    return res.status(200).json({ filePath })
  })
}
