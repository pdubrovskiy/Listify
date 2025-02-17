import { BACKEND_BASE_URL } from "@/config/constants";
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

interface TodoFormProps {
  selectedDate: string;
}

export const TodoForm = ({ selectedDate }: TodoFormProps) => {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: newTodo,
            date: selectedDate,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        setNewTodo("");
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <form onSubmit={(e) => createTodo(e)}>
      <Flex gap={3} maxW="800px" mx="auto">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          autoFocus
          placeholder="Add a new task..."
          size="lg"
          bg="white"
          color="gray.800"
          _placeholder={{
            color: "gray.400",
          }}
          border="2px solid"
          borderColor="gray.200"
          borderRadius="lg"
          _hover={{
            borderColor: "blue.200",
          }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
          }}
          transition="all 0.2s ease"
        />
        <Button
          type="submit"
          size="lg"
          minW="100px"
          bg="blue.500"
          color="white"
          borderRadius="lg"
          _hover={{
            bg: "blue.600",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          _active={{
            transform: "translateY(0)",
            bg: "blue.700",
          }}
          disabled={!newTodo.trim()}
          transition="all 0.2s ease"
        >
          {isCreating ? (
            <Spinner size="sm" color="white" />
          ) : (
            <IoMdAdd size={24} />
          )}
        </Button>
      </Flex>
    </form>
  );
};
