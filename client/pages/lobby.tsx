/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import GameContainer from "../components/Lobby/GameContainer";
import UserListSection from "../components/Lobby/UserListSection";
import { isNewAdmin, setUsers, updateUsers } from "../slices/Game.slices";
import { socket } from "../utils/socket";

const Lobby: NextPage = () => {
  const toast = useToast();
  const { roomCode } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getUsers();
    newJoined();
    userDisconnected();
    roomState();
    newAdmin();
  }, []);

  const getUsers = () => {
    socket.emit("getUsers", (message: any) => {
      console.log(message);
      dispatch(setUsers(message));
    });
  };

  const newJoined = () => {
    socket.off("newJoined").on("newJoined", (message: any) => {
      dispatch(updateUsers(message.userName));
      toast({
        description: `${message.userName} joined`,
      });
    });
  };
  const userDisconnected = () => {
    socket.on("disconnection", (message: any) => {
      getUsers();
    });
  };
  const roomState = () => {
    socket.on("gamestate", (message: any) => {
      console.log(message);
    });
  };
  const newAdmin = () => {
    socket.on("newadmin", (message: any) => {
      console.log(message);
      dispatch(isNewAdmin(true));
      toast({
        description: "You are new admin",
      });
    });
  };
  const getRoomState = () => {
    socket.emit("GameState", (message: any) => {
      console.log(message);
    });
  };
  return (
    <Center height="100vh" bg="#262626">
      <Head>
        <title>Lobby</title>
      </Head>
      <Container maxW="85vw" maxH="90vh" color="white">
        <VStack height={"90vh"}>
          <Heading fontSize="2xl">Multiplayer Games</Heading>
          <Text fontSize="2xl">Room: {roomCode}</Text>
          <Button onClick={getRoomState} colorScheme="blue">
            State
          </Button>
          <Flex w={"100%"} h="100%">
            <UserListSection />
            <GameContainer />
          </Flex>
        </VStack>
      </Container>
    </Center>
  );
};

export default Lobby;
