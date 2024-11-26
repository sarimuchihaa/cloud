import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sam from "./Components/Sam/Sam.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Sam />} />
      </Routes>
    </Router>
  );
}

export default App;
