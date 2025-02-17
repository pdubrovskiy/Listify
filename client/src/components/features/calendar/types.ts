import { ITodo } from "../interfaces/todo.interface";

export interface CalendarTileProps {
  date: Date;
  todos: ITodo[];
}

export interface TodosByDate {
  [date: string]: ITodo[];
}
