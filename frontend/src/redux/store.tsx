import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boards/boardsSlice";
import cardReducer from "./cards/cardsSlice";

const store = configureStore({
  reducer: {
    boards: boardReducer,
    cards: cardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
