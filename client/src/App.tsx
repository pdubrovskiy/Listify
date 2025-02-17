import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useSearchParams,
} from "react-router-dom";
import { CalendarView } from "./components/features/CalendarView";
import { DateSelector } from "./components/features/DateSelector";
import { StatisticsView } from "./components/features/StatisticsView";
import { TodoForm } from "./components/features/TodoForm";
import { TodoList } from "./components/features/TodoList";
import { Navbar } from "./components/layouts/Navbar";
import { GlobalStyles } from "./components/ui/global-styles";

function TodoPage() {
  const [searchParams] = useSearchParams();
  const dateFromUrl = searchParams.get("date");
  const [selectedDate, setSelectedDate] = useState(
    dateFromUrl || new Date().toISOString().split("T")[0]
  );

  // Update selectedDate when URL parameter changes
  useEffect(() => {
    if (dateFromUrl) {
      setSelectedDate(dateFromUrl);
    }
  }, [dateFromUrl]);

  return (
    <Box>
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <TodoForm selectedDate={selectedDate} />
      <TodoList selectedDate={selectedDate} />
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Box minH="100vh">
        <GlobalStyles />
        <Navbar />
        <Flex w="100vw" justify="center" pt="120px">
          <Box maxW="1200px" w="100%" px={4}>
            <Routes>
              <Route path="/" element={<TodoPage />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/statistics" element={<StatisticsView />} />
            </Routes>
          </Box>
        </Flex>
      </Box>
    </Router>
  );
}

export default App;
