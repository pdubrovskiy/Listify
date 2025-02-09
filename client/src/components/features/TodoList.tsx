import { BASE_URL } from "@/App";
import {
  Container,
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

export const TodoList = () => {
  const headingColor = useColorModeValue("black", "white");
  const emptyStateColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const spinnerColor = useColorModeValue("purple.600", "purple.500");

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

  return (
    <Container maxW="container.md" py={8}>
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "4xl" }}
        textTransform="uppercase"
        fontWeight="extrabold"
        textAlign="center"
        mb={8}
        color={headingColor}
        letterSpacing="wide"
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
