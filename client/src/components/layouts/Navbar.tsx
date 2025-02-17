import { Box, Container, Flex, IconButton } from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      zIndex={10}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
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
              color="gray.600"
              _hover={{
                bg: "gray.100",
                color: "gray.800",
              }}
            >
              <FiCalendar size={20} />
            </IconButton>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
