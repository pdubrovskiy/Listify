import { Badge, Flex } from "@chakra-ui/react";
import { CalendarTileProps } from "./types";

export const CalendarTile = ({ todos }: CalendarTileProps) => {
  if (todos.length === 0) return null;

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <Flex direction="column" align="center" mt={2}>
      <Badge
        colorScheme={completedCount === todos.length ? "green" : "blue"}
        variant="subtle"
        borderRadius="full"
        px={2}
      >
        {completedCount}/{todos.length}
      </Badge>
    </Flex>
  );
};
