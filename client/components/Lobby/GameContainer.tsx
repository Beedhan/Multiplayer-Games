import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { socket } from "../../utils/socket";
import GameCards from "./GameCards";

const GameContainer = () => {
  const { roomCode, isAdmin } = useGame();
  useEffect(() => {
    socket.on("ChangeMode", (message: any) => {
      console.log(message);
    });
  }, []);
  return (
    <Box
      bg="#ADF1D2"
      w={"75%"}
      borderTopRightRadius={10}
      borderBottomRightRadius={10}
      p={5}
    >
      <SimpleGrid columns={2} spacing={5}>
        <GameCards name="Typing Race" roomCode={roomCode} isAdmin={isAdmin} />
        <GameCards name="Quiz" roomCode={roomCode} isAdmin={isAdmin} />
      </SimpleGrid>
    </Box>
  );
};

export default GameContainer;
