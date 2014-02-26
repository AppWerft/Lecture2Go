exports.create = function() {
	var options = arguments[0] || {};
	var RATIO = 16 / 9;
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = require('modules/l2g').create();
	var template = {
		first : require('ui/TEMPLATES').firstvideorow,
		even : require('ui/TEMPLATES').videorow,
		odd : JSON.parse(JSON.stringify(require('ui/TEMPLATES').videorow)),
	};
	template.odd.childTemplates[0].properties.backgroundColor = '#ddd';
	template.odd.childTemplates[0].properties.color = '#222';

	self.listview = Ti.UI.createListView({
		templates : {
			'even' : template.even,
			'odd' : template.odd,
			'first' : template.first
		},
		defaultItemTemplate : 'first'
	});
	self.add(self.listview);
	self.update = function() {
		Ti.App.Lecture2Go.getVideoList({
			key : options.key,
			value : options.value,
			min : 0,
			max : 800,
			onload : function(_data) {
				var data = [];
				for (var i = 0; i < _data.videos.length; i++) {
					template = (i % 2) ? 'odd' : 'even';
					var item = {
						template : template,
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
	if (options.value) self.update();
	return self;
};
