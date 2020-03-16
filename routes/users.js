const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator/check');

const User = require('../models/User');   // import user model

// @route   POST api/users
// @desc    Register a user
// @access  Public

router.post('/',[

    check('name', 'Please enter a name')               // check name is not empty
        .not()
        .isEmpty(),

    check('email', 'Please enter a valid email')
        .isEmail(),

    check('password', 'Please enter a password with 6 or more characters').
        isLength({min: 6}) 

],

async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});    // give 400 and display error array detailing issues
    }

    const { name, email, password} = req.body;    // get user info from request

    try {
        let user = await User.findOne({email: email});     // find if another user already has the email being entered
    
        if(user) {
            return res.status(400).json({msg: 'Email already used'});   // if user exists (ie. if email already in use), display error
        }

        user = new User({                   // if OK, add new user
            name: name,
            email: email,
            password: password
        });

        // HASH PASSWORD

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);      // pass in user pw and salt

        await user.save();              // save user into db

        const payload = {                 // send payload with user id
            user: {
                id: user.id
            }
        }

        // CREATE JWT

        jwt.sign(payload, config.get('jwtSecret'), {            // jwtsecret from config
            expiresIn: 3600000
        }, (err, token) => {
            if(err) throw err;
            res.json({token});
        });            

        } catch (err) {
            console.error(err.message);                         // display error in console
            res.status(500).send('Server error. Try again');    // return error message
        }


});

module.exports = router;
