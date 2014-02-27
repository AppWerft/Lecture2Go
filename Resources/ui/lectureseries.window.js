exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').videorow,
		},
		defaultItemTemplate : 'row'
	});
	self.add(self.listview);
	self.update = function() {
		Ti.App.Lecture2Go.getLectureseriesByTreeId({
			id : options.id,
			onload : function(_data) {
				var data = [];
				for (var i = 0; i < _data.lectureseries.length; i++) {
					var item = {
						title : {
							text : _data.lectureseries[i].name
						},
						subtitle : {
							text : _data.lectureseries[i].instructors
						},
						thumb : {
							image : _data.lectureseries[i].thumb
						},
						properties : {
							itemId : JSON.stringify({
								id : _data.lectureseries[i].lectureseriesid,
								title : _data.lectureseries[i].name
							}),
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
						}
					};
					data.push(item);
				}
				var section = Ti.UI.createListSection();
				section.setItems(data);
				self.listview.sections = [section];
			}
		});
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videolist.window').create({
			key : 'lectureseries',
			value : JSON.parse(_e.itemId).id,
			title : 'Videos der Vorlesungsreihe',
			subtitle : JSON.parse(_e.itemId).title
		}).open();
	});
	self.update();
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				var abextras = require('com.alcoapps.actionbarextras');
				abextras.setExtras({
					title : 'Vorlesungsreihen',
					subtitle : options.title,
					backgroundColor : '#ff4f00'
				});
				activity.actionBar.setDisplayHomeAsUp(true);
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		}
	});
	return self;
};
