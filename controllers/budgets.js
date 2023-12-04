const Budget = require('../models/budget');
const Goal = require('../models/goal');
const Debt = require('../models/debt');

const percent = require('percent-value');
const finance = require('../public/javascripts/percent')
const totals = require('../public/javascripts/totals')
const totalExpense = require('../public/javascripts/totalExpense')
const assetAllocation = require('../public/javascripts/assetAllocation')
const ExpressError = require('../utils/ExpressError');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


module.exports.index = async (req, res) => {
    if (req.user){
        const budgets = await Budget.find().sort({ _id: 'descending' }).where('author').equals(req.user._id);
        const goals = await Goal.find().sort({ _id: 'descending' }).where('author').equals(req.user._id);
        const debts = await Debt.find().sort({ _id: 'descending' }).where('author').equals(req.user._id);
        const years = await Budget.find().distinct('year').where('author').equals(req.user._id);
        const resultTotals = totals(req.query.year, budgets);
        res.render('budgets/index.ejs', { budgets, finance, goals, debts, years, resultTotals, totalExpense, req, percent });
    } else {
        res.render('home.ejs')
    }
}

module.exports.renderNewBudget = (req, res) => {
    res.render('budgets/new', { months });
}

module.exports.renderEditBudget = async (req, res) => {
    const { id } = req.params;
    const budget = await Budget.findById(id);
    if (!budget) {
        req.flash('error', 'Cannot find that budget!');
        return res.redirect('/incomehack');
    }
    res.render('budgets/edit.ejs', { budget, months });
}

module.exports.createBudget = async (req, res) => {
    const newBudget = new Budget(req.body);
    newBudget.author = req.user._id;
    const totalExpenses = totalExpense(newBudget.expenses)
    if (totalExpenses > newBudget.income) {
        throw new ExpressError('Expenses cannot be greater than income', 406)
    }
    await newBudget.save();
    req.flash('success', 'Successfully added a new budget!');
    res.redirect(`/incomehack/${newBudget._id}`);
}

module.exports.updateBudget = async (req, res) => {
    const { id } = req.params;
    const newBudget = new Budget(req.body);
    const totalExpenses = totalExpense(newBudget.expenses)
    if (totalExpenses > newBudget.income) {
        throw new ExpressError('Expenses cannot be greater than income', 406)
    }
    const updatedBudget = await Budget.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated budget!');
    res.redirect(`/incomehack/${updatedBudget._id}`)
}

module.exports.deleteBudget = async (req, res) => {
    const { id } = req.params;
    await Budget.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted budget!');
    res.redirect('/incomehack');
}

module.exports.showBudget = async (req, res) => {
    const { id } = req.params;
    const risk = req.user.risk;
    const budget = await Budget.findById(id);
    if (!budget) {
        req.flash('error', 'Cannot find that budget!');
        return res.redirect('/incomehack');
    }
    const totalExpenses = totalExpense(budget.expenses)
    const finances = finance(budget.income, totalExpenses);
    const asset = assetAllocation(finances.budget.savings, risk);
    res.render('budgets/show.ejs', { budget, finances, percent, asset });
}
