import { Link } from 'react-router-dom';

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Registration page
function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);         // set loading to true when registration request sent

    const navigate = useNavigate();       // navigating to the login page when successful registration

    // registration function
    const register = (event) => {
        event.preventDefault();
        setLoading(true);

        // parameters to pass with the registration request (object format)
        const requestData = { name: name, username: username, email, password }

        // registration request
        axios.post(`${API_BASE_URL}/API/auth/register`, requestData)
            .then((result) => {
                // debugger;
                if (result.status === 201) {
                    setLoading(false);
                    toast('Registration successful', {
                        autoClose: 5000,
                    });

                    // setting all fields to empty string when registration is successful
                    setName('');
                    setUsername('');
                    setEmail('');
                    setPassword('');

                    // navigate to "login" page when registration is successful
                    navigate('/login');
                }
            })
            .catch((error) => {             // error message if registration unsuccessful
                // console.log(error);
                setLoading(false);
                toast(`${error.response.data.error}`, {
                    autoClose: 5000,
                });
            })
    }


    return (
        <div className='tweet-login d-flex align-items-center flex-column justify-content-center bg-light' style={{ fontFamily: "sans-serif" }}>
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
                    <div className="col-md-4 d-flex align-items-center justify-content-center flex-column bg-primary rounded text-nowrap text-light p-5">
                        <h6 className='fw-bold'>Join Us</h6>
                        <h1><i className="fa-regular fa-comment-dots"></i></h1>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title fw-bold">Register</h5>

                            {/* Registration form */}
                            <form onSubmit={register}>
                                <div className="my-3">
                                    <input type="text"
                                        className="form-control"
                                        placeholder='Full Name'
                                        value={name}
                                        // defaultValue={'jane@gmail.com'}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
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
                                <div className="my-3">
                                    <input type="text"
                                        className="form-control"
                                        placeholder='Username'
                                        value={username}
                                        // defaultValue={'jane@gmail.com'}
                                        onChange={(e) => setUsername(e.target.value)}
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

                                {/* Register button */}
                                <button type="submit" className="btn btn-dark border border-0">Register</button>
                            </form>
                            <p className='mt-3'>
                                <span>Already have an account? </span>
                                <Link className='text-primary fw-bold' to="/login">Login</Link>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;