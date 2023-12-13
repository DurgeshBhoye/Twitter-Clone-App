const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;    // from mongoose datatypes

const userSchema = new mongoose.Schema({        // user schema

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png'
    },
    location: {
        type: String,
        default: 'unknown'
    },
    date_of_birth: {
        type: Date,
        required: false
    },
    followers: [
        {
            type: ObjectId,
            ref: 'UserModel'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'UserModel'
        }
    ]

}, { timestamps: true });

mongoose.model('UserModel', userSchema);


// imported inside server.js file