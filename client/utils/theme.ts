import { extendTheme } from "@chakra-ui/react";
import "@fontsource/dynapuff";
const theme = extendTheme({
  fonts: {
    heading: `'DynaPuff', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: "#65e495",
        },
      },
    },
  },
});

export default theme;
