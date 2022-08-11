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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  GetReadyState,
  ListenToReadyState,
  ReadyToPlay,
} from "./TyperRaceFunctions";

const GameReady = () => {
  const dispatch = useAppDispatch();
  const { isReady } = useAppSelector((state) => state.typerace);
  const [playersState, setPlayersState] = useState<
    { [key: string]: boolean }[]
  >([]);

  useEffect(() => {
    GetReadyState(setPlayersState);
    ListenToReadyState(setPlayersState);
  }, []);

  const handleReadyToPlay = () => {
    ReadyToPlay(dispatch);
  };
  console.log(playersState);

  const PlayerLists = () => {
    if (playersState.length > 0) {
      return (
        <HStack>
          {playersState.map((player) => (
            <>
              {Object.keys(player).map((name, index) => (
                <>
                  <Avatar name={name}>
                    <AvatarBadge
                      boxSize="1.25em"
                      bg={player[name] ? "green.500" : "red.500"}
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
    <Modal isOpen={true} onClose={() => false} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="5px" />
      <ModalContent background={"#262625"} color="white">
        <ModalHeader>Ready</ModalHeader>
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
            Ready?
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameReady;
