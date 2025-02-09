import { Badge, Box, Flex, Text } from "@chakra-ui/react";
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
          color={useColorModeValue("green.500", "green.400")}
          cursor="pointer"
          _hover={{
            color: useColorModeValue("green.600", "green.300"),
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        >
          <FaCheckCircle size={22} />
        </Box>
        <Box
          color={useColorModeValue("red.500", "red.400")}
          cursor="pointer"
          _hover={{
            color: useColorModeValue("red.600", "red.300"),
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        >
          <MdDelete size={26} />
        </Box>
      </Flex>
    </Flex>
  );
};
