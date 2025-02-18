import { Todo } from "../interfaces/todo.interface";
import { TodosByDate } from "./types";

export const groupTodosByDate = (
  todos: Array<Todo> | undefined
): TodosByDate => {
  if (!todos) return {};

  return todos.reduce((acc, todo) => {
    const date = todo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {} as TodosByDate);
};

export const getMonthBoundaries = (
  date: Date
): { startOfMonth: string; endOfMonth: string } => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  return { startOfMonth, endOfMonth };
};
