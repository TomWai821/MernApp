const express = require('express')
const router = express.Router()
const { getGoals, setGoal, updateGoal, deleteGoal } = require('../controllers/goalController')
const { protect } = require('../middleware/authMiddleware')

// Get(getGoal) and Post(setGoal) the goal
router.route('/').get(protect, getGoals).post(protect, setGoal)
// Delete(deleteGoal) and Put(updateGoal) the goal
router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

module.exports = router