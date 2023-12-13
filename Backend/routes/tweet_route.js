const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TweetModel = mongoose.model('TweetModel');
const UserModel = mongoose.model('UserModel');
const protectedRoute = require('../middlewares/protectedResource');


// creating a new tweet
router.post('/api/tweet', protectedRoute, (req, res) => {    // added protectedRoute middleware
    const { content, image } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    req.user.password = undefined;
    const postObj = new TweetModel({ content: content, image: image || '', tweetedBy: req.user });

    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});


// all tweets of logged in user
router.get('/api/mytweets/:id/tweets', protectedRoute, (req, res) => {
    TweetModel.find({ tweetedBy: req.params.id })                         // req.user._id - logged in user's _id
        .populate("tweetedBy", "_id name profilePic")                     // get details about user
        .then((dbTweets) => {
            res.status(200).json({ tweets: dbTweets });
        })
        .catch((error) => {
            console.log(error);
        })
});


// all tweets of user not logged in
router.get('/api/user/:id/tweets', (req, res) => {
    TweetModel.find({ tweetedBy: req.params.id })                        // req.user._id - logged in user's _id
        .populate("tweetedBy", "_id name profilePic")                    // get details about user
        .sort({ createdAt: -1 })
        .then((dbTweets) => {
            res.status(200).json({ tweets: dbTweets });
        })
        .catch((error) => {
            console.log(error);
        })
});



// Like/Dislike a tweet 
router.put('/api/tweet/:id/like', protectedRoute, async (req, res) => {
    const tweetId = req.params.id;
    const tweetToUpdate = await TweetModel.findById(tweetId);

    if (!tweetToUpdate) {
        return res.status(404).json({ error: 'Tweet not found' });
    }

    // Prevent same user cannot like/dislike own tweets
    if (tweetToUpdate.tweetedBy._id.equals(req.user._id)) {              // to compare two objectId used method ObjectId.equals()
        return res.status(400).json({ error: 'You cannot like your own tweet' });
    }

    // Check if the user has already liked the tweet
    if (tweetToUpdate.likes.includes(req.user._id)) {

        // Try to dislike the tweet
        try {
            // dislike the tweet
            tweetToUpdate.likes.pull(req.user._id);

            // Save the updated tweet
            await tweetToUpdate.save();

            // Return the updated tweet data
            res.status(200).json({ success: 'Unliked successfully!', result: tweetToUpdate });
        } catch (error) {
            // Show the error if one occurs
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {

        // Try to like the tweet
        try {
            // Like the tweet
            tweetToUpdate.likes.push(req.user._id);

            // Save the updated tweet
            await tweetToUpdate.save();

            // Return the updated tweet data
            res.status(200).json({ success: 'Liked successfully!', result: tweetToUpdate });
        } catch (error) {
            // Show the error if one occurs
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


// Follow/Unfollow a user
router.put('/api/user/:id/follow', protectedRoute, async (req, res) => {
    const userToFollow = await UserModel.findById(req.params.id);
    // console.log(userToFollow);
    // console.log(req.body.id);
    if (!userToFollow) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    // Prevent same user cannot follow/unfollow himself
    if (req.user.id === req.body.id) {
        return res.status(400).json({ error: 'You cannot follow or unfollow yourself' });
    }

    // Check if the user is already following the userToFollow
    if (req.user.following.includes(userToFollow._id)) {

        // try to unfollow user
        try {
            // Remove the userToUnfollow from the user's following list
            req.user.following.pull(userToFollow._id);

            // Remove the user from the userToFollow's followers list
            userToFollow.followers.pull(req.user._id);

            // Save the user and userToUnfollow
            await req.user.save();
            await userToFollow.save();

            res.status(200).json({ success: 'You have unfollowed this user' });

        } catch (error) {
            // Show the error if one occurs
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }

        // return res.status(400).json({ error: 'You are already following this user' });
    }
    else {

        // try to follow a user
        try {
            // Add the userToFollow to the user's following list
            req.user.following.push(userToFollow._id);

            // Add the user to the userToFollow's followers list
            userToFollow.followers.push(req.user._id);

            // Save the user and userToFollow
            await req.user.save();
            await userToFollow.save();

            res.status(200).json({ success: 'You are now following this user' });

        } catch (error) {
            // Show the error if one occurs
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


// get single user details
router.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;

    // Find the user by ID
    UserModel.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.password = undefined;
            // Return the user data
            res.status(200).json({ user });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        });
});


// update users profile
router.put('/api/user/:id/', protectedRoute, async (req, res) => {
    const userId = req.params.id;
    const userToUpdate = await UserModel.findById(userId);

    // if no user with that ID in database
    if (!userToUpdate) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's details with the new values from the request body
    userToUpdate.name = req.body.name;
    userToUpdate.location = req.body.location;
    userToUpdate.date_of_birth = req.body.date_of_birth;

    // Save the updated user
    await userToUpdate.save();

    // Return the updated user data
    res.status(200).json({ user: userToUpdate });
});


// update users profile picture
router.put('/api/user/:id/profilepic', protectedRoute, async (req, res) => {
    const userId = req.params.id;
    const userToUpdate = await UserModel.findById(userId);

    // if no user with that ID in database
    if (!userToUpdate) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profile pic with the new one from the request body
    userToUpdate.profilePic = req.body.profilePic;

    // Save the updated user
    await userToUpdate.save();

    // Return the updated user data
    res.status(200).json({ user: userToUpdate });
});


// Reply to a tweet ( reply tweet also a tweet itself )
router.post('/api/tweet/reply', protectedRoute, async (req, res) => {
    const tweetId = req.body.tweetedId;
    const parentTweet = await TweetModel.findByIdAndUpdate(tweetId);

    if (!parentTweet) {
        return res.status(404).json({ error: 'Tweet not found' });
    }

    // get content from request body
    const replyContent = req.body.content;

    if (!replyContent) {
        return res.status(400).json({ error: 'Reply content is required' });
    }

    const replyTweet = new TweetModel({
        content: replyContent,
        tweetedBy: req.user._id,
    });

    await replyTweet.save();

    parentTweet.replies.push(replyTweet._id);
    await parentTweet.save();

    // send result
    res.status(201).json({ reply: replyTweet });
});




// Get a single tweet detail
router.get('/api/tweet/:id', async (req, res) => {
    const tweet = await TweetModel.findById(req.params.id)
        .populate('tweetedBy', '_id name username profilePic location')
        .populate('replies', '_id content tweetedBy')

    // tweet.tweetedBy.password = '';

    res.status(200).json({ tweet });
});

// Get all tweets 
router.get('/api/tweet/', async (req, res) => {
    const tweets = await TweetModel.find()                          // select all tweets in database
        .populate('tweetedBy', '_id name profilePic username')
        .populate('replies', '_id content tweetedBy')
        .sort({ createdAt: -1 });


    res.status(200).json({ tweets });
});


// Delete a tweet by the owner of the tweet
router.delete('/api/tweet/:id', protectedRoute, async (req, res) => {
    const tweetId = req.params.id;
    const tweet = await TweetModel.findById(tweetId);
    // console.log(typeof (tweet), tweet);

    if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found' });
    }

    // Check if the user is the owner of the tweet
    if (req.user._id.toString() !== tweet.tweetedBy.toString()) {
        return res.status(403).json({ error: 'You can only delete your own tweets' });
    }


    // Delete the tweet
    const deleteResult = await tweet.deleteOne();

    const deletedReplies = await TweetModel.updateMany({}, { $pull: { replies: { _id: tweet } } }, { multi: true });

    res.status(200).json({ success: 'Tweet deleted successfully', result: deleteResult, deletedReplies: deletedReplies });
});


// Retweet an existing tweet 
router.post('/api/tweet/:id/retweet', protectedRoute, async (req, res) => {
    const tweetId = req.params.id;
    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found' });
    }

    // Prevent same user cannot like/dislike own tweets
    if (tweet.tweetedBy._id.equals(req.user._id)) {              // to compare two objectId used method ObjectId.equals()
        return res.status(400).json({ error: 'You cannot retweet your own tweet' });
    }

    // Check if the user has already retweeted the tweet
    if (tweet.retweetBy.includes(req.user._id)) {

        try {
            // remove the user from the retweetBy array
            tweet.retweetBy.pull(req.user._id);

            // Save the updated tweet
            await tweet.save();

            // Return the updated tweet data
            res.status(200).json({ success: 'Retweet undo!', result: tweet });
        } catch (error) {
            // Show the error if one occurs
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {

        try {
            // Add the user to the retweetBy array
            tweet.retweetBy.push(req.user._id);

            // Save the tweet
            await tweet.save();

            // Return a success response to the client
            res.status(200).json({ success: 'Tweet retweeted successfully' });
        }
        catch (error) {
            // Show the error if one occurs
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


});


module.exports = router;

