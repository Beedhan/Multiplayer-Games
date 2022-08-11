import { configureStore } from "@reduxjs/toolkit";
import TypeReducer from "../slices/Typing.slices";
import GameReducer from "../slices/Game.slices";

export const store = configureStore({
  reducer: {
    game: GameReducer,
    typerace: TypeReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
