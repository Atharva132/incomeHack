const express = require('express');
const router = express.Router({ mergeParams: true });
const goals = require('../controllers/goals');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateGoal, isGoalAuthor } = require('../middleware');


router.route('/')
    .get(isLoggedIn, goals.redirectGoal)
    .post(isLoggedIn, validateGoal, catchAsync(goals.createGoal))

router.get('/new', isLoggedIn, goals.renderNewGoal)

router.route('/:id')
    .put(isLoggedIn, isGoalAuthor, validateGoal, catchAsync(goals.updateGoal))
    .patch(isLoggedIn, isGoalAuthor, catchAsync(goals.addGoal))
    .delete(isLoggedIn, isGoalAuthor, catchAsync(goals.deleteGoal))

router.get('/:id/edit', isLoggedIn, isGoalAuthor, catchAsync(goals.renderEditGoal))

router.patch('/complete/:id', isLoggedIn, isGoalAuthor, catchAsync(goals.completeGoal))


module.exports = router;