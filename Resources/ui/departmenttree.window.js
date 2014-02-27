exports.create = function() {
	var self = require('modules/l2g').create(), views = [];
	self.container = Ti.UI.createScrollableView({
		bottom : '20dp',
		showPagingControl : true
	});
	self.add(self.container);
	Ti.App.addEventListener('app:ready', function() {
		Ti.App.Lecture2Go.getTree({
			onload : function(_sections,_hits) {
				for (var key in _sections) {
					views.push(require('ui/departmenttree.listview').create(_sections[key],_hits));
				}
				self.container.setViews(views);
			}
		});
	});
	return self;
};
