exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	var layer = Ti.UI.createView({
		top : 0,
		height : '100dp'
	});

	self.listview = Ti.UI.createListView({
		top:'1	0dp',
		templates : {
			'row' : require('ui/TEMPLATES').lastvideorow
		},
		defaultItemTemplate : 'row',
		sections : [Ti.UI.createListSection()]
	});
	self.add(self.listview);
	function updateList () {
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
						},
						properties : {
							itemId : data.videoid,
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
						}
					});
					console.log(data);
				}
				self.listview.sections[0].setItems(dataitems);
			}
		});
		
	}
	
	self.addEventListener('focus', updateList);
	self.listview.addEventListener('itemclick', function(_e) {
		require('ui/videohomepage/window').create(_e.itemId).open();

	});
	self.add(layer);
	layer.addEventListener('swipe', function(_e) {
		if (_e.direction == 'down') {
			Ti.UI.createNotification({
				message : 'Erneuere die Liste …'
			}).show();
			updateList();
		}
	});
	return self;
};

