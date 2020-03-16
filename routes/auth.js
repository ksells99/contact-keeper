const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator/check');

const User = require('../models/User');   // import user model

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {                   // auth parameter = protected - runs auth.js middleware
    try {
        const user = await User.findById(req.user.id).select('-password');           // get user id from request header - not password
        res.json(user);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server error. Try again');
    }

});


// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], 

async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});    // give 400 and display error array detailing issues
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email: email});                  // get email address entered.

        if(!user) {                                                     // if no user with that email...
            return res.status(400).json({msg: 'Invalid credentials'});  // show error
        }

        const isMatch = await bcrypt.compare(password, user.password);     // check plaintext password entered vs. hashed pw

        if(!isMatch) {                                                  // if pw is incorrect...
            return res.status(400).json({msg: 'Invalid credentials'})   // show error
        }

        // IF CREDENTIALS MATCH...

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
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server error. Try again');
    }
});

module.exports = router;