import {useState} from "react";
import Login ,{TokenContext}from "./Components/login";
import Userpage from "./Components/Userpage";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";

function App() {

  const [Token,setToken] = useState();

  return (
    <TokenContext.Provider value={{Token,setToken}}>
    <BrowserRouter>
      <Link to="/"></Link>
      <Link to="/Task"></Link>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/task" element={<Userpage />} />
      </Routes>
    </BrowserRouter>
    </TokenContext.Provider>
  );
}

export default App;
