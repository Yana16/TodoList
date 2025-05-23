import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CardsState,
  Columns,
  AddCardPayload,
  AddCardsPayload,
  DeleteCardPayload,
  UpdateCardPayload,
  MoveCardPayload,
  MoveCardLocallyPayload,
  FetchCardsSuccessPayload,
} from "../types";

const initialColumns: Columns = {
  todoCards: [],
  inProgressCards: [],
  doneCards: [],
};

const initialState: CardsState = {
  cardsByBoardId: {},
  loading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard(state, action: PayloadAction<AddCardPayload>) {
      const { boardId, column, card } = action.payload;
      const boardCards: Columns = state.cardsByBoardId[boardId] || { ...initialColumns };

      return {
        ...state,
        cardsByBoardId: {
          ...state.cardsByBoardId,
          [boardId]: {
            ...boardCards,
            [column]: [...boardCards[column], card],
          },
        },
      };
    },
    addCards(state, action: PayloadAction<AddCardsPayload>) {
      const { boardId, cards } = action.payload;
      state.cardsByBoardId[boardId] = {
        ...initialColumns,
        ...cards,
      };
    },
    deleteCard(state, action: PayloadAction<DeleteCardPayload>) {
      const { boardId, columnKey, cardId } = action.payload;
      const boardCards = state.cardsByBoardId[boardId] || { ...initialColumns };
      boardCards[columnKey] = boardCards[columnKey].filter(card => card.id !== cardId);
      state.cardsByBoardId[boardId] = boardCards;
    },
    updateCard(state, action: PayloadAction<UpdateCardPayload>) {
      const { boardId, columnKey, cardId, updatedCard } = action.payload;
      const boardCards = state.cardsByBoardId[boardId] || { ...initialColumns };
      boardCards[columnKey] = boardCards[columnKey].map(card =>
        card.id === cardId ? { ...card, ...updatedCard } : card
      );
      state.cardsByBoardId[boardId] = boardCards;
    },
    moveCard(state, action: PayloadAction<MoveCardPayload>) {
      const { boardId, sourceColumn, destColumn, sourceIndex, destIndex } = action.payload;
      const boardCards = state.cardsByBoardId[boardId] || { ...initialColumns };
      const sourceList = Array.from(boardCards[sourceColumn]);
      const destList = sourceColumn === destColumn ? sourceList : Array.from(boardCards[destColumn]);
      const [movedCard] = sourceList.splice(sourceIndex, 1);
      if (!movedCard) return;
      destList.splice(destIndex, 0, movedCard);
      boardCards[sourceColumn] = sourceColumn === destColumn ? destList : sourceList;
      boardCards[destColumn] = destList;
      state.cardsByBoardId[boardId] = boardCards;
    },
    moveCardLocally(state, action: PayloadAction<MoveCardLocallyPayload>) {
      const { boardId, sourceColumn, destColumn, sourceIndex, destIndex, cardId } = action.payload;
      const boardCards = state.cardsByBoardId[boardId];
      if (!boardCards) return;
      const sourceList = Array.from(boardCards[sourceColumn]);
      const destList = sourceColumn === destColumn ? sourceList : Array.from(boardCards[destColumn]);
      const [movedCard] = sourceList.splice(sourceIndex, 1);
      if (!movedCard || movedCard.id !== cardId) return;
      destList.splice(destIndex, 0, movedCard);
      boardCards[sourceColumn] = sourceColumn === destColumn ? destList : sourceList;
      boardCards[destColumn] = destList;
      state.cardsByBoardId[boardId] = boardCards;
    },
    fetchCardsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCardsSuccess(state, action: PayloadAction<FetchCardsSuccessPayload>) {
      const { boardId, cards } = action.payload;
      state.loading = false;
      state.error = null;
      state.cardsByBoardId[boardId] = {
        ...initialColumns,
        ...cards,
      };
    },
    fetchCardsFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const cardsActions = cardsSlice.actions;


export default cardsSlice.reducer;
