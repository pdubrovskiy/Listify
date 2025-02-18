import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import React from "react";
import {
  useTaskStatistics,
  StatisticsSummary,
  DailyTaskChart,
  CompletionStatusChart,
  calculateDailyStats,
  calculateStatusData,
} from "./statistics";

export const StatisticsView = () => {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: todos, isLoading } = useTaskStatistics(startDate, endDate);

  const totalTasks = todos?.length || 0;
  const completedTasks = todos?.filter((todo) => todo.completed).length || 0;
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0";

  const dailyStats = React.useMemo(
    () => calculateDailyStats(todos || []),
    [todos]
  );

  const statusData = calculateStatusData(totalTasks, completedTasks);

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

          <StatisticsSummary
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            completionRate={completionRate}
          />
          <DailyTaskChart dailyStats={dailyStats} />
          <CompletionStatusChart statusData={statusData} />
        </Box>
      </Box>
    </Flex>
  );
};
