const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.budgetSchema = Joi.object({
	month: Joi.string()
		.required()
		.valid(
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		).escapeHTML(),
	year: Joi.number().required(),
	income: Joi.number().required().min(0),
	expenses: Joi.object({
		rent: Joi.number().min(0).allow('', null),
		mortgage: Joi.number().min(0).allow('', null),
		travel: Joi.number().min(0).allow('', null),
		groceries: Joi.number().min(0).allow('', null),
		utilities: Joi.number().min(0).allow('', null),
		education: Joi.number().min(0).allow('', null),
		loans: Joi.number().min(0).allow('', null),
		insurances: Joi.number().min(0).allow('', null),
		personal: Joi.number().min(0).allow('', null),
		misc: Joi.number().min(0).allow('', null)
	}).optional()
});

module.exports.goalSchema = Joi.object({
	goal: Joi.string().required().escapeHTML(),
	target: Joi.number().required().min(0),
	amount: Joi.number().min(0).allow('', null).default(0)
});

module.exports.debtSchema = Joi.object({
	debt: Joi.string().required().escapeHTML(),
	amount: Joi.number().required().min(0),
	repayed: Joi.number().min(0).allow('', null).default(0)
});

module.exports.userSchema = Joi.object({
	username: Joi.any().required(),
	email: Joi.string().email().required().escapeHTML(),
	password: Joi.any().required(),
	risk: Joi.string().required().valid('Low', 'Moderate', 'High').escapeHTML()
});
