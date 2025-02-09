import { Global } from "@emotion/react";
import { useColorMode } from "./color-mode";

export function GlobalStyles() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "#111111" : "#ffffff";

  return (
    <Global
      styles={{
        "html, body": {
          margin: 0,
          padding: 0,
          backgroundColor: bgColor,
          transition: "background-color 0.3s",
        },
      }}
    />
  );
}
