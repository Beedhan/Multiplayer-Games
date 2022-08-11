import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Raleway', sans-serif`,
    body: `'Poppins', sans-serif`,
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
