const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;    // from mongoose datatypes

const tweetSchema = new mongoose.Schema({                     // tweet schema

    content: {                  // tweet contents
        type: String,
        required: true
    },
    tweetedBy: {                        // creator of tweet
        type: ObjectId,
        ref: 'UserModel'
    },
    likes: [                         // array of user Id's who liked
        {
            type: ObjectId,
            ref: "UserModel"        // who likes the tweet (user)
        }
    ],
    retweetBy: [                     // array of user id's who retweeted
        {
            type: ObjectId,
            ref: "UserModel",
            // },
            tweetedAt: Date
        }
    ],
    image: {
        type: String,
        default: 'tweet image.jpg'
    },
    replies: [                          // array of user id's who replied
        {

            content: String,            // text to reply
            tweetedBy: {
                type: ObjectId,
                ref: "UserModel"
            }

        }
    ],

}, { timestamps: true });

mongoose.model('TweetModel', tweetSchema);


// imported in the server.js file