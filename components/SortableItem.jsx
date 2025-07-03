import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function SortableItem({ id, block, onDelete }) {
  console.log("id", id, "block", block, "onDelete", onDelete)
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-2 -sm flex justify-between items-center"
    >
      <div className="flex-1 mr-4">
        <strong>{block.style}</strong>: {JSON.stringify(block.content)}
      </div>
      {/* <button onClick={onDelete(id)} className="text-red-600 hover:underline">
        Delete
      </button> */}
    </div>
  )
}
