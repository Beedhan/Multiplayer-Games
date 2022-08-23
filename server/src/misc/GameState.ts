interface playerState {
  [key: string]: {
    name: string;
    state: boolean;
    typeGameStats?: TypeGameStats;
  };
}
interface TypeGameStats {
  wpm: number;
  accuracy: number;
}
interface IGameState {
  [key: string]: {
    players: { name: string; id: string }[];
    currentGame?: string;
    admin?: string;
    currentGameConfig?: {
      playersState?: playerState[];
      time?: number;
      running: boolean;
      words?: string;
    };
  };
}
export const game_state: IGameState = {};
