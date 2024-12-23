import {useEffect} from 'react';
// import Home from "./Pages/User/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/UserRoutes"
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { refreshAccessToken } from './redux/actions/authActions';
import AdminRoutes from "./Routes/AdminRoutes"
import TutorRoutes from "./Routes/TutorRoutes"



function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
   
    dispatch(refreshAccessToken());
  }, [dispatch]);

  return(
  <>
  <Router>
    <Routes>
    //user Routes
    <Route path = '/*' element = {<UserRoutes />} />
    // Admin Routes
    <Route path = '/admin/*' element={<AdminRoutes />} />
    //Tutor Routes 
    <Route path = '/tutor/*' element = {<TutorRoutes />} />
    </Routes>
  </Router>
  </>
  )
}

export default App;
