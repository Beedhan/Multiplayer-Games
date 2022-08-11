import { Box, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { socket } from "../../utils/socket";
import GameCards from "./GameCards";

const GameContainer = () => {
  const { roomCode, isAdmin } = useAppSelector((state) => state.game);
  const router = useRouter();
  useEffect(() => {
    socket.on("gamemode", (message: any) => {
      console.log(message.mode.toLowerCase(), "lower");
      router.push(`/${message.mode.toLowerCase()}`);
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
        <GameCards name="Type Race" roomCode={roomCode} isAdmin={isAdmin} />
        <GameCards name="Quiz" roomCode={roomCode} isAdmin={isAdmin} />
      </SimpleGrid>
    </Box>
  );
};

export default GameContainer;
