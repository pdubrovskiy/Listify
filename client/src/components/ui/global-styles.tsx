import { Global } from "@emotion/react";

export function GlobalStyles() {
  return (
    <Global
      styles={{
        "html, body": {
          margin: 0,
          padding: 0,
          backgroundColor: "#fafafa",
          color: "#2D3748",
          transition: "all 0.3s ease",
          minHeight: "100vh",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        "*": {
          boxSizing: "border-box",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
            "&:hover": {
              background: "#a1a1a1",
            },
          },
        },
        "h1, h2, h3, h4, h5, h6": {
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#1A202C",
        },
        "::selection": {
          backgroundColor: "rgba(66, 153, 225, 0.3)",
        },
        a: {
          color: "#3182CE",
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": {
            color: "#2B6CB0",
          },
        },
        button: {
          transition: "all 0.2s ease",
        },
        input: {
          "&::placeholder": {
            color: "#A0AEC0",
          },
        },
      }}
    />
  );
}
