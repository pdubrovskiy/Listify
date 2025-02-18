import { Todo } from "../interfaces/todo.interface";

export interface CalendarTileProps {
  date: Date;
  todos: Array<Todo>;
}

export interface TodosByDate {
  [date: string]: Array<Todo>;
}
