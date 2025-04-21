import { useState } from "react";
import type { TaskItemProps } from "./task-types";

export default function Task({ task, onChange, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  function handleSave() {
    if (text.trim() !== "") {
      setIsEditing(false);
      onChange({
        ...task,
        text: text,
      });
    }
  }

  return (
    <div className="flex items-center gap-2 my-2">
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
        className="h-4 w-4"
      />

      {isEditing ? (
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => {
            if (
              !e.relatedTarget ||
              !e.relatedTarget.classList.contains("save-button")
            ) {
              handleSave();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          className="border rounded px-2 py-1 flex-grow"
          autoFocus
        />
      ) : (
        <span
          className={`flex-grow cursor-pointer ${
            task.done ? "line-through text-gray-400" : ""
          }`}
        >
          {task.text}
        </span>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className={`px-2 py-1 rounded text-white save-button ${
            isEditing
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
              setText(task.text);
            }
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
