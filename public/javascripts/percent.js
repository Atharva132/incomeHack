const percent = require('percent-value');

function finance(income) {

    let expenses = percent(50).get(income);
    let wants = percent(30).get(income);
    let savings = percent(20).get(income);

    const budget = { expenses, wants, savings };
    return budget;
}

function finance2(income, totalExpenses) {
    let budget = finance(income);
    if (totalExpenses < (percent(80).get(income)) && totalExpenses > (percent(50).get(income)) ) {
        let overExpense = totalExpenses - budget.expenses
        budget.wants -= overExpense
        budget.expenses = totalExpenses
        budget = { budget, msg: `Your expenses higher than 50% so decreased wants by ₹${overExpense}` };
        return budget;
    } else if (totalExpenses === income && income !== 0) {
        budget.expenses = totalExpenses;
        budget.savings = 0;
        budget.wants = 0;
        budget = { budget, msg: `Decrease your expenses and save some money` };
        return budget;
    } else if (totalExpenses > percent(80).get(income)) {
        let overExpense = (totalExpenses - budget.expenses);
        budget.wants -= overExpense;
        budget.savings += budget.wants;
        budget.wants = 0;
        budget.expenses = totalExpenses;
        budget = { budget, msg: `Your expenses higher than 80% so decreased savings by ₹${percent(20).get(income)- budget.savings} and no allocation to wants` };
        return budget;
    } else {
        extra = budget.expenses - totalExpenses;
        budget.savings += extra;
        budget.expenses = totalExpenses;
        budget = { budget };
        return budget;
    }
}

module.exports = finance2;