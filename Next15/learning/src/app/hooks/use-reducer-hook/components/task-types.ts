// Define the Task type with essential properties
export type Task = {
  id: number;
  text: string;
  done: boolean;
};

// Types for the reducer actions
export type TaskAction =
  | { type: "added"; id: number; text: string }
  | { type: "changed"; task: Task }
  | { type: "deleted"; id: number };

// Props types for components
export type TaskItemProps = Readonly<{
  task: Task;
  onChange: (task: Task) => void;
  onDelete: (taskId: number) => void;
}>;

export type TaskListProps = Readonly<{
  tasks: Task[];
  onChangeTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}>;

export type AddTaskProps = Readonly<{
  onAddTask: (text: string) => void;
}>;
