$(document).ready(function() {
	var pending = false;

	var calculator = new Calculator('#to-currency', '#amount', '#cost');

	$('#from-currency').on('change', function() {
		if (pending) { return; }

		var fromCurrency = $(this).val();
		var searchData = new SearchData();
		searchData.fetch(fromCurrency)
		.then(function (results) {
			$('.selected-currency').text(fromCurrency);
			calculator.setRates(results.rates);
			pending = false;
		});
	});

	$('#from-currency').change();
});

var SearchData = function() {};
SearchData.prototype.fetch = function(query) {
	var dfd;

	if (!query) {
		dfd = $.Deferred();
		dfd.resolve([]);
		return dfd.promise();
	}

	return $.ajax('http://api.fixer.io/latest', {
		data : { base: query },
		dataType: 'json'
	}).pipe(function(res) {
		return res;
	});
};

var Calculator = function(toElem, amountElem, costElem) {
	var self = this;
	this.toElem = $(toElem);
	this.amountElem = $(amountElem);
	this.costElem = $(costElem);
	this.rates = {};
	this.rate = 1;
	this.amount = this.amountElem.val();
	
	this.toElem.on('change'+'.calculator', function(event) {
		self.changeRate($(this).val());
	});
	this.amountElem.on('input'+'.calculator', function(event) {
		self.changeAmount($(this).val());
	});
	this.changeRate = function(toCurrency) {
		self.rate = self.rates[toCurrency];
		self.updateCost();
	};
	this.changeAmount = function(amount) {
		self.amount = amount;
		self.updateCost();
	};
	this.setRates = function(results) {
		self.rates = results;
		self.toElem.change();
	};
	this.calculate = function() {
		var cost = (self.amount*self.rate).toFixed(2);
		return cost.toLocaleString('en-AU', {style:'currency', currency:'AUD'});
	};
	this.updateCost = function() {
		self.costElem.val(self.calculate());
	}
};

