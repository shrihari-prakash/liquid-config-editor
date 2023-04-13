import "./App.css";
import FrontendOptionList from "./components/FrontendOptionList";
import Home from "./components/Home";
import BackendOptionList from "./components/BackendOptionList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/frontend" element={<FrontendOptionList />} />
          <Route path="/backend" element={<BackendOptionList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
