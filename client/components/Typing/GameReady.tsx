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
import React, { memo, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { startrace } from "../../slices/Typing.slices";
import {
  GetReadyState,
  ListenToReadyState,
  playerState,
  ReadyToPlay,
} from "./TyperRaceFunctions";

const GameReady = () => {
  const dispatch = useAppDispatch();
  const { isReady, allReady } = useAppSelector((state) => state.typerace);
  const [playersState, setPlayersState] = useState<playerState[]>([]);

  useEffect(() => {
    GetReadyState(setPlayersState);
    ListenToReadyState(setPlayersState);
  }, []);

  const handleReadyToPlay = () => {
    ReadyToPlay(dispatch);
  };
  const PlayerLists = () => {
    if (playersState.length > 0) {
      return (
        <HStack>
          {playersState.map((player) => (
            <>
              {Object.keys(player).map((name, index) => (
                <>
                  <Avatar name={player[name].name}>
                    <AvatarBadge
                      boxSize="1.25em"
                      bg={player[name].state ? "green.500" : "red.500"}
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
