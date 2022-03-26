const { budgetSchema, goalSchema, debtSchema, userSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Budget = require('./models/budget');
const Debt = require('./models/debt');
const Goal = require('./models/goal');

const validateBudget = (req, res, next) => {
	const { error } = budgetSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports = validateBudget;

module.exports.validateDebt = (req, res, next) => {
	const { error } = debtSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.validateGoal = (req, res, next) => {
	const { error } = goalSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.validateUser = (req, res, next) => {
	const { error } = userSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in first!');
		return res.redirect('/login');
	}
	next();
};

module.exports.isBudgetAuthor = async (req, res, next) => {
	const { id } = req.params;
	const budget = await Budget.findById(id);
	if (!budget.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/incomehack`);
	}
	next();
};

module.exports.isDebtAuthor = async (req, res, next) => {
	const { id } = req.params;
	const debt = await Debt.findById(id);
	if (!debt.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/incomehack`);
	}
	next();
};

module.exports.isGoalAuthor = async (req, res, next) => {
	const { id } = req.params;
	const goal = await Goal.findById(id);
	if (!goal.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/incomehack`);
	}
	next();
};
