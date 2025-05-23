

import AddNewBoard from "./components/AddNewBoard/AddNewBoard";
import BoardList from "./components/BoardList/BoardList";
import SearchBoardById from "./components/SearchBoardId/SearchBoardById";

import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <div className="app">
        <header className="app-header">
          <h1>Create your TODO LIST</h1>
        </header>
        <main className="app-main">
          <AddNewBoard />
          <SearchBoardById />
          <BoardList />
        </main>
      </div>
    </>
  );
};

export default App;