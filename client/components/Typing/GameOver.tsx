import {
  VStack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  GetPlayersState,
  playerState,
  ReadyToPlay,
} from "./TyperRaceFunctions";

const GameOver = () => {
  const dispatch = useAppDispatch();
  const [playersStats, setPlayersStats] = useState<playerState[]>([]);
  const { isReady, allReady } = useAppSelector((state) => state.typerace);

  console.log(playersStats, "over");

  const handleReadyToPlay = () => {
    ReadyToPlay(dispatch);
  };
  const PlayerLists = () => {
    return (
      <TableContainer w={"100%"}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color={"white"} textAlign={"start"}>
                Name
              </Th>
              <Th color={"white"} textAlign={"center"}>
                WPM
              </Th>
              <Th color={"white"} textAlign={"end"}>
                Accuracy
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {playersStats?.map((player) => (
              <>
                {Object.values(player).map((val, index) => (
                  <Tr key={index}>
                    <Td>{val.name}</Td>
                    <Td textAlign={"center"}>{val?.typeGameStats?.wpm}</Td>
                    <Td textAlign={"end"}>{val?.typeGameStats?.accuracy}%</Td>
                  </Tr>
                ))}
              </>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };
  return (
    <Modal isOpen={false} onClose={() => false} isCentered size={"lg"}>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="5px" />
      <ModalContent background={"#262625"} color="white">
        <ModalHeader>Game Over</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PlayerLists />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleReadyToPlay}
            size="sm"
            colorScheme="green"
            mb={5}
            disabled={isReady}
          >
            Play Again
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameOver;
