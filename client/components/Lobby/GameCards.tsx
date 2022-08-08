import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { socket } from "../../utils/socket";

interface IButton {
  name: string;
  roomCode: string;
  isAdmin: boolean;
}
const GameCards = ({ name, roomCode, isAdmin }: IButton) => {
  const handleGameChange = () => {
    socket.emit(
      "ChangeMode",
      {
        name,
        roomCode,
      },
      (message: any) => {
        console.log(message);
      }
    );
  };
  return (
    <Box bg={"#7692FF"} boxShadow={"2xl"} rounded={"md"} p={3}>
      <VStack>
        <Heading fontSize={"3xl"}>{name}</Heading>
        <Button
          colorScheme={"whatsapp"}
          w={"full"}
          rounded={"xl"}
          boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
          onClick={handleGameChange}
          disabled={!isAdmin}
        >
          Select
        </Button>
      </VStack>
    </Box>
  );
};

export default GameCards;
