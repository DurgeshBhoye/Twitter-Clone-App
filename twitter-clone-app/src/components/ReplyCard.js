import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Tweet from './Tweet';
import './ReplyCard.css';

// Replies Card component
const ReplyCard = ({ replyId }) => {

    const [comment, setComment] = useState({});
    const [isLoading, setLoading] = useState(true);

    // Fetch the replies data 
    const fetchComments = async () => {
        const response = await axios.get(`${API_BASE_URL}/api/tweet/${replyId}`);
        setComment(response.data.tweet);
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, [replyId]);

    // console.log("Commment", comment);

    if (isLoading) {
        return <div className="App">Loading comments...</div>;
    }


    // ===============================================================================

    return (
        <div><ul className='list-unstyled reply-card'>
            <Tweet tweets={comment} setData={fetchComments} />
        </ul></div>
    )
}

export default ReplyCard;