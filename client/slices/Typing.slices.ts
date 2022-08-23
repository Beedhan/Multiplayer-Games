import { StatsType } from "./../utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { playerState } from "../components/Typing/TyperRaceFunctions";

interface state {
  time: number;
  running: boolean;
  correctWords: string[];
  wordHistory: string[];
  correctLetterCount: number;
  gameTime: number;
  words: string[];
  phrase: string;
  isReady: boolean;
  mistakes: number;
  allReady: boolean;
  raceProgress: { [x: string]: { progress: number; name: string } }[];
  stats: StatsType;
  currentWordIdx: number;
  typed: string;
}

const initialState: state = {
  time: 0,
  mistakes: 0,
  running: false,
  correctWords: [],
  correctLetterCount: 0,
  currentWordIdx: 0,
  gameTime: 0,
  phrase: "",
  words: [],
  isReady: false,
  allReady: false,
  raceProgress: [{}],
  stats: { wpm: 0, accuracy: 0 },
  wordHistory: [],
  typed: "",
};

const slice = createSlice({
  initialState,
  name: "TypingRace",
  reducers: {
    updateTime: (state) => {
      state.time = state.time + 1;
    },
    setready: (state) => {
      state.isReady = true;
    },
    setTyped: (state, action: PayloadAction<string>) => {
      state.typed = action.payload;
    },
    setAllReady: (state) => {
      state.allReady = true;
    },
    startrace: (state, action: PayloadAction<playerState[]>) => {
      console.log("race start");
      const raceProgressDefault = action.payload.map((e) => {
        return {
          [Object.keys(e)[0]]: { progress: 0, name: Object.values(e)[0].name },
        };
      });
      state.raceProgress = [...raceProgressDefault];
      state.running = true;
    },
    setGameTime: (state, action: PayloadAction<number>) => {
      state.gameTime = action.payload;
    },
    setCurrentWordIdx: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true) {
        state.currentWordIdx = state.currentWordIdx + 1;
      } else {
        state.currentWordIdx = state.currentWordIdx - 1;
      }
    },
    setMistakes: (state) => {
      state.mistakes = state.mistakes + 1;
    },
    setWord: (state, action: PayloadAction<string>) => {
      state.phrase = action.payload;
      state.words = action.payload.split(" ");
    },
    setWordHistory: (state, action: PayloadAction<string>) => {
      const temp = state.wordHistory;
      temp[state.currentWordIdx] = action.payload;
      state.wordHistory = temp;
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
        state.raceProgress[playerIndex][action.payload.id] = {
          ...state.raceProgress[playerIndex][action.payload.id],
          progress: action.payload.progress,
        };
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
    endrace: (state) => {
      const wpm = Math.round(
        (state.correctLetterCount * (60 / state.gameTime)) / 5
      );
      const accuracy = Math.round(
        ((state.correctLetterCount - state.mistakes) /
          state.correctLetterCount) *
          100
      );
      // state.gameTime = 0;
      // state.raceProgress = [{}];
      state.phrase = "";
      state.typed = "";
      state.correctLetterCount = 0;
      state.currentWordIdx = 0;
      state.words = [];
      state.wordHistory = [];
      state.mistakes = 0;
      state.correctWords = [];
      state.time = 0;
      state.running = false;
      state.isReady = false;
      state.allReady = false;
      console.log(wpm, accuracy);
      state.stats = { wpm, accuracy: Math.min(Math.max(accuracy, 0), 100) };
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
  setMistakes,
  setCurrentWordIdx,
  setWordHistory,
  setTyped,
} = slice.actions;
export default slice.reducer;
