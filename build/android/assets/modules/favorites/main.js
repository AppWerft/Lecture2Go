exports.create = function(title) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = require('/modules/l2g').create({
		title : title
	});
	self.tv = require('modules/parts/tableview').create();
	self.add(self.tv);
	var sections = [];
	sections[0] = require('/modules/parts/section').create('channel', 'meine gemerkten Videos (Lieblingsfilme)');
	sections[1] = require('/modules/parts/section').create('movie', 'meine Podcasts (MP3) (für Offlinegebrauch)');
	sections[2] = require('/modules/parts/section').create('movie', 'meine letztgesehenen Videos');
	self.tv.setData(sections);

	Ti.App.addEventListener('favs_changed', function(_data) {
		var rows = [];
		var videos = _data.videos;
		while (sections[0].rowCount) {
			self.tv.data[0].remove(sections[0].rows[0]);
		}
		for (var i = 0; i < videos.length; i++) {
			var row = require('modules/parts/movierow').create(videos[i], i);
			row.add(row.content);
			sections[0].add(row);
		}
		self.tv.setData(sections);
	});

	Ti.App.addEventListener('recentmovies_changed', function(_data) {
		var rows = [];
		var videos = _data.videos;
		while (sections[2].rowCount) {
			self.tv.data[2].remove(sections[2].rows[0]);
		}
		for (var i = 0; i < videos.length; i++) {
			var row = require('modules/parts/movierow').create(videos[i], i);
			row.add(row.content);
			sections[2].add(row);
		}
		self.tv.setData(sections);
	});
	self.tv.addEventListener('click', function(e) {
		self.tab.open(require('modules/videoplayer/main').create(e.rowData.link), {
			animated : true
		});
	});

	return self;
};
