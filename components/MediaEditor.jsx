// components/MediaEditor.jsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
// import { lowlight } from "lowlight/lib/all";
// import { lowlight } from "lowlight/lib/core";
import { lowlight } from "lowlight/lib/core"; // ✅ This works in v2

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEffect } from "react";
import "./../app/editor.css"; // for custom tailwind styling (optional)

const MediaEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content || "<p>Start writing...</p>",
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <div className="flex space-x-2 border-b pb-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="btn"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="btn"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="btn"
        >
          Underline
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="btn"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="btn"
        >
          Code
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="btn"
        >
          Img
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default MediaEditor;
