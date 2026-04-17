import { useId, useState } from "react";

const INITIAL_TODOS = [
  { id: 1, title: "Review user directory flow" },
  { id: 2, title: "Sketch to-do UI states" },
  { id: 3, title: "Wire up local state only" },
];

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export default function TodoOperationPage() {
  const addFormId = useId();
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function addTodo(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTodos((list) => {
      const id =
        list.length === 0
          ? 1
          : Math.max(...list.map((t) => t.id)) + 1;
      return [...list, { id, title }];
    });
    setNewTitle("");
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditValue(todo.title);
  }

  function commitEdit() {
    if (editingId == null) return;
    const trimmed = editValue.trim();
    setTodos((list) =>
      list.map((t) =>
        t.id === editingId ? { ...t, title: trimmed || t.title } : t,
      ),
    );
    setEditingId(null);
    setEditValue("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function onEditKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  }

  function deleteTodo(id) {
    setTodos((list) => list.filter((t) => t.id !== id));
    if (editingId === id) cancelEdit();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            To-do operations
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Local-only list: add items, edit inline with Enter, or remove with
            the trash control.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <form
          onSubmit={addTodo}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor={addFormId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              New to-do
            </label>
            <input
              id={addFormId}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs doing?"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Add
          </button>
        </form>

        <ul className="space-y-3" aria-label="To-do list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                {editingId === todo.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={onEditKeyDown}
                    onFocus={(e) => e.target.select()}
                    aria-label="Edit to-do title"
                    className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-base text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-indigo-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                ) : (
                  <span className="block truncate text-base font-medium text-slate-900 dark:text-slate-100">
                    {todo.title}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    editingId === todo.id ? cancelEdit() : startEdit(todo)
                  }
                  disabled={editingId !== null && editingId !== todo.id}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  aria-label={
                    editingId === todo.id ? "Cancel edit" : "Edit to-do"
                  }
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  disabled={editingId !== null && editingId !== todo.id}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                  aria-label="Delete to-do"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No items yet. Add one above.
          </p>
        ) : null}
      </main>
    </div>
  );
}
