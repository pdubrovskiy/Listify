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
            color: "gray.500",
          }}
          border="1px solid"
          borderColor="gray.200"
          _hover={{
            borderColor: "gray.300",
          }}
          _focus={{
            borderColor: "gray.500",
            boxShadow: "none",
          }}
        />
        <Button
          type="submit"
          size="lg"
          minW="100px"
          bg="gray.900"
          color="white"
          _hover={{
            bg: "gray.800",
            transform: "scale(1.02)",
          }}
          _active={{
            transform: "scale(.97)",
            bg: "black",
          }}
          disabled={!newTodo.trim()}
        >
          {isCreating ? <Spinner size="sm" /> : <IoMdAdd size={24} />}
        </Button>
      </Flex>
    </form>
  );
};
