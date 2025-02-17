import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
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
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" w="100%">
      <Box w="100%">
        <Box
          bg="white"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          p={8}
          shadow="sm"
          mb={8}
        >
          <Heading size="lg" mb={8} color="gray.800" textAlign="center">
            Task Statistics
          </Heading>

          <Box textAlign="center" mb={12} p={6} borderRadius="lg">
            <Text fontSize="lg" color="gray.600" mb={4}>
              Last 30 Days Summary
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
              {completedTasks} of {totalTasks} tasks completed
            </Text>
            <Text fontSize="xl" color="blue.500">
              {completionRate}% completion rate
            </Text>
          </Box>

          <Box mb={12}>
            <Text fontSize="xl" fontWeight="semibold" mb={6} color="gray.700">
              Daily Task Overview
            </Text>
            <Box
              height="400px"
              p={4}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
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
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#48BB78"
                    name="Total Tasks"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={6} color="gray.700">
              Task Completion Status
            </Text>
            <Box
              height="300px"
              p={4}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
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
      </Box>
    </Flex>
  );
};
