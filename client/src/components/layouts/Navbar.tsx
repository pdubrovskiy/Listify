import { Box, Container, Flex, IconButton } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "../ui/color-mode";
import { FiCalendar, FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const iconHoverColor = useColorModeValue("gray.800", "white");
  const iconHoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      zIndex={10}
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Box
            fontSize="2xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            Listify
          </Box>
          <Flex gap={2}>
            <IconButton
              aria-label="Open calendar"
              onClick={() => navigate("/calendar")}
              variant="ghost"
              color={iconColor}
              _hover={{
                bg: iconHoverBg,
                color: iconHoverColor,
              }}
            >
              <FiCalendar size={20} />
            </IconButton>
            <IconButton
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              variant="ghost"
              color={iconColor}
              _hover={{
                bg: iconHoverBg,
                color: iconHoverColor,
              }}
            >
              {colorMode === "dark" ? (
                <FiSun size={20} />
              ) : (
                <FiMoon size={20} />
              )}
            </IconButton>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
