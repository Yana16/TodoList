import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { Card, ColumnKey, MoveCardLocallyPayload } from "../types";
import { cardsActions } from "../cards/cardsSlice";

const BASE_URL = "http://localhost:4000";
const JSON_HEADERS = { "Content-Type": "application/json" };

const checkResponse = async (response: Response): Promise<void> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Server error");
  }
};

export type ThunkResult<R = void> = ThunkAction<R, RootState, unknown, any>;


export const addCardAsync = (
  boardId: string,
  cardData: { title: string; description: string; column: ColumnKey }
): ThunkResult<Promise<void>> => async (dispatch: Dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/boards/${boardId}/cards`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(cardData),
    });

    await checkResponse(response);

 
    const newCard: Card = await response.json();


    dispatch(cardsActions.addCard({
      boardId,
      column: newCard.column,
      card: newCard,
    }));
  } catch (error: any) {
    console.error("Error adding card:", error.message);
  
  }
};

export const addCards = (
  boardId: string,
  cards: Record<ColumnKey, Card[]>
) => cardsActions.addCards({ boardId, cards });


export const moveCardLocally = (
  payload: MoveCardLocallyPayload
) => cardsActions.moveCardLocally(payload);


export const deleteCard = (
  boardId: string,
  columnKey: ColumnKey,
  cardId: string
): ThunkResult<Promise<void>> => async (dispatch: Dispatch) => {
  try {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/cards/${cardId}`,
      { method: "DELETE" }
    );

    await checkResponse(response);

    dispatch(cardsActions.deleteCard({ boardId, columnKey, cardId }));
  } catch (error: any) {
    console.error("Failed to delete card:", error.message);
  }
};


export const updateCard = (params: {
  boardId: string;
  id: string;
  newTitle: string;
  newDescription: string;
  columnKey: ColumnKey;
}): ThunkResult<Promise<void>> => async (dispatch: Dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/boards/${params.boardId}/cards/${params.id}`, {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        title: params.newTitle,
        description: params.newDescription,
      }),
    });

    await checkResponse(response);
    const result = await response.json();

    const updatedCard: Card = {
      ...result.card,
      id: result.card.id || result.card._id,
    };

    dispatch(
      cardsActions.updateCard({
        boardId: params.boardId,
        columnKey: params.columnKey,
        cardId: updatedCard.id,
        updatedCard,
      })
    );
  } catch (error: any) {
    console.error("Failed to update card:", error.message);
  }
};


export const moveCard = (
  boardId: string,
  sourceColumn: ColumnKey,
  destColumn: ColumnKey,
  sourceIndex: number,
  destIndex: number
): ThunkResult<Promise<void>> => async (dispatch, getState) => {
  try {
    const boardCards = getState().cards.cardsByBoardId[boardId];
    if (!boardCards) throw new Error("Board not found");

    const sourceCards = boardCards[sourceColumn];
    const card = sourceCards?.[sourceIndex];
    if (!card) throw new Error("Card not found at source index");

    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/cards/${card.id}/move`,
      {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify({ destColumn }),
      }
    );

    await checkResponse(response);

    dispatch(
      cardsActions.moveCard({
        boardId,
        sourceColumn,
        destColumn,
        sourceIndex,
        destIndex,
      })
    );
  } catch (error: any) {
    console.error("Failed to move card:", error.message);
  }
};
