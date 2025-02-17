import { Box, Text } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { StatusData } from "./types";

interface CompletionStatusChartProps {
  statusData: StatusData[];
}

export const CompletionStatusChart = ({
  statusData,
}: CompletionStatusChartProps) => (
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
);
