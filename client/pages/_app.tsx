import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../utils/theme";
import GameProvider from "../context/GameContext";
import { Provider } from "react-redux";
import { store } from "../app/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <GameProvider>
          <Component {...pageProps} />
        </GameProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
