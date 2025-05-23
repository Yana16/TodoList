import express, { Request, Response } from 'express';
import cors from 'cors';
import './db/connection';
import BoardModel from './Models/Board';

import { Card } from './types';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


app.post("/boards", async (req: Request, res: Response): Promise<void> => {
  try {
    const board = new BoardModel(req.body);
    const savedBoard = await board.save();
    res.status(201).json(savedBoard);
  } catch (error: unknown) {
    res.status(500).json({ error: "Error creating board", details: (error as Error).message });
  }
});


app.get("/boards/:boardId", async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await BoardModel.findOne({ id: req.params.boardId });
    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }
    res.json(board);
  } catch (error: unknown) {
    res.status(500).json({ error: "Error fetching board", details: (error as Error).message });
  }
});


app.get("/boards", async (req: Request, res: Response): Promise<void> => {
  try {
    const boards = await BoardModel.find();
    res.status(200).json(boards);
  } catch (error: unknown) {
    res.status(500).json({ error: "Error fetching all boards", details: (error as Error).message });
  }
});


app.post("/boards/:boardId/cards", async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await BoardModel.findOne({ id: req.params.boardId });
    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      column: req.body.column,
    };
    board.cards.push(newCard);
    await board.save();
    res.status(201).json(newCard);
  } catch (error: unknown) {
    res.status(500).json({ error: "Error adding card", details: (error as Error).message });
  }
});


app.put("/boards/:boardId/cards/:cardId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId, cardId } = req.params;
    const { title, description, column } = req.body;

    const board = await BoardModel.findOne({ id: boardId });
    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    const card = board.cards.find((c: Card) => c.id === cardId);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;
    if (column !== undefined) card.column = column;

    await board.save();
    res.status(200).json({ message: "Card updated", card });
  } catch (error: unknown) {
    res.status(500).json({ error: "Error updating card", details: (error as Error).message });
  }
});


app.delete("/boards/:boardId/cards/:cardId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId, cardId } = req.params;

    const board = await BoardModel.findOne({ id: boardId });
    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    const originalLength = board.cards.length;
    board.cards = board.cards.filter((card: Card) => card.id !== cardId);

    if (board.cards.length === originalLength) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    await board.save();
    res.status(200).json({ message: "Card deleted", cardId });
  } catch (error: unknown) {
    res.status(500).json({ error: "Error deleting card", details: (error as Error).message });
  }
});


app.put("/boards/:boardId/cards/:cardId/move", async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId, cardId } = req.params;
    const { destColumn } = req.body;

    const board = await BoardModel.findOne({ id: boardId });
    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    const card = board.cards.find((c: Card) => c.id === cardId);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    card.column = destColumn;
    await board.save();
    res.status(200).json({ message: "Card moved", card });
  } catch (error: unknown) {
    res.status(500).json({ error: "Error moving card", details: (error as Error).message });
  }
});


app.put("/boards/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { boardName } = req.body;

    const updatedBoard = await BoardModel.findOneAndUpdate({ id }, { boardName }, { new: true });
    if (!updatedBoard) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    res.status(200).json(updatedBoard);
  } catch (error: unknown) {
    res.status(500).json({ error: "Error updating board", details: (error as Error).message });
  }
});


app.delete("/boards/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await BoardModel.findOneAndDelete({ id });
    if (!deleted) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    res.status(200).json({ message: "Board deleted", id });
  } catch (error: unknown) {
    res.status(500).json({ error: "Error deleting board", details: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server запущен по адресу http://localhost:${PORT}`);
});