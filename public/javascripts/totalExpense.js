function totalExpense(obj) {
    if (obj) return Object.values(obj).reduce((a, b) => a + b);
}

module.exports = totalExpense;