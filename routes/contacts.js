const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator/check');

const User = require('../models/User');   // import user model
const Contact = require('../models/Contact');   // import contact model

// @route   GET api/contacts
// @desc    Get all user's contacts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({date: -1});   //get array of most recent contacts
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error - try again');
    }
});



// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', [auth, [
    check('name', 'Please enter a name').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});    // give 400 and display error array detailing issues
        }

        const {name, email, phone, type} = req.body;

        try {
            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            });

            const contact = await newContact.save();   // puts new contact into db
            res.json(contact);                         

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error - try again');
        }
    });



// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const {name, email, phone, type} = req.body;

    // Build contact object
    const contactFields = {};
    if(name) contactFields.name = name;             // if there is a name, add to contactfields obj.
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    // Update contact
    try {
        let contact = await Contact.findById(req.params.id);            // find the contact by id (url above)
    
        if(!contact) return res.status(404).json({msg: 'Contact not found'});  // if contact not found

        // Ensure user owns the contact they are editing, if not...
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Unauthorised access to this contact'});
        }

        // Update contact

        contact = await Contact.findByIdAndUpdate(req.params.id,       // pass in contact id and fields
            {$set: contactFields},
            {new: true});                       // if contact doesn't exist, create it
        
            res.json(contact);

    } catch (err) {
        console.error(err.message);
            res.status(500).send('Server error - try again');
    };


});




// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);            // find the contact by id (url above)
    
        if(!contact) return res.status(404).json({msg: 'Contact not found'});  // if contact not found

        // Ensure user owns the contact they are deleting, if not...
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Unauthorised access to this contact'});
        }

        // Delete contact
        await Contact.findByIdAndRemove(req.params.id);         // find contact by id and remove
        
        res.json({msg: 'Contact deleted'});                     

    } catch (err) {
        console.error(err.message);
            res.status(500).send('Server error - try again');
    };

});

module.exports = router;