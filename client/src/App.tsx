import { Box, Container } from "@chakra-ui/react";
import { TodoForm } from "./components/features/TodoForm";
import { Navbar } from "./components/layouts/Navbar";
import { GlobalStyles } from "./components/ui/global-styles";

function App() {
  return (
    <Box minH="100vh">
      <GlobalStyles />
      <Navbar />
      <Container maxW="container.md" pt="100px">
        <TodoForm />
      </Container>
    </Box>
  );
}

export default App;
