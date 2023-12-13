const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const bcryptjs = require("bcryptjs");             // for password encryption and decryption (hash and compare)
const jwt = require('jsonwebtoken');        // for token based authentication (jwt token authentication)

const { JWT_SECRET_KEY } = require('../config');   // from confi.js file


// Signup API or route
router.post('/API/auth/register', (req, res) => {
    const { name, username, email, password, profilePic, date_of_birth, location } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not (if exists user already through error) and (if not exists save user in database)
    UserModel.findOne({ $or: [{ email }, { username }] })  // here first email is from user_model.js and second email is from req.body above
        .then((userInDB) => {       // if successful
            if (userInDB) {
                return res.status(500).json({ error: 'User with this email or username already exists!', result: { email: email, username: username } });
            }
            bcryptjs.hash(password, 16)
                .then((hashedpassword) => {
                    const user = new UserModel({ name, username, email, password: hashedpassword, profilePic, date_of_birth, location });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: 'User signed up successfully!' });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })


})



// Login API with JWT token authentication
router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not
    UserModel.findOne({ email: email })  // find if email already in database
        .then((userInDB) => {       // if successful
            if (!userInDB) {
                return res.status(401).json({ error: 'Invalid Credentials! User not found.' });   // unauthorized access or user (status 401) - if email is not in database
            }
            bcryptjs.compare(password, userInDB.password)      // change hash to "compare" to compare the password with encrypted password 
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET_KEY);  // _id from user in database
                        const userInfo = { "email": userInDB.email, "name": userInDB.name, "_id": userInDB._id, "username": userInDB.username, "profilePic": userInDB.profilePic, "dob": userInDB.date_of_birth, "location": userInDB.location }   // extra information of the user (don't include password)

                        return res.status(200).json({ result: { message: 'User login successful!', token: jwtToken, user: userInfo } });   // token will return jwt token and user will return userInfo stored in above variable

                    }
                    else {
                        return res.status(401).json({ error: 'Invalid credentials! Incorrect password!' });   // if not matched password
                    }
                })
                .catch((err) => {          // if error in comparing password
                    console.log(err);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })

})



module.exports = router;



/*


+ output of login :

1. token - JWT Token (String)

2. User's information (object)


*/
