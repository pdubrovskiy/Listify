import { BACKEND_BASE_URL } from "@/config/constants";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useColorModeValue } from "../ui/color-mode";
import { ITodo } from "./interfaces/todo.interface";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  selectedDate: string;
}

export const TodoList = ({ selectedDate }: TodoListProps) => {
  const headingColor = useColorModeValue("black", "white");
  const emptyStateColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const spinnerColor = useColorModeValue("purple.600", "purple.500");
  const dividerColor = useColorModeValue("gray.300", "whiteAlpha.500");

  const { data: todos, isLoading } = useQuery<Array<ITodo>>({
    queryKey: ["todos", selectedDate],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BACKEND_BASE_URL}/todos?date=${selectedDate}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (err) {
        console.log(err);
      }
    },
  });

  const sortedTodos = todos?.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container maxW="868px" py={8}>
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="semibold"
        textAlign="center"
        mb={8}
        color={headingColor}
        letterSpacing="wide"
      >
        Tasks for {formattedDate}:
      </Heading>

      {isLoading && (
        <Flex justifyContent="center" my={8}>
          <Spinner size="xl" color={spinnerColor} />
        </Flex>
      )}

      {!isLoading &&
        (!todos?.length || todos?.every(({ completed }) => completed)) && (
          <Stack align="center" gap={4} my={8}>
            <Text
              fontSize="xl"
              textAlign="center"
              color={emptyStateColor}
              fontWeight="medium"
            >
              {!todos?.length
                ? "No tasks for this day yet!"
                : "All tasks completed! 🎉"}
            </Text>
          </Stack>
        )}

      <Stack gap={4}>
        {sortedTodos?.map((todo, index) => (
          <React.Fragment key={todo._id}>
            <TodoItem todo={todo} />
            {!todo.completed && sortedTodos[index + 1]?.completed && (
              <Box as="hr" borderColor={dividerColor} opacity={0.5} />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Container>
  );
};
