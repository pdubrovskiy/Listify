import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";

interface DateSelectorProps {
  onDateChange: (date: string) => void;
  selectedDate: string;
}

export const DateSelector = ({
  onDateChange,
  selectedDate,
}: DateSelectorProps) => {
  const [date, setDate] = useState(selectedDate);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    handleDateChange(today);
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    handleDateChange(tomorrow.toISOString().split("T")[0]);
  };

  return (
    <Box mb={4}>
      <Flex gap={4} alignItems="center">
        <Input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          w="auto"
        />
        <Button onClick={handleToday} size="sm">
          Today
        </Button>
        <Button onClick={handleTomorrow} size="sm">
          Tomorrow
        </Button>
      </Flex>
    </Box>
  );
};
