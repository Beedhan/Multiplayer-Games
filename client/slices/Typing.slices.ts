import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface state {
  time: number;
  running: boolean;
  correctWords: string[];
  correctLetterCount: number;
  gameTime: number;
  words: string[];
  phrase: string;
  isReady: boolean;
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
    startrace: (state) => {
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
} = slice.actions;
export default slice.reducer;
