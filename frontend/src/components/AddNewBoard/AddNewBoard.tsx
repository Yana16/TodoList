import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addBoardThunk } from "../../redux/boards/actionCreators";
import Button from "../ui/Button";
import { Board } from "../../redux/types";

import "./AddNewBoard.css";

const AddNewBoard = () => {
  const [boardName, setBoardName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = boardName.trim();
    if (!trimmedName) {
      alert("Board name cannot be empty");
      return;
    }

    const newBoard: Board = {
      boardName: trimmedName,
      id: Date.now().toString(), 
    };

    setLoading(true);
    try {
      await dispatch(addBoardThunk(newBoard)).unwrap();
      setBoardName("");
    } catch (error: any) {
      const errorMessage = error?.details || error?.message || "An error occurred";
      if (errorMessage.includes("duplicate key")) {
        alert("Board already exists. Add cards to the existing board or choose a different name.");
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-board-form general-form title">
      <h2>Add New Board</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="boardName" className="visually-hidden">
          Board name
        </label>
        <input
          id="boardName"
          type="text"
          value={boardName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setBoardName(e.target.value)}
          placeholder="What are your tasks for today?"
          className="general-input new-board-input"
          aria-label="Board name"
        />
        <div className="new-board-button-group">
          <Button type="submit" disabled={loading || !boardName.trim()}>
            {loading ? "Adding..." : "Add Board"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBoard;
