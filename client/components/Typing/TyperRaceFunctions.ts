import { AppDispatch } from "./../../app/store";
import { socket } from "../../utils/socket";
import {
  endrace,
  setGameTime,
  setready,
  setWord,
  startrace,
} from "../../slices/Typing.slices";

export interface GameConfig {
  players: any[];
  currentGame: string;
  admin: string;
  currentGameConfig: CurrentGameConfig;
}
interface playerState {
  [key: string]: boolean;
}
export interface CurrentGameConfig {
  time: number;
  running: boolean;
  words: string;
  playersState?: playerState[];
}

export const ReadyToPlay = (dispatch: AppDispatch): void => {
  socket.emit("typerace_ready", (msg: GameConfig) => {
    console.log(msg);
    dispatch(setready());
    return msg;
  });
};
export const ListenToRaceEnd = (dispatch: AppDispatch): void => {
  socket.on("typerace_end", (msg: GameConfig) => {
    dispatch(endrace());
    return msg;
  });
};
export const GetReadyState = (setPlayersState: any): void => {
  socket.emit("typerace_readyState", (msg: GameConfig) => {
    setPlayersState(msg);
    return msg;
  });
};
export const ListenToReadyState = (setPlayersState: any): void => {
  socket.on("typerace_readyState", ({ msg }: playerState) => {
    console.log(msg, "ready state listen");
    setPlayersState(msg);
    return msg;
  });
};
export const ListenToConfig = (dispatch: AppDispatch): void => {
  socket.on("typerace_config", ({ msg }: { msg: GameConfig }) => {
    dispatch(setGameTime(msg.currentGameConfig.time));
    dispatch(setWord(msg.currentGameConfig.words));
    dispatch(startrace());
    return msg;
  });
};
