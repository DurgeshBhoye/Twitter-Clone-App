const mongoose = require('mongoose');   // for checking the database weather it is a valid user
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config');   // from confi.js file // for decryption of token

const UserModel = mongoose.model('UserModel');   // schema


module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // Bearer lijfohweohwioej (random jwt token)
    if (!authorization) {
        return res.status(401).json({ error: "User not logged in or not authorized!" })
    }

    // this will replace or remove "Bearer<space>" from above "Bearer lijfohweohwioej" we'll get only "lijfohweohwioej" (JWT Token)
    const token = authorization.replace("Bearer ", "");      // this token we can get from the ouput of /auth/login (select token: "string")


    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
        if (error) {
            return res.status(401).json({ error: "User not logged in or not authorized! (verify error)" });
        }

        const { _id } = payload;      // logged in user Id
        UserModel.findById(_id)
            .then((dbUser) => {         // dbUser is the data inside _id
                req.user = dbUser;   // attach/get user data inside dbUser  
                next();      // move forward  to the next middleware or callback or go to REST API...
            })
    })
}



// Middleware is called before every endpoint.

// applying middlewares will stop unauthorized users from accessing the endpoint resources