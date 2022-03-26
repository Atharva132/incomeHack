const express = require('express');
const router = express.Router({ mergeParams: true });
const debts = require('../controllers/debts');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateDebt, isDebtAuthor } = require('../middleware');


router.route('/')
    .get(isLoggedIn, debts.redirectDebt)
    .post(isLoggedIn, validateDebt, catchAsync(debts.createDebt))

router.get('/new', isLoggedIn, debts.renderNewDebt)

router.route('/:id')
    .put(isLoggedIn, isDebtAuthor, validateDebt, catchAsync(debts.updateDebt))
    .patch(isLoggedIn, isDebtAuthor, catchAsync(debts.repayDebt))
    .delete(isLoggedIn, isDebtAuthor, catchAsync(debts.deleteDebt))

router.get('/:id/edit', isLoggedIn, isDebtAuthor, catchAsync(debts.renderEditDebt))

router.patch('/complete/:id', isLoggedIn, isDebtAuthor, catchAsync(debts.completeDebt))



module.exports = router;