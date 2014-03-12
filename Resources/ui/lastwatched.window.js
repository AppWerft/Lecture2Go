exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').lastvideorow
		},
		defaultItemTemplate : 'row',
		sections : [Ti.UI.createListSection()]
	});
	self.add(self.listview);
	self.addEventListener('focus', function() {
		Ti.App.Apiomat.getAllWatchedVideos(undefined, {
			onload : function(_data) {
				var pindata;
				var dataitems = [];
				while ( data = _data.pop()) {
					dataitems.push({
						title : {
							text : data.title
						},
						thumb : {
							image : data.thumb
						},
						devicename : {
							text : data.devicename
						},
						time : {
							text : data.atime
						}
					});
				}
				self.listview.sections[0].setItems(dataitems);
			}
		});
	});
	return self;
};

