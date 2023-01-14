const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require("bcryptjs")
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult} = require('express-validator')
const User = require('../../../models/User.js')

router.post('/',[
    check('name', 'Name is required').notEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Password must be atlest 6 letters').isLength({min:6}),
], async (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    const { name, email , password} = req.body;

    try {
        
        let user = User.findOne({ email})

        if (!user) {
            return res.status(400).json({error : "user already exist"})
        }
        const avatar = gravatar.url(email,{
            s:200,
            r:'pg',
            d:'mm'
        })
        
        user = new User({
            name, 
            email,
            password,
            avatar
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt)

        await user.save();

        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token )=>{
            if (err) throw err;
            res.json( { token })
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send("server issue")
    }
    
 
    console.log(req.body)
});

module.exports = router;