import { Avatar, Center, HStack } from "@chakra-ui/react";
import React from "react";

const Test = () => {
  return (
    <Center height="100vh" p={10}>
      <HStack
        width="100vw"
        rounded={"xl"}
        height={2}
        bg={"green.500"}
        position="relative"
      >
        <Avatar name="B" position={"absolute"} left={1} size="sm" />
      </HStack>
    </Center>
  );
};

export default Test;
