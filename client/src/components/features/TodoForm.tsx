import { BACKEND_BASE_URL } from "@/config/constants";
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useColorMode } from "../ui/color-mode";

export const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");
  const { colorMode } = useColorMode();

  const queryClient = useQueryClient();
  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const res = await fetch(`${BACKEND_BASE_URL}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: newTodo }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setNewTodo("");

        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
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
            borderColor: colorMode === "dark" ? "gray.300" : "gray.500",
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
          {isCreating ? <Spinner size="sm" /> : <IoMdAdd size={24} />}
        </Button>
      </Flex>
    </form>
  );
};
