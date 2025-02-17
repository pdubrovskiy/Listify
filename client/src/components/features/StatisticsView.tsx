import { Box, Container, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_BASE_URL } from "@/config/constants";
import { ITodo } from "./interfaces/todo.interface";

export const StatisticsView = () => {
  // Fetch todos for the last 30 days
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: todos, isLoading } = useQuery<Array<ITodo>>({
    queryKey: ["todos", startDate, endDate],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BACKEND_BASE_URL}/todos?start=${startDate}&end=${endDate}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (err) {
        console.error("Error fetching todos:", err);
        return [];
      }
    },
  });

  // Calculate basic statistics
  const totalTasks = todos?.length || 0;
  const completedTasks = todos?.filter((todo) => todo.completed).length || 0;
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bg="white"
        pt="120px"
        display="flex"
        justifyContent="center"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white" pt="120px">
      <Container maxW="container.xl" py={8}>
        <Box
          bg="white"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          p={8}
          shadow="sm"
        >
          <Heading size="lg" mb={8} color="gray.800" textAlign="center">
            Task Statistics
          </Heading>

          <Box textAlign="center" mb={8}>
            <Text fontSize="lg" color="gray.600" mb={2}>
              Last 30 Days Summary
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {completedTasks} of {totalTasks} tasks completed
            </Text>
            <Text fontSize="lg" color="blue.500">
              {completionRate}% completion rate
            </Text>
          </Box>

          {/* TODO: Add charts here */}
        </Box>
      </Container>
    </Box>
  );
};
