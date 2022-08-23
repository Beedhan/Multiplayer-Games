import { AppDispatch, store } from "./../../app/store";
import { socket } from "../../utils/socket";
import {
  endrace,
  setAllReady,
  setGameTime,
  setready,
  setWord,
  startrace,
  updateProgress,
} from "../../slices/Typing.slices";
import { StatsType } from "../../utils/types";

export interface GameConfig {
  players: any[];
  currentGame: string;
  admin: string;
  currentGameConfig: CurrentGameConfig;
  playerState: playerState[];
}
export interface playerState {
  [key: string]: {
    name: string;
    state: boolean;
    typeGameStats?: { wpm: number; accuracy: number };
  };
}
export interface CurrentGameConfig {
  time: number;
  running: boolean;
  words: string;
  playersState: playerState[];
}

//Sending ready status
export const ReadyToPlay = (dispatch: AppDispatch): void => {
  socket.emit("typerace_ready", (msg: GameConfig) => {
    console.log(msg);
    dispatch(setready());
    return msg;
  });
};

//Listening to end of race
export const ListenToRaceEnd = (
  dispatch: AppDispatch,
  stats: StatsType
): void => {
  socket.on("typerace_end", (msg: GameConfig) => {
    const state = store.getState();
    dispatch(endrace());
    socket.emit("typerace_end", { stats: state.typerace.stats });
    return msg;
  });
};

//Fetching others ready state
export const GetPlayersState = (setPlayersState: any): void => {
  socket.emit("typerace_playersState", (msg: GameConfig) => {
    setPlayersState(msg);
    return msg;
  });
};

//listening to others ready state
// export const ListenToEndStatsReady = (setPlayersStats: any): void => {
//   socket.on("typerace_states", ({ msg }: playerState) => {
//     console.log(msg, "end stats listen");
//     setPlayersStats(msg);
//     return msg;
//   });
// };

//listening to others ready state
export const ListenToReadyState = (setPlayersState: any): void => {
  socket.on("typerace_states", ({ msg }: playerState) => {
    console.log(msg, "ready state listen");
    setPlayersState(msg);
    return msg;
  });
};

//Listening to game config
export const ListenToConfig = (dispatch: AppDispatch): void => {
  socket.on("typerace_config", ({ msg }: { msg: GameConfig }) => {
    console.log(msg, "start msg");
    dispatch(setGameTime(msg.currentGameConfig.time));
    dispatch(setWord(msg.currentGameConfig.words));
    dispatch(setAllReady());
    dispatch(startrace(msg.currentGameConfig.playersState));
    return msg;
  });
};

//Listening to opponents progress
export const ListenToPlayerProgress = (dispatch: AppDispatch): void => {
  socket.on("typerace_progress", (msg: { id: string; progress: number }) => {
    console.log(msg, "progress listen");
    dispatch(updateProgress(msg));
    return msg;
  });
};
