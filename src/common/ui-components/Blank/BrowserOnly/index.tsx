import { Center, Container } from "@mantine/core";

export function BrowserOnly() {
  return (
    <Container
      h="80vh"
      hiddenFrom="md"
      display="flex"
      style={{
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <Center>This page is not available on mobile devices</Center>
    </Container>
  );
}
