import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';   // use to add/pass/store data to the store or userReducer
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';    // if user not logged in and trying to like or unlike post navigate to "/login"
import moment from 'moment';
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Tweet.css';


// Single Tweet component (individual tweet card)
const Tweet = ({ tweets, setData }) => {

    // console.log("Tweets as single tweet", tweets);

    // state variables
    const [replyText, setReplyText] = useState('');
    const [profileData, setProfileData] = useState({});

    const [commentBox, setCommentBox] = useState(false);

    const navigate = useNavigate();

    const { userId, tweetId } = useParams();           // get userId and tweetId from URL

    const location = useLocation().pathname;

    const user = useSelector(state => state.userReducer.user)          // get user's details stored in redux store

    // const [tweetIdToReply, setTweetIdToReply] = useState('');



    // To send with the request as a JWT token (send JWT token String as authenticated requests)
    const CONFIG_OBJECT = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }


    // Toggle comment box visibility
    const toggleVisibility = () => {
        setCommentBox(!commentBox);
    };



    // function to reply to a tweet
    const reply = async (replyId) => {
        try {

            const response = await axios.post(`${API_BASE_URL}/api/tweet/reply`, { "tweetedId": replyId, "content": replyText }, CONFIG_OBJECT);


            if (response.status === 201) {
                setReplyText('');
                setCommentBox(false);
                toast.success('Reply posted!', {
                    autoClose: 2000,
                });
            }

            // Update component's state on all this pages when request is successful
            if (location.includes("profile")) {
                const newData = await axios.get(`${API_BASE_URL}/api/user/${userId}/tweets`);
                setData(newData.data);
            } else if (location.includes("tweet")) {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/${tweetId}`);
                setData(newData.data);
            } else {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/`);
                setData(newData.data);
            }
        }
        catch (err) {
            console.log("error", err);
        }

    }


    // function to like / dislike a tweet
    const handleLike = async (e) => {
        e.preventDefault();

        try {
            const like = await axios.put(`${API_BASE_URL}/api/tweet/${tweets._id}/like`, { tweetId: tweets._id }, CONFIG_OBJECT);

            if (tweets.likes.includes(user._id)) {
                toast.info('👎 Dislike!', {
                    autoClose: 2000,
                });
            }
            else {
                toast.success('👍 Liked!', {
                    autoClose: 2000,
                });
            }

            // Update component's state on all this pages when request is successful
            if (location.includes("profile")) {
                const newData = await axios.get(`${API_BASE_URL}/api/user/${userId}/tweets`);
                setData(newData.data);
            } else if (location.includes("tweet")) {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/${tweetId}`);
                setData(newData.data);
            } else {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/`);
                setData(newData.data);
            }
        } catch (err) {
            console.log("error", err);
        }
    };

    // funtion to retweet
    const handleReTweet = async (e) => {
        e.preventDefault();

        try {
            const retweet = await axios.post(`${API_BASE_URL}/api/tweet/${tweets._id}/retweet`, { tweetId: tweets._id }, CONFIG_OBJECT);

            if (tweets.retweetBy.includes(user._id)) {
                toast.info('Retweet undo!', {
                    autoClose: 2000,
                });
            }
            else {
                toast.success('Retweeted!', {
                    autoClose: 2000,
                });
            }

            // Update component's state on all this pages when request is successful
            if (location.includes("profile")) {
                const newData = await axios.get(`${API_BASE_URL}/api/user/${userId}/tweets`);
                setData(newData.data);
            } else {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/`);
                setData(newData.data);
            }
        } catch (err) {
            console.log("error", err);
        }
    };

    // function to delete a tweet
    const deleteTweet = async (tweetedId) => {
        // console.log(tweetId);
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/tweet/${tweetedId}`, CONFIG_OBJECT);
            // window.location.reload()

            toast.success('Tweet Deleted!', {
                autoClose: 3000,
            });

            // Update component's state on all this pages when request is successful
            if (location.includes("profile")) {
                const newData = await axios.get(`${API_BASE_URL}/api/user/${userId}/tweets`);
                setData(newData.data);
            } else if (location.includes("tweet")) {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/${tweetId}`);
                setData(newData.data);
            } else {
                const newData = await axios.get(`${API_BASE_URL}/api/tweet/`);
                setData(newData.data);
            }

        } catch (err) {
            console.log("error", err);
        }
    }


    // retweet by username (last user who retweeted the tweet)
    const fetchProfileData = async () => {
        try {
            if (tweets) {
                const response = await axios.get(`${API_BASE_URL}/api/user/${tweets.retweetBy[tweets.retweetBy.length - 1].toString()}`);
                setProfileData(response.data.user);
                // console.log("Tweeted By : ", response);

            }
            else {
                return
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [tweets]);

    // console.log("RetweetBy user Details", profileData);

    // console.log("Tweeted By Type of: ", type(tweets.retweetBy[tweets.retweetBy.length - 1].toString()));


    // ==============================================================================

    return (
        <div className="p-3 border border-1 my-1 single-tweet-card">
            {profileData.username && (
                <p className='ps-5 text-muted'><i className="fa-solid fa-retweet"></i> Retweeted by @{profileData.username}</p>
            )}
            <div className="d-flex align-items-center justify-content-between p-1">
                <div className="d-flex gap-2 w-100">
                    {tweets.tweetedBy && (
                        <img src={tweets.tweetedBy.profilePic} alt="" width="45" height="45" className="rounded-circle me-2" />
                    )
                    }

                    <div className='w-100 delete-to'>
                        <div className='d-flex justify-content-between'>
                            {/* Tweet creator's details */}
                            <div>
                                <span onClick={() => navigate(`/profile/${tweets.tweetedBy._id}`)} className='fw-bold' style={{ cursor: "pointer" }}> {tweets.tweetedBy.name}</span>
                                <span className=''> @{tweets.tweetedBy.username}</span>
                                <span className=''> . {moment(tweets.createdAt).fromNow()}</span>
                            </div>
                            {user._id === tweets.tweetedBy._id ?
                                <span onClick={() => deleteTweet(tweets._id)} type="button" className="text-secondary deletes"><i className="fa-solid fa-trash-can"></i></span>
                                :
                                ""
                            }
                        </div>
                        <div>

                            {/* Tweet message or contents */}
                            <pre className="my-2 d-flex" style={{ fontFamily: "sans-serif", whiteSpace: "pre-wrap" }} onClick={() => navigate(`/tweet/${tweets._id}`)}>{tweets.content}</pre>

                            {tweets.image !== "tweet image.jpg" ?
                                <div className="card w-75 shadow-sm">
                                    <img src={tweets.image} className="card-img" alt="camera" />
                                </div>
                                :
                                ""
                            }

                            <div className="d-flex justify-content-between w-75 pt-3">

                                {/* Like button */}
                                <button onClick={handleLike} className='border border-0 liked'>
                                    {tweets.likes.includes(user._id) ? (
                                        <i className="fa-solid fa-heart text-danger"></i>
                                    ) : (
                                        <i className="fa-regular fa-heart text-muted"></i>
                                    )}
                                    <sup>{tweets.likes.length}</sup>
                                </button>


                                <button onClick={toggleVisibility} type="button" className="border border-0 commented">
                                    {tweets.replies.length !== 0 ? (
                                        <i className="fa-regular fa-comment text-warning"></i>
                                    ) : (
                                        <i className="fa-regular fa-comment text-muted"></i>
                                    )}
                                    <sup>{tweets.replies.length}</sup>
                                </button>


                                {/* Retweet button */}
                                <button onClick={handleReTweet} className='border border-0 retweeted'>
                                    {tweets.retweetBy.includes(user._id) ? (
                                        <i className="fa-solid fa-retweet text-success"></i>
                                    ) : (
                                        <i className="fa-solid fa-retweet text-muted"></i>
                                    )}
                                    <sup>{tweets.retweetBy.length}</sup>
                                </button>

                            </div>
                            {commentBox && user._id ?
                                <div className='row my-4 rounded-5'>
                                    <div className='col-12 d-flex justify-content-around align-items-center gap'>
                                        <textarea rows={1}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className='form-control rounded-5 me-2 border-secondary bg-light'
                                            placeholder='Post your reply'>
                                        </textarea>

                                        <button onClick={() => reply(tweets._id)}
                                            type="button"
                                            className="btn btn-primary rounded-5 px-3 ">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                                : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet;