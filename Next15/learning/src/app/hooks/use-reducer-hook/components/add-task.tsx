import { useState } from "react";
import type { AddTaskProps } from "./task-types";

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text);
      setText("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-4">
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border rounded px-3 py-2 flex-grow"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
}
