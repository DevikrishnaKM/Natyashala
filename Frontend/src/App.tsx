import React from 'react';
import Home from "./Pages/User/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/UserRoutes"


function App() {
  return(
  <>
  <Router>
    <Routes>
    //user Routes
    <Route path = '/*' element = {<UserRoutes />} />
    </Routes>
  </Router>
  </>
  )
}

export default App;
