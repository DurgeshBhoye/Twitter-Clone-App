import React from 'react';
import TweetList from '../components/TweetList';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Home page ( where all the tweets are displayed )
const Explore = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.userReducer.user)     // get user's details stored in redux store

    // function for logout and navigate to login page (for small screens devices)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });
        toast('Logged out successful!', {
            autoClose: 5000,
        });
        navigate('/login');          // if logged out successful navigate to login page
        window.location.reload();
    }


    return (
        <div className='col-12 col-md-6'>

            {/* Small screen sidebar button */}
            <button className="bg-white p-3 d-md-none d-sm-block border border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                <img src='https://freelogopng.com/images/all_img/1657043345twitter-logo-png.png' alt='logo' width='30px' />
            </button>



            {/* TweetList Component to display tweets on main page */}
            <TweetList />



            {/* Small screen sidebar modal or offcanvas */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" style={{ height: "100vh" }}>
                <div className="offcanvas-header">
                    <Link to="/" className="d-flex align-items-center mb-md-0 me-md-auto text-decoration-none gap-3" id="offcanvasExampleLabel">
                        <img src='https://freelogopng.com/images/all_img/1657043345twitter-logo-png.png' alt='logo' width='30px' />
                        <span className="fs-4">Twitter</span>
                    </Link>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <ul className="nav nav-pills flex-column mb-auto">
                        <li onClick={() => navigate(`/`)} className="nav-item">
                            <Link href="#" className="nav-link active d-flex gap-3 align-items-center" aria-current="page">
                                <i className="fa-solid fa-house"></i>
                                <span> Home</span>
                            </Link>
                        </li>
                        <li onClick={() => navigate(`/profile/${user._id}`)}>
                            <Link className="nav-link link-body-emphasis d-flex gap-3 align-items-center">
                                <i className="fa-solid fa-user"></i>
                                <span> Profile</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="nav-link link-body-emphasis d-flex gap-3 align-items-center">
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span onClick={logout}> Logout</span>
                            </Link>
                        </li>
                    </ul>

                    <hr />
                    {user._id ?
                        <div>
                            <Link className="d-flex align-items-center link-body-emphasis text-decoration-none gap-2">
                                <img src={user.profilePic} alt="user pic" width="36" height="36" className="rounded-circle me-2" />
                                <div className='d-flex flex-column'>
                                    <strong>{user.name}</strong>
                                    <h6>@{user.username}</h6>
                                </div>
                            </Link>
                        </div>
                        : ''}

                </div>
            </div>
        </div>
    )
}

export default Explore;