import { CSSVariablesResolver, createTheme } from "@mantine/core";

// https://mantine.dev/styles/css-variables/#css-variables-resolver
export const resolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: {},
});

export const theme = createTheme({
  // TODO: Add your theme settings here
  // https://mantine.dev/colors-generator/?color=2a427d
  primaryColor: "primary",
  colors: {
    primary: [
      "#f0f3fa",
      "#dde2ee",
      "#b9c3de",
      "#90a2cf",
      "#6f85c2",
      "#5a73bb",
      "#4f6ab9",
      "#405aa3",
      "#385092",
      "#2c4582"
    ],
  }
});
