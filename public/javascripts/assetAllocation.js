const percent = require('percent-value');

function allocation(savings, risk) {
	if (risk === 'Low') {
		let mutualFunds = percent(10).get(savings);
		let stocks = percent(10).get(savings);
		let liquidSavings = percent(15).get(savings);
		let emergencyFund = percent(25).get(savings);
		let fixedDeposit = percent(40).get(savings);
		let asset = { mutualFunds, stocks, liquidSavings, emergencyFund, fixedDeposit };
		return asset;
	} else if (risk === 'Moderate') {
		let mutualFunds = percent(23).get(savings);
		let stocks = percent(23).get(savings);
		let liquidSavings = percent(9).get(savings);
		let emergencyFund = percent(25).get(savings);
		let fixedDeposit = percent(20).get(savings);
		let asset = { mutualFunds, stocks, liquidSavings, emergencyFund, fixedDeposit };
		return asset;
	} else if (risk === 'High') {
		let mutualFunds = percent(40).get(savings);
		let stocks = percent(25).get(savings);
		let liquidSavings = percent(5).get(savings);
		let emergencyFund = percent(25).get(savings);
		let fixedDeposit = percent(5).get(savings);
		let asset = { mutualFunds, stocks, liquidSavings, emergencyFund, fixedDeposit };
		return asset;
	}
}

module.exports = allocation;
