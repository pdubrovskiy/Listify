import { Todo } from "../interfaces/todo.interface";
import { DailyStatsData, StatusData } from "./types";

export const calculateDailyStats = (
  todos: Array<Todo>
): Array<DailyStatsData> => {
  if (!todos) {
    return [];
  }

  const stats = new Map();
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    stats.set(dateStr, { date: dateStr, total: 0, completed: 0 });
  }

  todos.forEach((todo) => {
    const dateStr = todo.date;
    if (stats.has(dateStr)) {
      const stat = stats.get(dateStr);
      stat.total += 1;
      if (todo.completed) {
        stat.completed += 1;
      }
    }
  });

  return Array.from(stats.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

export const calculateStatusData = (
  totalTasks: number,
  completedTasks: number
): Array<StatusData> => {
  return [
    {
      name: "Tasks",
      completed: completedTasks,
      pending: totalTasks - completedTasks,
    },
  ];
};
