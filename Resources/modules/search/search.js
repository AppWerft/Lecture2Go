exports.create = function(_video) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var TiCarousel = require("com.obscure.ticarousel");
	var carouselView;

	var rows = [], carouselViews = [];
	var self = require('modules/l2g').create({
		title : 'VideoSuche',
		back : false,
	});
	self.scanner = require('modules/parts/scanbutton').create({
		onsuccess : function(_e) {
			self.tab.open(require('modules/videoplayer/main').create(_e));
		}
	});
	//self.navbar.add(self.scanner);
	var paginationmodule = require('modules/parts/pagination');
	self.pagination = new paginationmodule();
	self.add(self.pagination.createView());

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
	self.search.add(self.scanner)
	self.search.addEventListener('return', function() {
		carouselViews = [];
		self.search.blur();
		Ti.App.Model.search({
			needle : self.search.value,
			limit : 50,
			onsuccess : function(_data) {
				for (var i = 0; i < _data.length; i++) {
					carouselViews[i] = require('modules/parts/movieview').create(_data[i], i);
				}
				//self.tv.setData(rows);
				carouselView.views = carouselViews;
				carouselView.reloadData();
				self.pagination.setTotal(carouselViews.length);
			}
		});
	});
	carouselView = TiCarousel.createCarouselView({
		carouselType : TiCarousel.CAROUSEL_TYPE_TIME_MACHINE,
		width : Ti.UI.FILL,
		top : w / 3,
		wrap : true,
		height : 300,
		itemWidth : 280,
		views : []
	});

	self.add(carouselView);
	carouselView.addEventListener('select', function(_e) {
		console.log(carouselViews[_e.selectedIndex].video);
	});
	carouselView.addEventListener('change', function(_e) {
		self.pagination.setPage(_e.currentIndex, carouselView.length);
	});
	return self;
}
