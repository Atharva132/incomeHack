const express = require('express');
const router = express.Router();
const budgets = require('../controllers/budgets');

const catchAsync = require('../utils/catchAsync');
const validateBudget = require('../middleware');
const { isLoggedIn, isBudgetAuthor } = require('../middleware');


router.route('/')
    .get(catchAsync(budgets.index))
    .post(isLoggedIn, validateBudget, catchAsync(budgets.createBudget))

router.get('/new', isLoggedIn, budgets.renderNewBudget)

router.route('/:id')
    .get(isLoggedIn, isBudgetAuthor, catchAsync(budgets.showBudget))
    .put(isLoggedIn, isBudgetAuthor, validateBudget, catchAsync(budgets.updateBudget))
    .delete(isLoggedIn, isBudgetAuthor, catchAsync(budgets.deleteBudget))

router.get('/:id/edit', isLoggedIn, isBudgetAuthor, catchAsync(budgets.renderEditBudget))



module.exports = router;