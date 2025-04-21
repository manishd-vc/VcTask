"use client";
import { useReducer } from "react";
import AddTask from "./components/add-task";
import TaskList from "./components/task-list";
import tasksReducer from "./components/task-reducer";
import type { Task } from "./components/task-types";

// Initial data
const initialTasks: Task[] = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];
let nextId = initialTasks.length;

export default function Page() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text: string) {
    dispatch({
      type: "added",
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task: Task) {
    dispatch({
      type: "changed",
      task: task,
    });
  }

  function handleDeleteTask(taskId: number) {
    dispatch({
      type: "deleted",
      id: taskId,
    });
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Prague Itinerary</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click on a task to edit, or check the box to mark as completed
        </div>
        <AddTask onAddTask={handleAddTask} />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}
