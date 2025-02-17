import { Box, Container, Flex, IconButton } from "@chakra-ui/react";
import { FiCalendar, FiBarChart2 } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCalendar = () => {
    if (location.pathname === "/calendar") {
      navigate("/");
    } else {
      navigate("/calendar");
    }
  };

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      zIndex={10}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      backdropFilter="blur(10px)"
      backgroundColor="rgba(255, 255, 255, 0.9)"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      transition="all 0.3s ease"
    >
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Box
            fontSize="2xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate("/")}
            color="gray.800"
            _hover={{
              color: "gray.900",
              transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease"
          >
            Listify
          </Box>
          <Flex gap={2}>
            <IconButton
              aria-label="Toggle calendar"
              onClick={toggleCalendar}
              variant="ghost"
              color={
                location.pathname === "/calendar" ? "blue.500" : "gray.600"
              }
              size="lg"
              _hover={{
                bg: "gray.100",
                color:
                  location.pathname === "/calendar" ? "blue.600" : "gray.800",
                transform: "translateY(-1px)",
              }}
              _active={{
                bg: "gray.200",
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              <FiCalendar size={20} />
            </IconButton>
            <IconButton
              aria-label="View statistics"
              onClick={() => navigate("/statistics")}
              variant="ghost"
              color={
                location.pathname === "/statistics" ? "blue.500" : "gray.600"
              }
              size="lg"
              _hover={{
                bg: "gray.100",
                color:
                  location.pathname === "/statistics" ? "blue.600" : "gray.800",
                transform: "translateY(-1px)",
              }}
              _active={{
                bg: "gray.200",
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              <FiBarChart2 size={20} />
            </IconButton>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
