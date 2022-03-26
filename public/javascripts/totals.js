const finance = require('./percent')
const totalExpense = require('./totalExpense')

function totals(year, budgets) {
    let  totalIncome = 0, totalExpenses = 0, totalWants = 0, totalSavings = 0;
    for (let budget of budgets) {
        if (year !== 'undefined' && year) {
            if (budget.year === parseInt(year)) {
                const totalAddedExpenses = totalExpense(budget.expenses)
                const finances = finance(budget.income, totalAddedExpenses);
                if (finances.budget) {
                    totalIncome += budget.income
                    totalExpenses += finances.budget.expenses
                    totalWants += finances.budget.wants
                    totalSavings += finances.budget.savings
                }
            }
        } else {
            const totalAddedExpenses = totalExpense(budget.expenses)
            const finances = finance(budget.income, totalAddedExpenses);
            if (finances.budget) {
                totalIncome += budget.income
                totalExpenses += finances.budget.expenses
                totalWants += finances.budget.wants
                totalSavings += finances.budget.savings
            }
        }
    }
    let resultTotals = { totalIncome, totalExpenses, totalWants, totalSavings };
    return resultTotals;
}

module.exports = totals;