import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useColorMode } from "../ui/color-mode";
import { LuMoon, LuSun } from "react-icons/lu";
import { keyframes } from "@emotion/react";

const bounceScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

export const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "#080808" : "#ffffff";
  const textColor = colorMode === "dark" ? "#E6E6E6" : "#080808";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const hoverBg = colorMode === "dark" ? "gray.700" : "gray.100";
  const iconColor = colorMode === "dark" ? "#E6E6E6" : "#1A1A1A";
  const buttonBg = colorMode === "dark" ? "transparent" : "gray.100";
  const buttonBorderColor = colorMode === "dark" ? "gray.600" : "gray.300";

  const logoStyle = {
    filter: colorMode === "dark" ? "none" : "invert(1)",
    transition: "filter 0.3s ease-in-out",
    willChange: "filter",
  };

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      bg={bgColor}
      color={textColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={100}
      transition="background-color 0.3s, color 0.3s"
    >
      <Container maxW="container.xl">
        <Flex py={4} align="center" justify="space-between">
          <Flex
            align="center"
            gap={2}
            _hover={{ opacity: 0.8 }}
            cursor="pointer"
          >
            <Image
              src="/listify.svg"
              h="32px"
              w="32px"
              alt="Listify logo"
              style={logoStyle}
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.3s"
            />
            <Heading size="md" color={textColor} transition="color 0.3s">
              Listify
            </Heading>
          </Flex>

          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            variant="ghost"
            fontSize="20px"
            color={iconColor}
            bg={buttonBg}
            border="1px solid"
            borderColor={buttonBorderColor}
            animation={`${bounceScale} 0.4s ease-in-out`}
            transition="background-color 0.3s"
            _hover={{
              bg: hoverBg,
              color: iconColor,
              borderColor: colorMode === "dark" ? "gray.500" : "gray.400",
              transform: "scale(1.05)",
            }}
            _active={{
              color: iconColor,
              bg: colorMode === "dark" ? "gray.700" : "gray.200",
              transform: "scale(0.95)",
            }}
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
          >
            {colorMode === "dark" ? <LuSun /> : <LuMoon />}
          </IconButton>
        </Flex>
      </Container>
    </Box>
  );
};
