interface playerState {
  [key: string]: boolean;
}
interface IGameState {
  [key: string]: {
    players: string[];
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
