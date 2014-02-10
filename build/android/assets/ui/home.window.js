exports.create = function(type) {
	var RATIO = 16 / 9;
	var w = Ti.Platform.displayCaps.platformWidth;
	var menueitems = require('modules/menueitems').list;
	var rightnavi = Ti.UI.createImageView({
		image : '/assets/trip.png'
	});
	rightnavi.menue = require('modules/optionsmenue').create({
		active : false,
		onclick : function(_key) {
			rightnavi.fireEvent('click', {});
			updateListview(_key);
		},
		right : 12,
		items : menueitems
	});
	var self = require('modules/l2g').create({
		title : (type == 'latest') ? 'Lecture2Go Mobile' : 'Lecture2Go Mobile',
		rightnavi : rightnavi
	});
	return self;
	var template = {
		first : require('modules/parts/templates').firstvideorow,
		even : require('modules/parts/templates').videorow,
		odd : JSON.parse(JSON.stringify(require('modules/parts/templates').videorow)),
	};
	template.odd.childTemplates[0].properties.backgroundColor = '#ddd';
	template.odd.childTemplates[0].properties.color = '#222';
	self.listview = Ti.UI.createListView({
		top : w / 6,
		templates : {
			'even' : template.even,
			'odd' : template.odd,
			'first' : template.first
		},
		defaultItemTemplate : 'first'
	});
	self.listview.addEventListener('click', function(_e) {
		console.log(_e);
		var eventwindow = require('ui/event.window').create(JSON.parse(_e.itemId));
		eventwindow.open();
		
	});
	self.add(self.listview);
	//require('ui/home.listview').update(self.listview);
	return self;
};
