import { BACKEND_BASE_URL } from "@/config/constants";
import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useColorModeValue } from "../ui/color-mode";
import { ITodo } from "./interfaces/todo.interface";

export const TodoItem = ({ todo }: { todo: ITodo }) => {
  const bgColor = useColorModeValue("gray.50", "whiteAlpha.50");
  const bgHoverColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const borderHoverColor = useColorModeValue("gray.300", "whiteAlpha.300");
  const textColor = useColorModeValue("gray.800", "white");
  const completedTextColor = useColorModeValue("green.600", "green.200");
  const completedColor = useColorModeValue("green.500", "green.400");
  const completedHoverColor = useColorModeValue("green.600", "green.300");
  const uncompleteColor = useColorModeValue("gray.300", "gray.600");
  const uncompleteHoverColor = useColorModeValue("gray.400", "gray.500");

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
    <Flex gap={3} alignItems="center">
      <Flex
        flex={1}
        alignItems="center"
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        p={3}
        borderRadius="xl"
        justifyContent="space-between"
        _hover={{ borderColor: borderHoverColor, bg: bgHoverColor }}
        transition="all 0.2s"
      >
        <Text
          color={todo.completed ? completedTextColor : textColor}
          textDecoration={todo.completed ? "line-through" : "none"}
          fontSize="md"
          fontWeight="medium"
        >
          {todo.body}
        </Text>
        {todo.completed && (
          <Badge ml="3" colorScheme="green" variant="subtle">
            Done
          </Badge>
        )}
        {!todo.completed && (
          <Badge ml="3" colorScheme="yellow" variant="subtle">
            In Progress
          </Badge>
        )}
      </Flex>
      <Flex gap={2} alignItems="center">
        <Box
          color={todo.completed ? completedColor : uncompleteColor}
          cursor="pointer"
          _hover={{
            color: todo.completed ? completedHoverColor : uncompleteHoverColor,
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
          onClick={() => updateTodo()}
        >
          {isUpdating ? <Spinner size={"sm"} /> : <FaCheckCircle size={22} />}
        </Box>
        <Box
          color={useColorModeValue("red.500", "red.400")}
          cursor="pointer"
          _hover={{
            color: useColorModeValue("red.600", "red.300"),
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
          onClick={() => deleteTodo()}
        >
          {isDeleting ? (
            <Spinner size={"sm"}></Spinner>
          ) : (
            <MdDelete size={26} />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
