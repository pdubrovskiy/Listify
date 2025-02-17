import { BACKEND_BASE_URL } from "@/config/constants";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ITodo } from "./interfaces/todo.interface";
import { TodoItem } from "./TodoItem";
import React from "react";
import { FiCheckCircle, FiInbox } from "react-icons/fi";

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

  const allTasksCompleted =
    sortedTodos &&
    sortedTodos.length > 0 &&
    sortedTodos.every((todo) => todo.completed);

  const completedStartIndex =
    sortedTodos?.findIndex((todo) => todo.completed) ?? -1;

  return (
    <Container maxW="800px" py={8}>
      <Flex direction="column" gap={6}>
        <Box>
          <Heading size="lg" color="black" mb={2}>
            {formattedDate}
          </Heading>
        </Box>
        <Flex direction="column" gap={4}>
          {sortedTodos?.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              py={8}
              px={4}
              bg="gray.50"
              borderRadius="xl"
              border="2px dashed"
              borderColor="gray.200"
              color="gray.600"
              gap={3}
            >
              <Icon as={FiInbox} boxSize={10} />
              <Text fontSize="lg" fontWeight="medium">
                No tasks for today
              </Text>
              <Text fontSize="md" color="gray.500">
                Add your first task to get started
              </Text>
            </Flex>
          ) : (
            <>
              {allTasksCompleted && (
                <Flex
                  direction="column"
                  align="center"
                  py={6}
                  px={4}
                  bg="green.50"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="green.100"
                  color="green.700"
                  gap={3}
                  mb={4}
                >
                  <Icon as={FiCheckCircle} boxSize={8} />
                  <Text fontSize="lg" fontWeight="medium">
                    Great job! All tasks completed
                  </Text>
                </Flex>
              )}
              {sortedTodos?.map((todo, index) => (
                <React.Fragment key={todo._id}>
                  <TodoItem todo={todo} />
                  {completedStartIndex > 0 &&
                    index === completedStartIndex - 1 && (
                      <Box
                        h="2px"
                        bg="gray.200"
                        w="100%"
                        my={2}
                        borderRadius="full"
                      />
                    )}
                </React.Fragment>
              ))}
            </>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
