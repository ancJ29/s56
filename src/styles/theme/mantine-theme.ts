import { CSSVariablesResolver, createTheme } from "@mantine/core";

// https://mantine.dev/styles/css-variables/#css-variables-resolver
export const resolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: {},
});

export const theme = createTheme({
  // TODO: Add your theme settings here
});
