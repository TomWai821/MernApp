const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc     Get goals
// @route    GET /api/goals
// @acess    Private
const getGoals = asyncHandler(async(req,res) => {
    const goals = await Goal.find({ user: req.user.id })

    res.status(200).json(goals);
})

// @desc     Set goals
// @route    POST /api/goals
// @acess    Private
const setGoal = asyncHandler(async(req,res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json({message: goal});
})

// @desc     Update goals
// @route    PUT /api/goals/:id
// @acess    Private
const updateGoal = asyncHandler(async(req,res) => {
    const goal = await Goal.findById(req.params.id)

    // Check for goal
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await UserActivation.findById(req.user.id)

    // Check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

  

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(updatedGoal);
})

// @desc     Delete goals
// @route    DELETE /api/goals/:id
// @acess    Private
const deleteGoal = asyncHandler(async(req,res) => {
    const goal = await goal.findById(req.params.id)

    if(!goal){
        throw new Error('Goal not found')
    }

    await goal.remove()

    res.status(200).json({ id: req.params.id });
})

module.exports = {
    getGoals, 
    setGoal, 
    updateGoal, 
    deleteGoal
}