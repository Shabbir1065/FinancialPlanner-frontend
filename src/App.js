import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home"
import { Auth } from "./pages/auth"
import PrivateRoutes from './utils/PrivateRoutes'

function App() {
  
  return (
    <div className="App">
      <Router>
        <Navbar className="navBar"/>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home/>}/>
          </Route>
          <Route path="/auth" element={<Auth/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
