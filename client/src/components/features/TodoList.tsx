import { BASE_URL } from "@/App";
import {
  Container,
  Box,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useColorModeValue } from "../ui/color-mode";
import { ITodo } from "./interfaces/todo.interface";
import { TodoItem } from "./TodoItem";
import React from "react";

export const TodoList = () => {
  const headingColor = useColorModeValue("black", "white");
  const emptyStateColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const spinnerColor = useColorModeValue("purple.600", "purple.500");
  const dividerColor = useColorModeValue("gray.300", "whiteAlpha.500");

  const { data: todos, isLoading } = useQuery<Array<ITodo>>({
    queryKey: ["todos"],

    queryFn: async () => {
      try {
        const res = await fetch(`${BASE_URL}/todos`);
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
        Today's Tasks:
      </Heading>

      {isLoading && (
        <Flex justifyContent="center" my={8}>
          <Spinner size="xl" color={spinnerColor} />
        </Flex>
      )}

      {!isLoading && todos?.every(({ completed }) => completed) && (
        <Stack align="center" gap={4} my={8}>
          <Text
            fontSize="xl"
            textAlign="center"
            color={emptyStateColor}
            fontWeight="medium"
          >
            All tasks completed! 🎉
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
