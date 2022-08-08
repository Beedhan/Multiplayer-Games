import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../utils/theme";
import GameProvider from "../context/GameContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <Component {...pageProps} />
      </GameProvider>
    </ChakraProvider>
  );
}

export default MyApp;
