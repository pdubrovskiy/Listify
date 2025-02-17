import { Box, Container, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TodoForm } from "./components/features/TodoForm";
import { Navbar } from "./components/layouts/Navbar";
import { GlobalStyles } from "./components/ui/global-styles";
import { TodoList } from "./components/features/TodoList";
import { DateSelector } from "./components/features/DateSelector";
import { CalendarView } from "./components/features/CalendarView";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";

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
    <Flex w="100vw" pt="120px">
      <Container maxW="container.xl" px={4}>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <TodoForm selectedDate={selectedDate} />
        <TodoList selectedDate={selectedDate} />
      </Container>
    </Flex>
  );
}

function App() {
  return (
    <Router>
      <Box minH="100vh">
        <GlobalStyles />
        <Navbar />
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
