import { BACKEND_BASE_URL } from "@/config/constants";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./interfaces/todo.interface";

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();
  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/todos/${todo._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !todo.completed }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/todos/${todo._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return (
    <Flex
      p={4}
      bg="white"
      borderRadius="xl"
      alignItems="center"
      gap={4}
      _hover={{
        bg: "gray.50",
        transform: "translateY(-1px)",
        boxShadow: "sm",
      }}
      borderWidth="2px"
      borderColor="gray.100"
      transition="all 0.2s ease"
    >
      <Box
        as="button"
        onClick={() => !isUpdating && updateTodo()}
        _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        color={todo.completed ? "green.500" : "gray.300"}
        _hover={{
          color: todo.completed ? "green.600" : "green.400",
          transform: "scale(1.1)",
        }}
        transition="all 0.2s ease"
      >
        {isUpdating ? (
          <Spinner size="sm" color="blue.500" />
        ) : (
          <FaCheckCircle size={24} />
        )}
      </Box>
      <Text
        flex={1}
        color="gray.800"
        fontSize="lg"
        textDecoration={todo.completed ? "line-through" : "none"}
        opacity={todo.completed ? 0.5 : 1}
        transition="all 0.2s ease"
      >
        {todo.body}
      </Text>
      <Box
        as="button"
        onClick={() => !isDeleting && deleteTodo()}
        _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        color="red.400"
        cursor="pointer"
        _hover={{
          color: "red.500",
          transform: "scale(1.1)",
        }}
        transition="all 0.2s ease"
      >
        {isDeleting ? (
          <Spinner size="sm" color="red.500" />
        ) : (
          <MdDelete size={26} />
        )}
      </Box>
    </Flex>
  );
};
