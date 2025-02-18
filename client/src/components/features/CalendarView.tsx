import { Box, Flex, Heading } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import "./calendar.css";
import {
  CalendarTile,
  useMonthTodos,
  groupTodosByDate,
  getMonthBoundaries,
} from "./calendar";

const locale = "en-US";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const { startOfMonth, endOfMonth } = getMonthBoundaries(selectedDate);
  const { data: todos } = useMonthTodos(startOfMonth, endOfMonth);
  const todosByDate = groupTodosByDate(todos);

  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const todosForDay = todosByDate[formattedDate] || [];
    return <CalendarTile date={date} todos={todosForDay} />;
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
