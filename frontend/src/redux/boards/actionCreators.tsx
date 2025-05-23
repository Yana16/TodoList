import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card, Board, Columns } from "../types";
import { boardsActions } from "../boards/boardsSlice";
import { cardsActions } from "../cards/cardsSlice";

const BASE_URL = "http://localhost:4000";
const JSON_HEADERS = { "Content-Type": "application/json" };

const groupCardsByColumn = (cards: Card[]): Columns =>
  cards.reduce<Columns>(
    (acc, card) => {
      if (!acc[card.column]) acc[card.column] = [];
      acc[card.column].push(card);
      return acc;
    },
    {
      todoCards: [],
      inProgressCards: [],
      doneCards: [],
    }
  );

const { addBoard, searchBoard, deleteBoard, updateBoard, fetchBoardsRequest, fetchBoardsSuccess, fetchBoardsFailure } = boardsActions;
const { addCards } = cardsActions;


export const addBoardThunk = createAsyncThunk<
  Board,
  Board, 
  { rejectValue: string }
>(
  "boards/addBoard",
  async (board, { rejectWithValue, dispatch }) => {
    try {
      const { cards, ...boardData } = board;

      const cardsWithIds = cards?.map((card: Card) => ({
        ...card,
        id: card.id || Date.now().toString(),
      })) ?? [];

      const boardToSend = {
        ...boardData,
        cards: cardsWithIds,
      };

      const response = await fetch(`${BASE_URL}/boards`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(boardToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText || "Server error");
      }

      const createdBoard: Board = await response.json();

      dispatch(addBoard(createdBoard));

      const cardsByColumn = groupCardsByColumn(createdBoard.cards ?? []);
      dispatch(addCards({ boardId: createdBoard.id, cards: cardsByColumn }));

      return createdBoard;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);


export const fetchBoardsWithCards = createAsyncThunk<
  Board[],
  void,
  { rejectValue: string }
>(
  "boards/fetchBoardsWithCards",
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(fetchBoardsRequest());

    try {
      const response = await fetch(`${BASE_URL}/boards`);

      if (!response.ok) {
        const errorText = await response.text();
        dispatch(fetchBoardsFailure(errorText || "Server error"));
        return rejectWithValue(errorText || "Server error");
      }

      const boards: Board[] = await response.json();

      boards.forEach(board => {
        const cardsByColumn = groupCardsByColumn(board.cards);
        dispatch(addCards({ boardId: board.id, cards: cardsByColumn }));
      });

      dispatch(fetchBoardsSuccess(boards));
      return boards;
    } catch (error: any) {
      const message = error.message || "Network error";
      dispatch(fetchBoardsFailure(message));
      return rejectWithValue(message);
    }
  }
);


export const searchBoardId = createAsyncThunk<
  Board | null,
  string,
  { rejectValue: string }
>(
  "boards/searchBoardId",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BASE_URL}/boards/${id}`);

      if (!response.ok) {
        dispatch(searchBoard(null));
        return null;
      }

      const board: Board = await response.json();
      const cardsByColumn = groupCardsByColumn(board.cards);

      dispatch(addBoard(board));
      dispatch(searchBoard(board));
      dispatch(addCards({ boardId: board.id, cards: cardsByColumn }));

      return board;
    } catch (error: any) {
      console.error("Failed to search board:", error.message);
      dispatch(searchBoard(null));
      return rejectWithValue(error.message || "Network error");
    }
  }
);


export const deleteBoardById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "boards/deleteBoardById",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BASE_URL}/boards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText || "Server error");
      }

      dispatch(deleteBoard(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);


export const updateBoardById = createAsyncThunk<
  Board,
  { id: string; boardName: string },
  { rejectValue: string }
>(
  "boards/updateBoardById",
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BASE_URL}/boards/${params.id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify({ boardName: params.boardName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText || "Server error");
      }

      const updatedBoard: Board = await response.json();
      dispatch(updateBoard({ id: updatedBoard.id, boardName: updatedBoard.boardName }));

      return updatedBoard;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
