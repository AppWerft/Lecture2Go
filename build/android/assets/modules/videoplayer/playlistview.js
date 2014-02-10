exports.create = function(_video, _callback) {
	var views = [];
	Ti.App.Model.getPlaylistById(_video.channel.id, function(_videos) {
		for (var i = 0; i < _videos.length; i++) {
			views.push(require('modules/videoplayer/playerview').create(_videos[i]));
		}
		_callback({
			views : views,
			title : _video.title,
		});
	});
};
