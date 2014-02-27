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
		console.log('++++++++++++');
		console.log(options);
		Ti.App.Lecture2Go.getVideoList({
			key : options.key,
			value : options.value,
			min : 0,
			max : 150,
			onload : function(_data) {
				console.log(_data);
				var data = [];
				for (var i = 0; i < _data.videos.length; i++) {
					var item = {
						title : {
							text : _data.videos[i].title
						},
						subtitle : {
							text : _data.videos[i].author
						},
						thumb : {
							image : _data.videos[i].thumb
						},
						duration : {
							text : parseInt(_data.videos[i].duration.split(':')[0] * 60) + parseInt(_data.videos[i].duration.split(':')[1]) + ' min.'
						},
						properties : {
							//	selectionStyle : TiTi.UI.iPhone.ListViewCellSelectionStyle.NONE,
							allowsSelection : true,
							itemId : _data.videos[i].id,
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
	Ti.App.addEventListener('app:ready', function() {
		self.update();
	});
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videohomepage.window').create(_e.itemId);
		win.open();
	});
	console.log('OPTIONDS');
	console.log(options);
	if (options.value) {
		self.update();
	}	
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				var abextras = require('com.alcoapps.actionbarextras');
				abextras.setExtras({
					title : options.title,
					subtitle : options.subtitle
				});
				if (options.value) {
					activity.actionBar.setDisplayHomeAsUp(true);
					activity.actionBar.onHomeIconItemSelected = function() {
						self.close();
					};
				}
			}
		}
	});
	return self;
};
