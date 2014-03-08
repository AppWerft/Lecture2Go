exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').videorow
		},
		defaultItemTemplate : 'row'
	});
	self.add(self.listview);
	self.update = function() {
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videohomepage/window').create(_e.itemId);
		win.open();
	});
	return self;
};
