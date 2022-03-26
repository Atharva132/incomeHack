const Goal = require('../models/goal');
const ExpressError = require('../utils/ExpressError');


module.exports.redirectGoal =  (req, res) => {
    res.redirect('goal/new');
}

module.exports.renderNewGoal = (req, res) => {
    res.render('goals/new.ejs')
}

module.exports.renderEditGoal =  async(req, res) => {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) {
        req.flash('error', 'Cannot find that goal!');
        return res.redirect('/incomehack');
    }
    res.render('goals/edit.ejs', { goal });
}

module.exports.createGoal = async (req, res) => {
    const newGoal = new Goal(req.body)
    newGoal.author = req.user._id;
    if (newGoal.amount > newGoal.target) {
        throw new ExpressError('Amount saved already cannot be greater than target amount', 406)
    }
    if (newGoal.amount === '' || newGoal.amount === null) {
        newGoal.amount = 0;
    }
    await newGoal.save();
    req.flash('success', 'Successfully added a new goal!');
    res.redirect(`/incomehack`);
}

module.exports.updateGoal = async(req, res) => {
    const { id } = req.params;
    const updatedGoal = new Goal(req.body)
    if (updatedGoal.amount > updatedGoal.target) {
        throw new ExpressError('Amount saved already cannot be greater than target amount', 406)
    }
    if (updatedGoal.amount === '' || updatedGoal.amount === null) {
        updatedGoal.amount = 0;
    }
    await Goal.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated goal!');
    res.redirect('/incomehack')
}

module.exports.addGoal = async (req, res) => {
    const { id } = req.params;
    const { addAmount } = req.body;
    const goal = await Goal.findById(id);
    goal.amount += parseInt(addAmount);
    if (addAmount < 0) {
        throw new ExpressError('Amount to be saved cannot be negative', 406)
    }
    if (goal.amount > goal.target) {
        throw new ExpressError('Amount saved cannot be greater than target amount', 406)
    }
    await Goal.findByIdAndUpdate(id, { $set: { amount: goal.amount }} , { runValidators: true, new: true })
    if (goal.amount === goal.target) {
        req.flash('success', `Congratulations! You have completed your goal ${goal.goal}!`);
    } else {
        req.flash('success', `Successfully added amount to goal ${goal.goal}!`);
    }
    res.redirect('/incomehack');
}

module.exports.completeGoal = async(req, res) => {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    goal.amount = goal.target;
    await Goal.findByIdAndUpdate(id, { $set: { amount: goal.amount }} , { runValidators: true, new: true })
    req.flash('success', `Congratulations! You have completed your goal ${goal.goal}!`);
    res.redirect('/incomehack')
}

module.exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    await Goal.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted goal!');
    res.redirect('/incomehack')
}