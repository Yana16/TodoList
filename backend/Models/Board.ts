import { Schema, Document, model } from "mongoose";


interface Card {
  id: string;
  title: string;
  description?: string;
  column?: string;
}


export interface BoardDocument extends Document {
  id: string;
  boardName: string;
  cards: Card[];
}

const cardSchema = new Schema<Card>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    column: { type: String },
  },
  { _id: false } 
);

const boardSchema = new Schema<BoardDocument>({
  id: { type: String, required: true, unique: true },
  boardName: { type: String, required: true },
  cards: [cardSchema],
});

const BoardModel = model<BoardDocument>("Board", boardSchema);

export default BoardModel;
