import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import './styles/index.css'
import Share from "./pages/Share";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/share" Component={Share} />
        <Route path="/remitano-app" Component={Home} />
        <Route path="/remitano-app/share" Component={Share} />
      </Routes>
    </Router>
  );
}

export default App;
