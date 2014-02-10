var Pagination = function() {
	this.ctime = '#'+(new Date().getTime()) % 100;
	this.countofpages = 0;
	this.view = Ti.UI.createView({
		bottom : 0,
		height : 15,
		backgroundColor : 'black',
		opacity : 0
	});
	this.view.button = Ti.UI.createView({
		backgroundColor : 'red',
		width : 15,
		borderRadius : 3,
		center : {
			x : 0,
			y : 0
		}
	});
	this.view.display = Ti.UI.createLabel({
		width : 50,
		right : 3,
		color : 'white',
		font : {
			fontSize : 12
		}
	});
	this.view.add(this.view.button);
	this.view.add(this.view.display);
	return this;
};

Pagination.prototype.setTotal = function(_total) {
	console.log('setTotal ' + this.ctime);
	if (_total > 0)
		this.countofpages = _total;
	this.view.animate({
		opacity : 1
	});
	this.view.button.setWidth(270 / this.countofpages);
	this.view.display.setText('1/' + this.countofpages);
	console.log('setTotal ' + this.countofpages);

};

Pagination.prototype.setPage = function(_pageindex) {
	console.log('setPage ' + this.ctime);
	console.log('setPage ' + this.countofpages);
	this.view.button.animate({
		center : {
			x : _pageindex / this.countofpages * 270,
			y : 0
		}
	});
	this.view.display.setText((_pageindex + 1) + '/' + this.countofpages);
};

Pagination.prototype.createView = function() {
	return this.view;
};

module.exports = Pagination;
