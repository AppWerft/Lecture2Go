exports.create = function() {
	var videodata = arguments[0] || {};
	if (Ti.Network.online == false)
		return;
	if (videodata.videouri.mp4) {
		url = videodata.videouri.mp4;
		Ti.Android && Ti.UI.createNotification({
			message : 'Lade MP4 in den Player'
		}).show();
	} else {
		url = videodata.videouri.rtsp;
		Ti.Android && Ti.UI.createNotification({
			message : 'Streame Video mit rtsp'
		}).show();
	}
	var videoplayer = Ti.Media.createVideoPlayer({
		autoplay : true,
		fullscreen : true,
		backgroundColor : '#333',
		url : url,
		mediaControlStyle : Ti.Media.VIDEO_CONTROL_DEFAULT,
		scalingMode : Ti.Media.VIDEO_MODE_FILL
	});
	videoplayer.addEventListener('playbackstate', function(_e) {
		console.log(_e.playbackState);
	});
	videoplayer.addEventListener('complete', function(e) {
		if (e.reason == 0) {
			win.close();
		};
	});
	Ti.App.Apiomat.setWatchedVideo({
		video : videodata
	});
	/*
	 videoplayer.addEventListener('fullscreen', function(e) {
	 if (e.entering == 0) {
	 win.close();
	 };
	 });*/
};
