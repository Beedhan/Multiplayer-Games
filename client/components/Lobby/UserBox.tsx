import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

const UserBox = ({ name }: { name: string }) => {
  const MotionBox = motion(Box);
  return (
    <MotionBox
      borderRadius={100}
      bg={"#262626"}
      p={2}
      pl={3}
      mb={2}
      boxShadow="base"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      layout
    >
      <HStack>
        <Avatar bg="#7692FF" name={name} mr={5} />
        <Text fontSize={"xl"}>{name.toUpperCase()}</Text>
      </HStack>
    </MotionBox>
  );
};

export default UserBox;
