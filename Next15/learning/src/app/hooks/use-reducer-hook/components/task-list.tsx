import Task from "./task";
import type { TaskListProps } from "./task-types";

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask,
}: TaskListProps) {
  return (
    <ul className="mt-4 w-full">
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}
