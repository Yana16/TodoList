import { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch, RootState } from "../../redux/store";
import { updateCard } from "../../redux/cards/actionCreators";

import { CardPreviewProps } from "../../redux/types";
import Button from "../ui/Button";

import "./CardPreview.css";

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  onDelete,
  boardId,
  columnKey,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const currentCard = useSelector((state: RootState) =>
    state.cards.cardsByBoardId[boardId]?.[columnKey]?.find(
      (c) => c.id === card.id
    )
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (currentCard) {
      setEditTitle(currentCard.title);
      setEditDescription(currentCard.description || "");
    }
  }, [currentCard]);

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    const trimmedDescription = editDescription.trim();

    if (!trimmedTitle || !trimmedDescription) {
      alert("Please fill in all fields");
      return;
    }

    dispatch(
      updateCard({
        boardId,
        columnKey,
        id: card.id,
        newTitle: trimmedTitle,
        newDescription: trimmedDescription,
      })
    );

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentCard) {
      setEditTitle(currentCard.title);
      setEditDescription(currentCard.description || "");
    }
  };

  return (
    <div className="card">
      {isEditing ? (
        <>
          <textarea
            className="card-title"
            value={editTitle}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setEditTitle(e.target.value)
            }
            placeholder="Edit title"
          />
          <textarea
            className="card-description"
            value={editDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setEditDescription(e.target.value)
            }
            placeholder="Edit description"
          />
          <div className="card-button-group">
            <Button onClick={handleSave}>Save</Button>
            <Button className="card-button-cancel" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3>{currentCard?.title || "No title"}</h3>
          <p>{currentCard?.description || "No description"}</p>
          <div className="card-button-group">
            <Button
              className="card-button-edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button className="btn-delete" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPreview;
