const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc     Register new User
// @route    POST /api/users
// @acess    Public
const registerUser = asyncHandler(async(req,res) => {
    const {name, password, email} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all field')
    }

    // Check if user exist
    const userExist = await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error('User Already exist')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
        
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc     Authenticate an User
// @route    POST /api/users/login
// @acess    Public
const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body

    //Check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid credentials')
    }

    res.json({ message: 'Login User'});
})

// @desc     Get User data
// @route    GET /api/users/me
// @acess    Public
const getMe = asyncHandler(async(req,res) => {
    res.status(200).json(req.user)
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}