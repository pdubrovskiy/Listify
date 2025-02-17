import { Box, Container, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_BASE_URL } from "@/config/constants";
import { ITodo } from "./interfaces/todo.interface";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import React from "react";

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

  // Prepare data for daily statistics chart
  const dailyStats = React.useMemo(() => {
    if (!todos) return [];

    const stats = new Map();
    const today = new Date();

    // Initialize all dates in the last 30 days with 0 values
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      stats.set(dateStr, { date: dateStr, total: 0, completed: 0 });
    }

    // Fill in actual data
    todos.forEach((todo) => {
      const dateStr = todo.date;
      if (stats.has(dateStr)) {
        const stat = stats.get(dateStr);
        stat.total += 1;
        if (todo.completed) {
          stat.completed += 1;
        }
      }
    });

    return Array.from(stats.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [todos]);

  // Prepare data for completion status chart
  const statusData = [
    {
      name: "Tasks",
      completed: completedTasks,
      pending: totalTasks - completedTasks,
    },
  ];

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

          <Box mb={8}>
            <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
              Daily Task Overview
            </Text>
            <Box height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#4299E1"
                    name="Completed Tasks"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#48BB78"
                    name="Total Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
              Task Completion Status
            </Text>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#4299E1" name="Completed" />
                  <Bar dataKey="pending" fill="#F6AD55" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
