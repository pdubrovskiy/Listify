import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
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

  // Theme colors
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.200", "gray.600");
  const inputHoverBorder = useColorModeValue("gray.300", "gray.500");
  const inputFocusBorder = useColorModeValue("gray.500", "gray.400");
  const buttonBg = useColorModeValue("gray.50", "gray.800");
  const buttonHoverBg = useColorModeValue("gray.100", "gray.700");
  const buttonActiveBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const iconHoverColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.800", "white");
  const calendarColor = useColorModeValue("gray.700", "gray.100");

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
            filter: ${useColorModeValue("invert(0.3)", "invert(0.7)")};
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
          color={iconColor}
          transition="all 0.2s"
          _hover={{
            bg: buttonHoverBg,
            color: iconHoverColor,
            transform: "translateX(-2px)",
          }}
          _active={{
            bg: buttonActiveBg,
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
            bg={inputBg}
            color={calendarColor}
            borderColor={inputBorder}
            transition="all 0.2s"
            _hover={{
              borderColor: inputHoverBorder,
            }}
            _focus={{
              borderColor: inputFocusBorder,
              boxShadow: "none",
            }}
          />
          <Button
            onClick={handleToday}
            size="lg"
            variant="outline"
            bg={buttonBg}
            color={textColor}
            borderColor={inputBorder}
            transition="all 0.2s"
            _hover={{
              bg: buttonHoverBg,
              borderColor: inputHoverBorder,
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: buttonActiveBg,
              transform: "translateY(0)",
            }}
          >
            Today
          </Button>
          <Button
            onClick={handleTomorrow}
            size="lg"
            variant="outline"
            bg={buttonBg}
            color={textColor}
            borderColor={inputBorder}
            transition="all 0.2s"
            _hover={{
              bg: buttonHoverBg,
              borderColor: inputHoverBorder,
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: buttonActiveBg,
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
          color={iconColor}
          transition="all 0.2s"
          _hover={{
            bg: buttonHoverBg,
            color: iconHoverColor,
            transform: "translateX(2px)",
          }}
          _active={{
            bg: buttonActiveBg,
            transform: "scale(0.95)",
          }}
        >
          <FiChevronRight size={24} />
        </IconButton>
      </Flex>
    </Box>
  );
};
