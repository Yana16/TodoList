import { ChangeEvent, useEffect, useState } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import {
  fetchBoardsWithCards,
  deleteBoardById,
  updateBoardById,
} from "../../redux/boards/actionCreators";
import AddCardForm from "../AddCardForm/AddCardForm";
import Card from "../Card/Card";
import Button from "../ui/Button";
import { RootState, AppDispatch } from "../../redux/store";
import { Board } from "../../redux/types";

import "./BoardList.css";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const BoardList: React.FC = () => {
  const dispatch = useAppDispatch();

  const boards = useAppSelector((state) => state.boards.boards);
  const loading = useAppSelector((state) => state.boards.loading);
  const error = useAppSelector((state) => state.boards.error);

  const [editBoardId, setEditBoardId] = useState<string | null>(null);
  const [updateBoardName, setUpdateBoardName] = useState<string>("");

  useEffect(() => {
    dispatch(fetchBoardsWithCards());
  }, [dispatch]);

  const handleEditClick = (board: Board) => {
    setEditBoardId(board.id);
    setUpdateBoardName(board.boardName);
  };

  const handleSaveBoard = () => {
    if (!editBoardId) {
      alert("No board selected to save!");
      return;
    }

    const trimmedName = updateBoardName.trim();
    if (!trimmedName) {
      alert("Board name cannot be empty");
      return;
    }

    dispatch(updateBoardById({ id: editBoardId, boardName: trimmedName }));
    setEditBoardId(null);
    setUpdateBoardName("");
  };

  const handleDeleteBoard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      dispatch(deleteBoardById(id));
    }
  };

  return (
    <div className="board-list-container title">
      <h2>Board List</h2>
      <AddCardForm />
      {loading ? (
        <p className="no-boards-message">Loading boards...</p>
      ) : error ? (
        <p className="no-boards-message">Error loading boards: {error}</p>
      ) : boards.length === 0 ? (
        <p className="no-boards-message">No Boards available</p>
      ) : (
        <ul className="board-list">
          {boards.map((board) => (
            <li key={board.id} className="general-form">
              <div className="board-header">
                {editBoardId === board.id ? (
                  <textarea
                    className="general-input board-name-input"
                    value={updateBoardName}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setUpdateBoardName(e.target.value)
                    }
                  />
                ) : (
                  <div>
                    <h3 className="board-name">{board.boardName}</h3>
                    <p className="board-id">Board ID: {board.id}</p>
                  </div>
                )}

                <div className="board-buttons">
                  {editBoardId === board.id ? (
                    <Button onClick={handleSaveBoard}>Save</Button>
                  ) : (
                    <Button
                      className="btn-edit"
                      onClick={() => handleEditClick(board)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    className="btn-delete"
                    onClick={() => handleDeleteBoard(board.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Card boardId={board.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardList;
