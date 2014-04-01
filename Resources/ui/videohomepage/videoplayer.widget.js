exports.create = function() {
	function startVideo() {
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
				Ti.Android.Activity	 && Ti.Android.Activity.finish();
			};
		});
	}
	// start of code:
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
	Ti.App.Apiomat.setWatchedVideo({
		video : videodata
	});
	startVideo();
	return;
	require('controls/geolocation.question').create(undefined, {
		onallowed : function() {
			Ti.App.Apiomat.setWatchedVideo({
				video : videodata
			});
			startVideo();
		},
		ondisallowed : startVideo
	});

	/*
	 videoplayer.addEventListener('fullscreen', function(e) {
	 if (e.entering == 0) {
	 win.close();
	 };
	 });*/
};
