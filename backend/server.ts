import BoardModel from './Models/Board';
import { Request, Response } from 'express';

const express = require("express");
const cors = require("cors");
require("./db/connection");


import {Card} from './types'

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post("/boards", async (req: Request, res: Response) => {
  try {
    const board = new BoardModel(req.body);
    const savedBoard = await board.save();
    res.status(201).json(savedBoard);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate key error",
        details: "A card with this ID already exists or an invalid card ID was provided.",
      });
    }
    res.status(500).json({ error: "Error creating board", details: error.message });
  }
});

app.get("/boards/:boardId", async (req:Request, res:Response) => {
  try {
    const board = await BoardModel.findOne({ id: req.params.boardId });
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json(board);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error fetching board", details: error.message });
  }
});

app.get("/boards", async (req:Request, res:Response) => {
  try {
    const boards = await BoardModel.find();
    res.status(200).json(boards);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error fetching all boards", details: error.message });
  }
});

app.post("/boards/:boardId/cards", async (req:Request, res:Response) => {
  try {
    const board = await BoardModel.findOne({ id: req.params.boardId });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const newCard = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      column: req.body.column,
    };

    board.cards.push(newCard);
    await board.save();
    res.status(201).json(newCard);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error adding card", details: error.message });
  }
});

app.put("/boards/:boardId/cards/:cardId", async (req:Request, res:Response) => {
  try {
    const { boardId, cardId } = req.params;
    const { title, description, column } = req.body;

    const board = await BoardModel.findOne({ id: boardId });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const card = board.cards.find((c:Card) => c.id === cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;
    if (column !== undefined) card.column = column;

    await board.save();
    res.status(200).json({ message: "Card updated", card });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error updating card", details: error.message });
  }
});

app.delete("/boards/:boardId/cards/:cardId", async (req:Request, res:Response) => {
  try {
    const { boardId, cardId } = req.params;

    const board = await BoardModel.findOne({ id: boardId });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const originalLength = board.cards.length;
    board.cards = board.cards.filter((card:Card) => card.id !== cardId);

    if (board.cards.length === originalLength) {
      return res.status(404).json({ error: "Card not found" });
    }

    await board.save();
    res.status(200).json({ message: "Card deleted", cardId });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error deleting card", details: error.message });
  }
});

app.put("/boards/:boardId/cards/:cardId/move", async (req:Request, res:Response) => {
  try {
    const { boardId, cardId } = req.params;
    const { destColumn } = req.body;

    const board = await BoardModel.findOne({ id: boardId });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const card = board.cards.find((c:Card) => c.id === cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    card.column = destColumn;
    await board.save();
    res.status(200).json({ message: "Card moved", card });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error moving card", details: error.message });
  }
});

app.put("/boards/:id", async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const { boardName } = req.body;

    const updatedBoard = await BoardModel.findOneAndUpdate(
      { id },
      { boardName },
      { new: true }
    );

    if (!updatedBoard)
      return res.status(404).json({ error: "Board not found" });

    res.status(200).json(updatedBoard);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error updating board", details: error.message });
  }
});

app.delete("/boards/:id", async (req:Request, res:Response) => {
  try {
    const { id } = req.params;

    const deleted = await BoardModel.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ error: "Board not found" });

    res.status(200).json({ message: "Board deleted", id });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error deleting board", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
