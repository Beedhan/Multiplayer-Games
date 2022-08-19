import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { playerState } from "../components/Typing/TyperRaceFunctions";

interface state {
  time: number;
  running: boolean;
  correctWords: string[];
  correctLetterCount: number;
  gameTime: number;
  words: string[];
  phrase: string;
  isReady: boolean;
  allReady: boolean;
  raceProgress: { [x: string]: number }[];
}

const initialState: state = {
  time: 0,
  running: false,
  correctWords: [],
  correctLetterCount: 0,
  gameTime: 0,
  phrase: "",
  words: [],
  isReady: false,
  allReady: false,
  raceProgress: [{}],
};

const slice = createSlice({
  initialState,
  name: "TypingRace",
  reducers: {
    updateTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    },
    setready: (state) => {
      state.isReady = true;
    },
    setAllReady: (state) => {
      state.allReady = true;
    },
    startrace: (state, action: PayloadAction<playerState[]>) => {
      console.log("race start");
      const raceProgressDefault = action.payload.map((e) => {
        return { [Object.keys(e)[0]]: 0 };
      });
      state.raceProgress = [...raceProgressDefault];
      state.running = true;
    },
    endrace: (state) => {
      state.running = false;
    },
    setGameTime: (state, action: PayloadAction<number>) => {
      state.gameTime = action.payload;
    },
    setWord: (state, action: PayloadAction<string>) => {
      state.phrase = action.payload;
      state.words = action.payload.split(" ");
    },
    updateProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      if (state.running) {
        const playerIndex = state.raceProgress.findIndex(
          (e) => Object.keys(e)[0] === action.payload.id
        );
        console.log(playerIndex);
        state.raceProgress[playerIndex][action.payload.id] =
          action.payload.progress;
      }
    },
    addCorrectWord: (
      state,
      action: PayloadAction<{ word: string; index: number }>
    ) => {
      const temp = state.correctWords;
      temp[action.payload.index] = action.payload.word;
      const correctWordArr = temp.filter((e) => e !== null);
      const correctLetters = correctWordArr
        .map((e) => e.length)
        .reduce((acc, total) => acc + total);
      state.correctLetterCount = correctLetters + correctWordArr.length;
      state.correctWords = temp;
    },
  },
});

export const {
  updateTime,
  startrace,
  addCorrectWord,
  endrace,
  setGameTime,
  setWord,
  setready,
  setAllReady,
  updateProgress,
} = slice.actions;
export default slice.reducer;
