import {
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "../ui/color-mode";
import { TodoItem } from "./TodoItem";

export const TodoList = () => {
  const [isLoading] = useState(true);
  const headingGradient = useColorModeValue(
    "linear(to-r, blue.600, purple.600)",
    "linear(to-r, blue.400, purple.500)"
  );
  const emptyStateColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const spinnerColor = useColorModeValue("purple.600", "purple.500");

  const todos = [
    {
      _id: 1,
      body: "Buy groceries",
      completed: true,
    },
    {
      _id: 2,
      body: "Walk the dog",
      completed: false,
    },
    {
      _id: 3,
      body: "Do laundry",
      completed: false,
    },
    {
      _id: 4,
      body: "Cook dinner",
      completed: true,
    },
  ];
  return (
    <Container maxW="container.md" py={8}>
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "4xl" }}
        textTransform="uppercase"
        fontWeight="bold"
        textAlign="center"
        mb={8}
        bgGradient={headingGradient}
        bgClip="text"
      >
        Today's Tasks
      </Heading>

      {isLoading && (
        <Flex justifyContent="center" my={8}>
          <Spinner size="xl" color={spinnerColor} />
        </Flex>
      )}

      {!isLoading && todos?.length === 0 && (
        <Stack align="center" gap={4} my={8}>
          <Text
            fontSize="xl"
            textAlign="center"
            color={emptyStateColor}
            fontWeight="medium"
          >
            All tasks completed! 🎉
          </Text>
          <img src="/go.png" alt="Go logo" width={80} height={80} />
        </Stack>
      )}

      <Stack gap={4}>
        {todos?.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </Stack>
    </Container>
  );
};
