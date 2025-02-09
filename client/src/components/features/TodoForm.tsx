import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useColorMode } from "../ui/color-mode";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

export const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { colorMode } = useColorMode();

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      alert("Todo added!");
      setNewTodo("");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={createTodo}>
      <Flex gap={3} maxW="800px" mx="auto">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          autoFocus
          placeholder="Add a new task..."
          size="lg"
          bg={colorMode === "dark" ? "gray.800" : "white"}
          color={colorMode === "dark" ? "white" : "gray.800"}
          _placeholder={{
            color: colorMode === "dark" ? "gray.400" : "gray.500",
          }}
          border="1px solid"
          borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
          _hover={{
            borderColor: colorMode === "dark" ? "gray.500" : "gray.300",
          }}
          _focus={{
            borderColor: colorMode === "dark" ? "blue.300" : "blue.500",
            boxShadow: "none",
          }}
        />
        <Button
          type="submit"
          size="lg"
          minW="100px"
          bg={colorMode === "dark" ? "gray.800" : "gray.900"}
          color="white"
          _hover={{
            bg: colorMode === "dark" ? "gray.700" : "gray.800",
            transform: "scale(1.02)",
          }}
          _active={{
            transform: "scale(.97)",
            bg: colorMode === "dark" ? "gray.900" : "black",
          }}
          disabled={!newTodo.trim()}
        >
          {isPending ? <Spinner size="sm" /> : <IoMdAdd size={24} />}
        </Button>
      </Flex>
    </form>
  );
};
