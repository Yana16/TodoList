import { useState, useEffect, ChangeEvent, FC, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBoardId } from "../../redux/boards/actionCreators";
import { AppDispatch, RootState } from "../../redux/store";
import { Board } from "../../redux/types";

import Button from "../ui/Button";

import "./SearchBoardById.css";

const SearchBoardById: FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const searchedBoard = useSelector<RootState, Board | null>(
    (state) => state.boards.searchBoard
  );


  useEffect(() => {
    if (!searchId.trim()) {
      setHasSearched(false);
    }
  }, [searchId]);

  const handleSearchById = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedId = searchId.trim();
    if (!trimmedId) {
      alert("Please enter a Board ID.");
      return;
    }

    setLoading(true);
    await dispatch(searchBoardId(trimmedId));
    setHasSearched(true);
    setLoading(false);
  };

  return (
    <div className="search-board-container general-form">
      <form className="search-board-form" onSubmit={handleSearchById}>
        <input
          type="search"
          value={searchId}
          name="query"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
          placeholder="Enter a Board ID here..."
          className="general-input"
        />
        <Button disabled={loading} className="search-board-button">
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {hasSearched && !loading && (
        searchedBoard ? (
          <div className="search-board-result">
            <h3 className="result-title">Board found:</h3>
            <p className="result-id"><strong>ID:</strong> {searchedBoard.id}</p>
            <p className="result-name"><strong>Name:</strong> {searchedBoard.boardName}</p>
          </div>
        ) : (
          <p className="no-board-message">No Board Found!</p>
        )
      )}
    </div>
  );
};

export default SearchBoardById;
