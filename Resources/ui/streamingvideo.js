(function() {
	VideoStreamingTest.video = {};
	//Make sure in your app.js that you include this file...."Ti.include('streamingvideo.js');"

	//Call the below function from any basic window in your app.
	//For example, create a basic window in app.js
	//then call, "appname.video.playVideo();"
	//on some event - like clicking a button (addEventListener on the button)
	VideoStreamingTest.video.playVideo = function() {

		//OPEN VIDEO......................................
		var contentURL = '';

		if ((Ti.Platform.osname = 'iphone') || (Ti.Platform.osname = 'ipad' )) {

			//HTTP Live Streaming for iOS

			contentURL = 'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8';

		} else {

			//RTSTP for Android < 3.0

			contentURL = 'rtsp://xfox8newsx.is.livestream-api.com:1935/livestreamiphone/fox8news';

		}

		//Create video player

		var activeMovie = Titanium.Media.createVideoPlayer({

			url : contentURL,

			backgroundColor : '#111',

			scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,

		});

		var videoWin = Titanium.UI.createWindow({

			title : L('Video'),
			backgroundColor : '#fff',
			barColor : '#336699',

		});

		//If iOS 3.2 or above, add to Window - don't add for Android

		if (parseFloat(Titanium.Platform.version) >= 3.2) {
			videoWin.add(activeMovie);
		}

		var windowClosed = false;

		activeMovie.play();

		//If iOS 3.2 or above, you can open from the tab- don't do that for Android

		if (parseFloat(Titanium.Platform.version) >= 3.2) {

			tab1.open(videoWin);

		} else {

			videoWin.open();
		}

		//Adding my own custom event listener

		activeMovie.addEventListener('complete', function() {
			if (!windowClosed) {
				//Titanium.UI.createAlertDialog({title:'Movie', message:'Completed!'}).show();
			}

			activeMovie.remove
			activeMovie.release

			windowClosed = true;

			videoWin.close();
		});

	};
})(); 