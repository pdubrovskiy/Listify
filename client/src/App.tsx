import { Box, Container, Flex } from "@chakra-ui/react";
import { TodoForm } from "./components/features/TodoForm";
import { Navbar } from "./components/layouts/Navbar";
import { GlobalStyles } from "./components/ui/global-styles";
import { TodoList } from "./components/features/TodoList";

function App() {
  return (
    <Box minH="100vh">
      <GlobalStyles />
      <Navbar />
      <Flex w="100vw" pt="120px">
        <Container maxW="container.xl" px={4}>
          <TodoForm />
          <TodoList />
        </Container>
      </Flex>
    </Box>
  );
}

export default App;
