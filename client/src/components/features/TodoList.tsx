import { BACKEND_BASE_URL } from "@/config/constants";
import { Box, Container, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ITodo } from "./interfaces/todo.interface";
import { TodoItem } from "./TodoItem";
import React from "react";

interface TodoListProps {
  selectedDate: string;
}

export const TodoList = ({ selectedDate }: TodoListProps) => {
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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="purple.600" />
      </Flex>
    );
  }

  return (
    <Container maxW="800px" py={8}>
      <Flex direction="column" gap={6}>
        <Box>
          <Heading size="lg" color="black" mb={2}>
            {formattedDate}
          </Heading>
          {sortedTodos?.length === 0 && (
            <Text color="gray.600">No tasks for this day</Text>
          )}
        </Box>
        <Flex direction="column" gap={4}>
          {sortedTodos?.map((todo, index) => (
            <React.Fragment key={todo._id}>
              <TodoItem todo={todo} />
              {index < sortedTodos.length - 1 && <Box h="1px" bg="gray.300" />}
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
};
