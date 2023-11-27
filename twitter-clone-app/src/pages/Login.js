import React from 'react';
import './Login.css';

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';        // use to add/pass/store data to the store or userReducer
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Login page
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();           // for passing data in redux store

    const navigate = useNavigate();      // for navigation

    // login function
    const login = (event) => {
        event.preventDefault();
        // debugger;
        setLoading(true);

        // parameters to pass with the login request (object format)
        const requestData = { email, password }

        // Login request
        axios.post(`${API_BASE_URL}/auth/login`, requestData)
            .then((response) => {

                if (response.status === 200) {
                    setLoading(false);
                    localStorage.setItem('token', response.data.result.token);   // storing token to localStorage
                    localStorage.setItem('user', JSON.stringify(response.data.result.user));  // to localStorage
                    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.result.user, })  // passing user's data to userReducer inside case: "LOGIN_SUCCESS"

                    // console.log(response.data.result.user);

                    // navigate to "topsales" page when login is successful
                    navigate('/');

                    toast('Login Successful!', {
                        autoClose: 5000,
                    });

                    // setting all fields to empty string when login is successful
                    setEmail('');
                    setPassword('');
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error(`${error.response.data.error}`, {
                    autoClose: 3000,
                });
            })
    }


    return (
        <div className='tweet-login d-flex align-items-center flex-column justify-content-center bg-light col-12 w-100'>
            {loading ?
                <h3>
                    <span className="spinner-grow spinner-grow-sm text-danger" aria-hidden="true"> </span>
                    <span className="spinner-grow spinner-grow-sm text-warning" aria-hidden="true"> </span>
                    <span className="spinner-grow spinner-grow-sm text-success" aria-hidden="true"> </span>
                    <span className="spinner-grow spinner-grow-sm text-primary" aria-hidden="true"> </span>
                    <span className="spinner-grow spinner-grow-sm text-secondary" aria-hidden="true"> </span>
                    {/* <span role="status">Loading...</span> */}
                </h3>
                :
                ''
            }
            <div className="card mb-3 shadow border border-0 m-5">

                <div className="row g-0 ">

                    <div className="col-md-4 d-flex align-items-center justify-content-center flex-column bg-primary rounded text-light p-4">
                        <h6 className='text-center fw-bold'>Welcome Back</h6>
                        <h1><i className="fa-regular fa-comment-dots"></i></h1>
                    </div>
                    <div className="col-md-8">

                        <div className="card-body">
                            <h5 className="card-title fw-bold">Log in</h5>

                            {/* Login Form */}
                            <form onSubmit={login}>
                                <div className="my-3">
                                    <input type="email"
                                        className="form-control"
                                        placeholder='Email'
                                        value={email}
                                        // defaultValue={'jane@gmail.com'}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input type="password"
                                        className="form-control"
                                        placeholder='Password'
                                        value={password}
                                        // defaultValue={'foster'}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Login button */}
                                <button type="submit" className="btn btn-dark border border-0">Login</button>
                            </form>
                            <p className='mt-3'>
                                <span>Don't have an account? </span>
                                <Link className='text-primary fw-bold' to="/register">Register</Link>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login