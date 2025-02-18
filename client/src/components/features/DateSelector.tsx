import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

  const handlePrevDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    handleDateChange(prevDay.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    handleDateChange(nextDay.toISOString().split("T")[0]);
  };

  return (
    <Box mb={4}>
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            filter: invert(0.3);
            opacity: 0.8;
            transition: all 0.2s;
          }
          input[type="date"]::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }
        `}
      </style>
      <Flex
        gap={4}
        alignItems="center"
        justifyContent="center"
        maxW="800px"
        mx="auto"
      >
        <IconButton
          aria-label="Previous day"
          onClick={handlePrevDay}
          variant="ghost"
          size="lg"
          color="gray.600"
          transition="all 0.2s"
          _hover={{
            bg: "gray.100",
            color: "gray.800",
            transform: "translateX(-2px)",
          }}
          _active={{
            bg: "gray.200",
            transform: "scale(0.95)",
          }}
        >
          <FiChevronLeft size={24} />
        </IconButton>
        <Flex gap={4} alignItems="center">
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            w="auto"
            textAlign="center"
            size="lg"
            bg="white"
            color="gray.700"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{
              borderColor: "gray.300",
            }}
            _focus={{
              borderColor: "gray.500",
              boxShadow: "none",
            }}
          />
          <Button
            onClick={handleToday}
            size="lg"
            variant="outline"
            bg="gray.50"
            color="gray.800"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{
              bg: "gray.100",
              borderColor: "gray.300",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: "gray.200",
              transform: "translateY(0)",
            }}
          >
            Today
          </Button>
          <Button
            onClick={handleTomorrow}
            size="lg"
            variant="outline"
            bg="gray.50"
            color="gray.800"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{
              bg: "gray.100",
              borderColor: "gray.300",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: "gray.200",
              transform: "translateY(0)",
            }}
          >
            Tomorrow
          </Button>
        </Flex>
        <IconButton
          aria-label="Next day"
          onClick={handleNextDay}
          variant="ghost"
          size="lg"
          color="gray.600"
          transition="all 0.2s"
          _hover={{
            bg: "gray.100",
            color: "gray.800",
            transform: "translateX(2px)",
          }}
          _active={{
            bg: "gray.200",
            transform: "scale(0.95)",
          }}
        >
          <FiChevronRight size={24} />
        </IconButton>
      </Flex>
    </Box>
  );
};
