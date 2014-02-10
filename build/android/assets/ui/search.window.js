exports.create = function(_video) {
	var w = Ti.Platform.displayCaps.platformWidth;
	
	var rows = [], carouselViews = [];
	var self = require('modules/l2g').create({
		title : 'VideoSuche',
		back : false,
	});
	self.scanner = require('modules/parts/scanbutton').create({
		onsuccess : function(_e) {
			self.tab.open(require('ui/videoplayer.window').create(_e));
		}
	});
	//self.navbar.add(self.scanner);
	
	self.search = Titanium.UI.createSearchBar({
		barColor : '#000',
		showCancel : true,
		height : w / 6,
		hintText : 'Suchbegriff',
		top : w / 6,
	});

	self.add(self.search);
	self.dummy = Ti.UI.createTableView({
		search : self.search
	});

	// Controls :
	self.search.addEventListener('cancel', function() {
		self.search.blur();
	});
	self.search.addEventListener('focus', function() {
		self.search.setValue('');

	});
	self.search.add(self.scanner);
	self.search.addEventListener('return', function() {
		carouselViews = [];
		self.search.blur();
		Ti.App.Model.search({
			needle : self.search.value,
			limit : 50,
			onsuccess : function(_data) {
				for (var i = 0; i < _data.length; i++) {
	//				carouselViews[i] = require('modules/parts/movieview').create(_data[i], i);
				}
				//self.tv.setData(rows);
	//			self.pagination.setTotal(carouselViews.length);
			}
		});
	});
	return self;
};
