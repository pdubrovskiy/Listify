import { Box, Text } from "@chakra-ui/react";

interface StatisticsSummaryProps {
  totalTasks: number;
  completedTasks: number;
  completionRate: string;
}

export const StatisticsSummary = ({
  totalTasks,
  completedTasks,
  completionRate,
}: StatisticsSummaryProps) => (
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
);
