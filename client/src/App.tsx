import { Box, Container, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { TodoForm } from "./components/features/TodoForm";
import { Navbar } from "./components/layouts/Navbar";
import { GlobalStyles } from "./components/ui/global-styles";
import { TodoList } from "./components/features/TodoList";
import { DateSelector } from "./components/features/DateSelector";

function App() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <Box minH="100vh">
      <GlobalStyles />
      <Navbar />
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
    </Box>
  );
}

export default App;
