import { useSelector, useDispatch } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  deleteCard,
  moveCardLocally,
} from "../../redux/cards/actionCreators";
import { RootState, AppDispatch } from "../../redux/store";
import { CardProps, ColumnKey, Columns } from "../../redux/types";

import CardPreview from "../CardPreview/CardPeview";

import "./Card.css";

const columnsConfig: { title: string; key: keyof Columns }[] = [
  { title: "TODO", key: "todoCards" },
  { title: "IN PROGRESS", key: "inProgressCards" },
  { title: "DONE", key: "doneCards" },
];

const Card: React.FC<CardProps> = ({ boardId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const cards = useSelector((state: RootState): Columns => {
    const boardCards = state.cards.cardsByBoardId[boardId] || {};
    return {
      todoCards: boardCards.todoCards || [],
      inProgressCards: boardCards.inProgressCards || [],
      doneCards: boardCards.doneCards || [],
    };
  });

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const movedWithinSamePosition =
      destination.droppableId === source.droppableId &&
      destination.index === source.index;
    if (movedWithinSamePosition) return;

    dispatch(
      moveCardLocally({
        boardId,
        sourceColumn: source.droppableId as ColumnKey,
        destColumn: destination.droppableId as ColumnKey,
        sourceIndex: source.index,
        destIndex: destination.index,
        cardId: draggableId,
      })
    );

    try {
      const response = await fetch(
        `http://localhost:4000/boards/${boardId}/cards/${draggableId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ column: destination.droppableId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log("Card updated on server:", result);
    } catch (error) {
      console.error("Failed to update card on server:", error);
    }
  };

  const handleDeleteCard = (columnKey: ColumnKey, cardId: string) => {
    dispatch(deleteCard(boardId, columnKey, cardId));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="card-columns-wrapper">
        {columnsConfig.map(({ key, title }) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <div
                className="card-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className={`card-column-title ${key}`}>{title}</h2>

                {(cards[key] ?? []).map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        className="card-draggable"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <CardPreview
                          card={card}
                          boardId={boardId}
                          columnKey={key}
                          onDelete={() => handleDeleteCard(key, card.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Card;
