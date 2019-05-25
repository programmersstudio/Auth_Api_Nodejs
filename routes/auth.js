const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// async call because it will take some time to save in database and we dont want our programm to move forward without completing this step
router.post('/register', async (req, res)=>{

    //data validation begins
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user already exists in database
    const emailAlreadyExists = await User.findOne({ email: req.body.email});
    if( emailAlreadyExists) return res.status(400).send('Email already exists');

    //hash passwords  --  await -- because this can take some time.
    const salt = await bcrypt.genSalt(10);
    const hashedPasswords = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasswords
    });

    try{
        const savedUser = await user.save();
        // res.send(savedUser);
        // sending only userId
        res.send({
            user: savedUser._id
        });
    }catch(err){
        res.status(400).send(err);
    }

});


//Login
router.post('/login', async (req,res) =>{

    //data validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user already exists in database
    const user = await User.findOne({ email: req.body.email});
    if( !user) return res.status(400).send('Email or Password is wrong!');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    // generate JWT token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SCERET);
    res.header('auth-token', token).send(token);

    // res.send('Success!!');

});

module.exports = router;