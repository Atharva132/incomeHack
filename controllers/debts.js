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
    if (newDebt.repaid > newDebt.amount) {
        throw new ExpressError('Amount to be repaid cannot be greater than debt amount', 406)
    }
    if (newDebt.repaid === '' || newDebt.repaid === null) {
        newDebt.repaid = 0;
    }
    await newDebt.save();
    req.flash('success', 'Successfully added a new debt!');
    res.redirect('/incomehack');
}

module.exports.updateDebt = async(req, res) => {
    const { id } = req.params;
    const updatedDebt = new Debt(req.body)
    if (updatedDebt.repaid > updatedDebt.amount) {
        throw new ExpressError('Amount to be repaid cannot be greater than debt amount', 406)
    }
    if (updatedDebt.repaid === '' || updatedDebt.repaid === null) {
        updatedDebt.repaid = 0;
    }
    await Debt.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated debt!');
    res.redirect('/incomehack')
}

module.exports.repayDebt = async (req, res) => {
    const { id } = req.params;
    const { addrepaid } = req.body;
    const debt = await Debt.findById(id);
    debt.repaid += parseInt(addrepaid);
    if (addrepaid < 0) {
        throw new ExpressError('Amount to be repaid cannot be negative', 406)
    }
    if (debt.repaid > debt.amount) {
        throw new ExpressError('Amount to be repaid cannot be greater than debt amount', 406)
    }
    await Debt.findByIdAndUpdate(id, { $set: { repaid: debt.repaid } }, { runValidators: true, new: true })
    if (debt.repaid === debt.amount) {
        req.flash('success', `Congratulations! You have completely repaid your debt ${debt.debt}!`);
    } else {
        req.flash('success', `Successfully added repaid amount to debt ${debt.debt}!`);
    }
    res.redirect('/incomehack');
}

module.exports.completeDebt = async(req, res) => {
    const { id } = req.params;
    const debt = await Debt.findById(id);
    debt.repaid = debt.amount;
    await Debt.findByIdAndUpdate(id, { $set: { repaid: debt.repaid }} , { runValidators: true, new: true })
    req.flash('success', `Congratulations! You have completely repaid
    your debt ${debt.debt}!`);
    res.redirect('/incomehack')
}

module.exports.deleteDebt = async (req, res) => {
    const { id } = req.params;
    await Debt.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted debt!');
    res.redirect('/incomehack')
}