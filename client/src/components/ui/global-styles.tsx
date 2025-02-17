import { Global } from "@emotion/react";

export function GlobalStyles() {
  return (
    <Global
      styles={{
        "html, body": {
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          transition: "background-color 0.3s",
        },
      }}
    />
  );
}
