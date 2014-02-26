exports.create = function() {
	var options = arguments[0] || {};
	var self = Ti.UI.createView({
		height : Ti.UI.SIZE,

		top : '3dp'

	});
	self.add(Ti.UI.createLabel({
		color : '#999',
		bottom : 0,
		left : '5dp',
		width : '85dp',
		font : {
			fontSize : '10dp'
		},
		text : options.label
	}));
	self.add(Ti.UI.createLabel({
		color : '#ccc',
		top : 0,
		left : '90dp',
		font : {
			fontSize : '14dp'
		},
		text : options.value
	}));

	return self;
};
