export interface ITodo {
  _id: number;
  body: string;
  completed: boolean;
  date: string; // ISO string format
  time?: string; // Optional time in HH:mm format
  createdAt: string;
  updatedAt: string;
}
