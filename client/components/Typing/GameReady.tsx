import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { startrace } from "../../slices/Typing.slices";
import {
  GetPlayersState,
  ListenToReadyState,
  playerState,
  ReadyToPlay,
} from "./TyperRaceFunctions";

const GameReady = () => {
  const dispatch = useAppDispatch();
  const { isReady, allReady } = useAppSelector((state) => state.typerace);
  const [playersState, setPlayersState] = useState<playerState[]>([]);
  const [playersStats, setPlayersStats] = useState<playerState[]>([]);

  useEffect(() => {
    GetPlayersState(setPlayersState);
    ListenToReadyState(setPlayersState);
    // ListenToEndStatsReady(setPlayersState);
  }, []);
  console.log(playersState, "steee");
  const handleReadyToPlay = () => {
    ReadyToPlay(dispatch);
  };
  const EndGameStats = () => {
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
            {playersState?.map((player) => (
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
  const PlayerLists = () => {
    if (playersState.length > 0) {
      return (
        <HStack>
          {playersState.map((player) => (
            <>
              {Object.values(player).map((user, index) => (
                <>
                  <Avatar name={user.name}>
                    <AvatarBadge
                      boxSize="1.25em"
                      bg={user.state ? "green.500" : "red.500"}
                    />
                  </Avatar>
                </>
              ))}
            </>
          ))}
        </HStack>
      );
    } else {
      return null;
    }
  };
  return (
    <Modal isOpen={!allReady} onClose={() => false} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="5px" />
      <ModalContent background={"#262625"} color="white">
        <ModalHeader>Ready</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PlayerLists />
          <EndGameStats />
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={handleReadyToPlay}
            size="sm"
            colorScheme="green"
            mb={5}
            disabled={isReady}
          >
            Ready?
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(GameReady);
