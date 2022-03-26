const mongoose = require('mongoose');
const Budget = require('./models/budget');

mongoose.connect('mongodb://localhost:27017/budget')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    const seedBudget = [
        {
            month: 'january',
            year: 2022,
            income: 100000,
            expenses: {
                rent: 20000,
                fuel: 10000,
                groceries: 3000,
                insurance: 5000,
                misc: 2000
            }
        },
        {
            month: 'february',
            year: 2022,
            income: 120000,
            expenses: {
                rent: 20000,
                fuel: 10000,
                groceries: 3000,
                insurance: 10000,
                misc: 10000
            }
        },
        {
            month: 'march',
            year: 2022,
            income: 100000,
            expenses: {
                rent: 20000,
                fuel: 10000,
                groceries: 3000,
                insarance: 15000,
                misc: 20000
            }
        },
        {
            month: 'april',
            year: 2022,
            income: 100000,
            expenses: {
                rent: 20000,
                fuel: 10000,
                groceries: 30000,
                insurance: 15000,
                misc: 20000
            }
        },
    ]
    
    Budget.insertMany(seedBudget)
        .then(res => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
        })