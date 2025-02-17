import { useQuery } from "@tanstack/react-query";
import { BACKEND_BASE_URL } from "@/config/constants";
import { ITodo } from "../interfaces/todo.interface";

export const useMonthTodos = (startOfMonth: string, endOfMonth: string) => {
  return useQuery<Array<ITodo>>({
    queryKey: ["todos", startOfMonth, endOfMonth],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_BASE_URL}/todos?start=${startOfMonth}&end=${endOfMonth}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      return data;
    },
  });
};
