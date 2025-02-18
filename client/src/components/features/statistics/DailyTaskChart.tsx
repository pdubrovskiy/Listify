import { Box, Text } from "@chakra-ui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DailyStatsData } from "./types";

interface DailyTaskChartProps {
  dailyStats: Array<DailyStatsData>;
}

export const DailyTaskChart = ({ dailyStats }: DailyTaskChartProps) => (
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
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
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
);
