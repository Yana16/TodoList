import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCardAsync } from "../../redux/cards/actionCreators";
import { RootState, AppDispatch } from "../../redux/store";

import Button from "../ui/Button";
import { AddCardFormProps, ColumnKey } from "../../redux/types";

import "./AddCardForm.css";

const COLUMN_OPTIONS: { value: ColumnKey; label: string }[] = [
  { value: "todoCards", label: "To Do" },
  { value: "inProgressCards", label: "In Progress" },
  { value: "doneCards", label: "Done" },
];

const AddCardForm = ({ boardId }: AddCardFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>("todoCards");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.boards.boards);

  const boardIdToUse = boardId || selectedBoard;

  const handleAdd = async () => {
    if (!boardIdToUse) {
      alert("Please, select a board");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        addCardAsync(boardIdToUse, {
          title,
          description,
          column: selectedColumn,
        })
      );

      setTitle("");
      setDescription("");
      setSelectedColumn("todoCards");
    } catch (error) {
      console.error("Failed to add card:", error);
      alert("Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-card-form general-form">
      <label>
        <input
          className="general-input add-card-input"
          type="text"
          value={title}
          placeholder="Card Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        <input
          className="general-input add-card-input"
          type="text"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        <select
          className="general-input add-card-select"
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value as ColumnKey)}
        >
          {COLUMN_OPTIONS.map((option) => (
            <option className="add-card-option"  key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {!boardId && (
        <label>
          <select
            className="general-input add-card-select"
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            <option value="">Select Board</option>
            {boards.map((board) => (
              <option className="add-card-option"  key={board.id} value={board.id}>
                {board.boardName}
              </option>
            ))}
          </select>
        </label>
      )}

      <Button
        onClick={handleAdd}
        disabled={!title || !description || (!selectedBoard && !boardId) || loading}
      >
        {loading ? "Adding..." : "Add Card"}
      </Button>
    </div>
  );
};

export default AddCardForm;
