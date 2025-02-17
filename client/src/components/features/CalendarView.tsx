import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { Box, Badge, Flex, Heading } from "@chakra-ui/react";
import { format } from "date-fns";
import { ITodo } from "./interfaces/todo.interface";
import { BACKEND_BASE_URL } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Set calendar locale to English
const locale = "en-US";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const startOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0];

  const { data: todos } = useQuery<Array<ITodo>>({
    queryKey: ["todos", startOfMonth, endOfMonth],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BACKEND_BASE_URL}/todos?start=${startOfMonth}&end=${endOfMonth}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (err) {
        console.error("Error fetching todos:", err);
        return [];
      }
    },
  });

  // Group todos by date
  const todosByDate = todos?.reduce((acc, todo) => {
    const date = todo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {} as Record<string, ITodo[]>);

  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const todosForDay = todosByDate?.[formattedDate] || [];

    if (todosForDay.length === 0) return null;

    const completedCount = todosForDay.filter((todo) => todo.completed).length;

    return (
      <Flex direction="column" align="center" mt={2}>
        <Badge
          colorScheme={completedCount === todosForDay.length ? "green" : "blue"}
          variant="subtle"
          borderRadius="full"
          px={2}
        >
          {completedCount}/{todosForDay.length}
        </Badge>
      </Flex>
    );
  };

  return (
    <Flex direction="column" align="center">
      <Heading mb={6}>Calendar View</Heading>
      <Box className="calendar-container">
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
              const formattedDate = format(value, "yyyy-MM-dd");
              navigate(`/?date=${formattedDate}`);
            }
          }}
          value={selectedDate}
          locale={locale}
          tileContent={tileContent}
        />
      </Box>
    </Flex>
  );
};
