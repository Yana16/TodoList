
  export interface Board {
    id: string;
    boardName: string;
    cards: Card[];
}

  
  export interface Card {
    id: string;
    title: string;
    description?: string;
    column?: string;
  }