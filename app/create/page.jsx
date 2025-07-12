// app/create/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/SortableItem";
import MediaEditor from "@/components/MediaEditor";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [type, setType] = useState("paragraph");
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const addBlock = async () => {
    if (type === "image" && selectedImage) {
      // Upload the image first
      const formData = new FormData();
      formData.append("file", selectedImage);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (data?.filePath) {
        setBlocks((prev) => [
          ...prev,
          {
            type: "image",
            content: { url: data.filePath, alt: selectedImage.name },
          },
        ]);
        setSelectedImage(null);
        setPreviewURL(null);
      }
      return;
    }

    const content = {
      paragraph: { text: input },
      heading: { text: input },
      code: { code: input, language: "plaintext" },
      // image: { url: input, alt: "" },

      list: { style: "ul", items: input.split("\n") },
    }[type];
    setBlocks((prev) => [...prev, { type, content }]);
    setInput("");
  };

  const save = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, slug, blocks }),
    });
    if (res.ok) {
      router.push(`/posts/${slug}`);
    } else {
      alert("Error saving post");
    }
  };

  return (
    <section className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full border p-2"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <div className="flex space-x-2">
        <select
          className="border p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {["paragraph", "heading", "code", "image", "list"].map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
        {type === "code" ? (
          <textarea
            className="flex-grow border p-2 font-mono"
            placeholder="Enter code"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        ) : type === "image" ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedImage(file);
                setPreviewURL(URL.createObjectURL(file));
              }}
              className="border p-2"
            />
            {previewURL && (
              <img src={previewURL} alt="Preview" className="w-48 mt-2" />
            )}
          </>
        ) : (
          // <textarea
          //   className="flex-grow border p-2"
          //   placeholder={
          //     type === "list" ? "One item per line" : `Enter ${type}`
          //   }
          //   rows={3}
          //   value={input}
          //   onChange={(e) => setInput(e.target.value)}
          // />
          <MediaEditor content={input} setContent={setInput} />
        )}

        <button onClick={addBlock} className="bg-blue-600 text-white px-4">
          Add Block
        </button>
      </div>

      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor)
        )}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = active.id;
            const newIndex = over.id;
            setBlocks((items) => arrayMove(items, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext
          items={blocks.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((b, i) => (
              // <div key={i} className="border p-2">
              //   <strong>{b.type}</strong>: {JSON.stringify(b.content)}
              // </div>
              <SortableItem
                key={i}
                id={i}
                block={b}
                onDelete={(id) =>
                  setBlocks((prev) => prev.filter((_, i) => i !== id))
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button onClick={save} className="mt-4 bg-green-600 text-white px-4">
        Publish
      </button>
    </section>
  );
}
