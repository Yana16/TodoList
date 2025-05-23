  import { createSlice, PayloadAction } from "@reduxjs/toolkit";
  import { Board, BoardState } from "../types";

  const initialState: BoardState = {
    boards: [],
    searchBoard: null,
    loading: false,
    error: null,
  };

  const boardSlice = createSlice({
    name: "boards",
    initialState,
    reducers: {
      fetchBoardsRequest(state) {
        state.loading = true;
        state.error = null;
      },
      fetchBoardsSuccess(state, action: PayloadAction<Board[]>) {
        state.boards = action.payload;
        state.loading = false;
        state.error = null;
      },
      fetchBoardsFailure(state, action: PayloadAction<string | null>) {
        state.loading = false;
        state.error = action.payload;
      },
      addBoard(state, action: PayloadAction<Board>) {
        const exists = state.boards.some(board => board.id === action.payload.id);
        if (exists) return state;
        return {
          ...state,
          boards: [action.payload, ...state.boards],
        };
      },
      searchBoard(state, action: PayloadAction<Board | null>) {
        state.searchBoard = action.payload;
      },
      deleteBoard(state, action: PayloadAction<string>) {
        const boardId = action.payload;
        state.boards = state.boards.filter(board => board.id !== boardId);
        if (state.searchBoard?.id === boardId) {
          state.searchBoard = null;
        }
      },
      updateBoard(state, action: PayloadAction<{ id: string; boardName: string }>) {
        const { id, boardName } = action.payload;
        state.boards = state.boards.map(board =>
          board.id === id ? { ...board, boardName } : board
        );
        if (state.searchBoard?.id === id) {
          state.searchBoard = { ...state.searchBoard, boardName };
        }
      },
    },
  });


  export const boardsActions = boardSlice.actions;


  export default boardSlice.reducer;
