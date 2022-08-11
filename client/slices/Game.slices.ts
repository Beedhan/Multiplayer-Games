import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

interface state {
  users: string[];
  isAdmin: boolean;
  roomCode: string;
}

const initialState: state = {
  users: [],
  isAdmin: false,
  roomCode: "",
};

const slice = createSlice({
  initialState,
  name: "Game",
  reducers: {
    setUsers: (state, action: PayloadAction<[]>) => {
      const date = new Date();
      console.log("setting", date.toUTCString());
      state.users = [...action.payload];
    },
    updateUsers: (state, action: PayloadAction<string>) => {
      const date = new Date();
      console.log("update", date.toUTCString());
      const temp = [...state.users, action.payload];
      state.users = temp;
    },
    isNewAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setRoomCode: (state, action: PayloadAction<string>) => {
      state.roomCode = action.payload;
    },
  },
});

export const { setUsers, isNewAdmin, setRoomCode, updateUsers } = slice.actions;
export default slice.reducer;
