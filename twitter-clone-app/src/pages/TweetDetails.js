import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Tweet from '../components/Tweet';
import ReplyCard from '../components/ReplyCard';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Single tweet details page with replies below it
const TweetDetails = () => {

    const [tweetData, setTweetData] = useState({});
    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.userReducer.user)


    const { tweetId } = useParams();             // get the tweetId from the URL

    // function to fetch the tweet details
    const fetchTweetData = async () => {
        const response = await axios.get(`${API_BASE_URL}/api/tweet/${tweetId}`);
        setTweetData(response.data.tweet);
        setLoading(false);
    };

    useEffect(() => {
        fetchTweetData();
    }, [tweetId]);

    // console.log("TweetDetails", tweetData);

    if (isLoading) {
        return <div className="App">Loading tweet details...</div>;
    }

    // console.log(tweetData.replies);


    // function for logout and navigate to login page (for small screens devices)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });
        toast('Logged out successful!', {
            autoClose: 5000,
        });
        navigate('/login');             // on successful logout navigate to login page
        window.location.reload();
    }



    //=================================================================================

    return (
        <div className='col-12 col-md-6'>
            {/* Small screen sidebar button */}
            <button className="bg-white p-3 d-md-none d-sm-block border border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTweetDetails" aria-controls="offcanvasTweetDetails">
                <img src='https://freelogopng.com/images/all_img/1657043345twitter-logo-png.png' alt='logo' width='30px' />
            </button>

            <div className="p-3 bg-light border border-1 border-dark">
                <div className='d-flex justify-content-between flex-column'>
                    <h4 className='fw-bold'>Tweet Details</h4>

                    {!isLoading && tweetData && (
                        <>
                            <div className="list-group border-bottom">
                                <Tweet tweets={tweetData} setData={fetchTweetData} />
                            </div>

                            <h6 className='text-center fw-bold mt-4'>Replies</h6>
                            {/* <hr className='border border-2 border-dark mt-0' /> */}

                            {/* Mapping Tweet Replies */}
                            <div className='list-unstyled'>
                                {tweetData.replies.map((reply) => (
                                    <ReplyCard replyId={reply._id} />
                                ))}
                            </div>

                        </>
                    )}
                </div>
            </div>

            {/* Small screen sidebar modal or offcanvas */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasTweetDetails" aria-labelledby="offcanvasTweetDetailsLabel" style={{ height: "100vh" }}>
                <div className="offcanvas-header">
                    <Link to="/" className="d-flex align-items-center mb-md-0 me-md-auto text-decoration-none gap-3" id="offcanvasTweetDetailsLabel">
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
                                <img src={user.profilePic} alt="" width="36" height="36" className="rounded-circle me-2" />
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

export default TweetDetails