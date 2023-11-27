import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Sidebar from './components/Sidebar';
import TweetDetails from './pages/TweetDetails';
import Profile from './pages/Profile';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  function DynamicComponent() {
    const dispatch = useDispatch();                                        // initializing dispatch
    const navigate = useNavigate();                                       // go to "/login" when logged out or not logged in

    // checking if user's data is available in redux store / userReducer
    const user = useSelector(state => state.userReducer.user)

    useEffect(() => {

      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {   // when user has a logged in active session
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate('/');                // if user is logged in navigate to home page
      }
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });              // for removing the token and the user from the redux store and userReducer.js
        navigate('/login');             // if the user is not logged in restrict to access home page and redirect to login page
      }

    }, []);

    if (user._id) {          // if user is logged in give access to this routes
      return (
        <Routes>
          <Route path='/' element={
            <Fragment>
              <Sidebar />
              <Explore />
            </Fragment>
          } />
          <Route path='/tweet/:tweetId' element={
            <Fragment>
              <Sidebar />
              <TweetDetails />
            </Fragment>
          } />
          <Route path='/profile/:userId' element={
            <Fragment>
              <Sidebar />
              <Profile />
            </Fragment>
          } />
        </Routes>
      )
    }
    else {                   // if user is not logged in show login or registration page
      return (
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      )
    }
  }


  return (
    <div className="App">
      <div className="row">
        <BrowserRouter>
          <ToastContainer />
          <DynamicComponent />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
