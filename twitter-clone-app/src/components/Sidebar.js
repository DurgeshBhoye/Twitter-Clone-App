import React from 'react'
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sidebar Component
const Sidebar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.userReducer.user)

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });
        toast('Logged out successful!', {
            autoClose: 5000,
        });
        navigate('/login');
        window.location.reload();
    }



    return (
        <div className="d-flex flex-column p-3 bg-body-tertiary w-25 side-component d-none d-md-flex col-sm-3" id='sidebar'>
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none gap-3">
                <img src="https://freelogopng.com/images/all_img/1657043345twitter-logo-png.png" alt='logo' style={{ width: "30px" }} />
                <span className="fs-4">Twitter</span>
            </Link>
            <hr />

            {/* Navigation Links */}
            <ul className="nav nav-pills flex-column mb-auto sidebar-link">
                <li onClick={() => navigate(`/`)} className="nav-item">
                    <Link to="/" className="nav-link d-flex gap-3 align-items-center" aria-current="page">
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
                    <Link className="nav-link link-body-emphasis d-flex gap-3 align-items-center">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span onClick={logout}> Logout</span>
                    </Link>
                </li>
            </ul>

            <hr />

            {/* Logged in user's details */}
            {user._id ?
                <div>
                    <Link className="d-flex align-items-center link-body-emphasis text-decoration-none gap-2">
                        <img src={user.profilePic} alt="" width="36" height="36" className="rounded-circle me-2" />
                        <div className='d-flex flex-column'>
                            <strong>{user.name}</strong>
                            <h6>@{user.username}</h6>
                        </div>
                    </Link>
                </div>
                : ''}
        </div>
    )
}

export default Sidebar