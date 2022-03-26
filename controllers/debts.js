const Debt = require('../models/debt');
const ExpressError = require('../utils/ExpressError');


module.exports.redirectDebt =  (req, res) => {
    res.redirect('debt/new');
}

module.exports.renderNewDebt = (req, res) => {
    res.render('debts/new.ejs')
}

module.exports.renderEditDebt =  async(req, res) => {
    const { id } = req.params;
    const debt = await Debt.findById(id);
    if (!debt) {
        req.flash('error', 'Cannot find that debt!');
        return res.redirect('/incomehack');
    }
    res.render('debts/edit.ejs', { debt });
}

module.exports.createDebt = async (req, res) => {
    const newDebt = new Debt(req.body)
    newDebt.author = req.user._id;
    if (newDebt.repayed > newDebt.amount) {
        throw new ExpressError('Amount to be repayed cannot be greater than debt amount', 406)
    }
    if (newDebt.repayed === '' || newDebt.repayed === null) {
        newDebt.repayed = 0;
    }
    await newDebt.save();
    req.flash('success', 'Successfully added a new debt!');
    res.redirect('/incomehack');
}

module.exports.updateDebt = async(req, res) => {
    const { id } = req.params;
    const updatedDebt = new Debt(req.body)
    if (updatedDebt.repayed > updatedDebt.amount) {
        throw new ExpressError('Amount to be repayed cannot be greater than debt amount', 406)
    }
    if (updatedDebt.repayed === '' || updatedDebt.repayed === null) {
        updatedDebt.repayed = 0;
    }
    await Debt.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated debt!');
    res.redirect('/incomehack')
}

module.exports.repayDebt = async (req, res) => {
    const { id } = req.params;
    const { addRepayed } = req.body;
    const debt = await Debt.findById(id);
    debt.repayed += parseInt(addRepayed);
    if (addRepayed < 0) {
        throw new ExpressError('Amount to be repayed cannot be negative', 406)
    }
    if (debt.repayed > debt.amount) {
        throw new ExpressError('Amount to be repayed cannot be greater than debt amount', 406)
    }
    await Debt.findByIdAndUpdate(id, { $set: { repayed: debt.repayed } }, { runValidators: true, new: true })
    if (debt.repayed === debt.amount) {
        req.flash('success', `Congratulations! You have completely repayed your debt ${debt.debt}!`);
    } else {
        req.flash('success', `Successfully added repayed amount to debt ${debt.debt}!`);
    }
    res.redirect('/incomehack');
}

module.exports.completeDebt = async(req, res) => {
    const { id } = req.params;
    const debt = await Debt.findById(id);
    debt.repayed = debt.amount;
    await Debt.findByIdAndUpdate(id, { $set: { repayed: debt.repayed }} , { runValidators: true, new: true })
    req.flash('success', `Congratulations! You have completely repayed your debt ${debt.debt}!`);
    res.redirect('/incomehack')
}

module.exports.deleteDebt = async (req, res) => {
    const { id } = req.params;
    await Debt.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted debt!');
    res.redirect('/incomehack')
}