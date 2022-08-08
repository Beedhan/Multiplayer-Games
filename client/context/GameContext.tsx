import React, { createContext, useContext, useState } from "react";

interface IGameContext {
  roomCode: string;
  users: string[];
  setUsers: Function;
  setRoomCode: Function;
  setIsAdmin: Function;
  isAdmin: boolean;
}

export const GameContext = createContext<IGameContext>({
  users: [],
  setUsers: () => false,
  setRoomCode: () => false,
  setIsAdmin: () => false,
  roomCode: "",
  isAdmin: false,
});

const GameProvider = (props: any) => {
  const [users, setUsers] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <GameContext.Provider
      value={{ users, setUsers, setRoomCode, roomCode, setIsAdmin, isAdmin }}
    >
      {props.children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
export default GameProvider;
