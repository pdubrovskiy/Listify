import { useQuery } from "@tanstack/react-query";
import { BACKEND_BASE_URL } from "@/config/constants";
import { ITodo } from "../interfaces/todo.interface";

export const useTaskStatistics = (startDate: string, endDate: string) => {
  return useQuery<Array<ITodo>>({
    queryKey: ["todos", startDate, endDate],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_BASE_URL}/todos?start=${startDate}&end=${endDate}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      return data;
    },
  });
};
