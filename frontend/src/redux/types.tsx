

export interface Board {
  id: string;
  boardName: string;
  [key: string]: any;
}

export interface BoardState {
  boards: Board[];
  searchBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export type AddCardFormProps = {
  boardId?: string;
}

export type ColumnKey = "todoCards" | "inProgressCards" | "doneCards";

export interface Card {
  id: string;
  title: string;
  description: string;
  column: ColumnKey;
}

export interface Columns {
  todoCards: Card[];
  inProgressCards: Card[];
  doneCards: Card[];
}

export interface CardsState {
  cardsByBoardId: {
    [boardId: string]: Columns;
  };
  loading: boolean;
  error: string | Error | null;
}

export interface CardsByBoardId {
  [boardId: string]: Columns;
}

export interface CardProps {
  boardId: string;
}

export interface CardPreviewProps {
  card: Card;
  onDelete: () => void;
  boardId: string;
  columnKey: ColumnKey;
}

export interface UpdateBoardPayload {
  id: string;
  boardName: string;
}

export interface DeleteBoardPayload {
  id: string;
}

export interface SearchBoardPayload {
  board: Board | null;
}


export interface AddCardPayload {
  column: ColumnKey;
  card: Card;
  boardId: string;
}

export interface AddCardsPayload {
  boardId: string;
  cards: Columns; 
}

export interface DeleteCardPayload {
  boardId: string;
  columnKey: ColumnKey;
  cardId: string;
}

export interface UpdateCardPayload {
  boardId: string;
  columnKey: ColumnKey;
  cardId: string;
  updatedCard: Card;
}

export interface MoveCardPayload {
  boardId: string;
  sourceColumn: ColumnKey;
  destColumn: ColumnKey;
  sourceIndex: number;
  destIndex: number;
}

export interface MoveCardLocallyPayload {
  boardId: string;
  sourceColumn: ColumnKey;
  destColumn: ColumnKey;
  sourceIndex: number;
  destIndex: number;
  cardId: string;
}

export interface FetchCardsSuccessPayload {
  boardId: string;
  cards: Columns;
}
