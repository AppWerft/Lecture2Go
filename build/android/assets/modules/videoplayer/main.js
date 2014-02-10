exports.create = function(_video) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var TiCarousel = require("com.obscure.ticarousel");
	var carouselView;
	var rightnavi = Ti.UI.createImageView({
		image : '/assets/tripstar.png'
	});
	rightnavi.menue = require('modules/optionsmenue').create({
		active : false,
		right : 20,
		onclick : function() {
		},
		items : [{
			title : 'Video merken',
			icon : '/assets/menueicons/uhh-lectures.png'
		}, {
			title : 'Video speichern',
			icon : '/assets/menueicons/partner-lectures.png'

		}, {
			title : 'Video QR senden',
			icon : '/assets/menueicons/conference-lectures.png'

		}]
	});
	var self = require('modules/l2g').create({
		back : true,
		title : '',
		rightnavi : rightnavi

	}, function() {
		self.dialog.show();
	});
	self.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, Titanium.UI.FACE_UP, Titanium.UI.FACE_DOWN];
	self.add(rightnavi.menue);

	var paginationmodule = require('modules/parts/pagination');
	self.pagination = new paginationmodule();
	self.add(self.pagination.createView());

	carouselView = TiCarousel.createCarouselView({
		carouselType : TiCarousel.CAROUSEL_TYPE_CYLINDER,
		width : Ti.UI.FILL,
		top : w / 4,
		wrap : true,
		height : 360,
		numberOfVisibleItems : 12,
		itemWidth : 280,
		views : []
	});
	self.add(carouselView);
	carouselView.addEventListener('select', function(_e) {
		var playerwindow = require('modules/videoplayer/player_window').create(carouselViews[_e.selectedIndex].video);
		playerwindow.open();
		playerwindow.addEventListener('close', function() {
			self.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT];
			Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		});
		//		_parentwindow.tab.open(playerwindow);
	});
	carouselView.addEventListener('change', function(_e) {
		self.pagination.setPage(_e.currentIndex, carouselViews.length);
	});
	self.navtitle.text = _video.channel.description;
	Ti.App.Model.getPlaylistById({
		id : _video.channel.id,
		onload : function(_data) {
			carouselViews = [];
			for (var i = 0; i < _data.length; i++) {
				carouselViews[i] = require('modules/parts/moviepreview').create(_data[i], i);
			}
			//self.tv.setData(rows);
			carouselView.views = carouselViews;
			carouselView.reloadData();
			self.pagination.setTotal(carouselViews.length);
		}
	});
	return self;
};
