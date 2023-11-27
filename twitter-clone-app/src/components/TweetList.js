import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Tweet from './Tweet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TweetList Component (List of all Tweets)
const TweetList = () => {

    const [tweets, setAllTweets] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState({ preview: '', data: '' });
    const [caption, setCaption] = useState("");

    // To send with the request as a JWT token (send JWT token String as authenticated requests)
    const CONFIG_OBJECT = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    // Get all the tweets from database
    const getAllTweets = async () => {
        const response = await axios.get(`${API_BASE_URL}/api/tweet/`);
        setAllTweets(response.data.tweets)
        setIsLoading(false);
    }

    useEffect(() => {
        getAllTweets();
    }, []);

    // ------------------------------------------------------------------------------

    // function to upload image
    const handleFileSelect = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0]
        }
        setImage(img);
    }

    // function to upload image
    const handleImgUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadProfilePic`, formData);
        return response;
    }

    // function to create a new tweet
    const addTweet = async () => {
        // creating a validation if image is present or not
        if (caption === '') {
            toast.warn('Text mandatory!', {
                position: "top-center",
                autoClose: 3000,
            });
        }
        else if (image.preview === '') {
            toast.warn('Image mandatory!', {
                position: "top-center",
                autoClose: 3000,
            });
        }

        else {
            setLoading(true);
            const imgRes = await handleImgUpload();

            // console.log(image);
            const request = {
                content: caption,
                image: `${API_BASE_URL}/files/${imgRes.data.fileName}`
            }

            // write api call to create post
            const addResponse = await axios.post(`${API_BASE_URL}/api/tweet`, request, CONFIG_OBJECT)

            if (addResponse.status === 201) {
                setImage({ preview: '', data: '' });
                setLoading(false);
                getAllTweets();
                toast.success('Tweet posted!');

            }
            else {
                setLoading(false);
                toast.error('Tweet Not posted!');
            }
        }
    }



    if (isLoading) {
        return (
            <div className="d-flex flex-column">
                <div className="p-3 bg-light border border-4">

                    {/* Add Tweet Button when user not logged in*/}
                    <div className='d-flex justify-content-between'>
                        <span className="fs-5 fw-bold">Home</span>
                        <button className="btn btn-primary rounded-5 px-3">
                            Tweet
                        </button>
                    </div>

                </div>
                <h5 className='p-2'>Loading tweets...</h5>
            </div>
        )
    }





    // ===========================================================================

    return (
        <div className="d-flex flex-column">
            <div className="p-3 bg-light border border-1 border-dark">
                <div className='d-flex justify-content-between'>

                    <span className="fs-5 fw-bold">Home</span>

                    {/* add tweet button when user logged in */}
                    <button type="button" className="btn btn-primary rounded-5 px-3" data-bs-toggle="modal" data-bs-target="#addtweet">
                        Tweet
                    </button>

                    {/* Add Tweet Modal */}
                    <div className="modal fade" id="addtweet" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Tweet</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    {loading ?
                                        <button className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                            <span role="status">Loading...</span>
                                        </button>

                                        :

                                        <div>
                                            <div>
                                                <textarea onChange={(e) => setCaption(e.target.value)} className="form-control w-100 mb-2" placeholder="Your text here..." ></textarea>
                                            </div>

                                            <div className='text-primary' onChange={handleFileSelect}>
                                                <div className="w-50">
                                                    <input name='file' type="file" id="drop_zone" className="form-control" accept=".jpg,.png,.gif, text/*" />
                                                </div>


                                                {image.preview && (
                                                    <img src={image.preview} width='100%' alt='commentIMG' height='100%' className='img-fluid border border-2 border-dark rounded mt-3' />
                                                )}
                                            </div>

                                            <div className="alert alert-info mt-3" role="alert" style={{ fontSize: "14px" }}>
                                                <span className='text-muted'>Note: Image should be of size less that 10mb.</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary rounded-5 px-3" data-bs-dismiss="modal">Close</button>
                                    <button onClick={addTweet} type="button" className="btn btn-primary rounded-5 px-3">Tweet</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* send individual tweets details to map as a tweet card */}
                <div className='mt-3'>
                    {tweets ?
                        tweets.map((tweet) => {
                            return (
                                <div key={tweet._id}>
                                    <Tweet tweets={tweet} setData={getAllTweets} />
                                </div>
                            )
                        })
                        : <h4>Loading...</h4>
                    }
                </div>

            </div>
        </div>
    )
}

export default TweetList;