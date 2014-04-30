var Apiomat = require('vendor/apiomat');
var AssetStorage = require('vendor/asset.storage');
var ImageCache = require('vendor/imagecache');
var CloudPush = require('ti.cloudpush');
var Cloud = require('ti.cloud');
var moment = require('vendor/moment');
moment.lang('de');

var myPushDeviceToken = null;

var saveCB = {
	onOk : function() {
	},
	onError : function(error) {
	}
};

///////////////////////////////////////
// Constructor: ///////////////////////
///////////////////////////////////////
var ApiomatAdapter = function() {
	var uid = (Ti.App.Properties.hasProperty('uid')) ? Ti.App.Properties.getString('uid') : Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress());
	Ti.App.Properties.setString('uid', uid);
	this.storage = new AssetStorage();
	this.user = new Apiomat.VideoUser();
	this.user.setUserName(uid);
	this.user.setPassword('mylittlesecret');
	var that = this;
	console.log('Info: start of retrieveDeviceToken()');
	CloudPush.debug = true;
	CloudPush.retrieveDeviceToken({
		success : function(e) {
			console.log('Info: deviceToken=' + e.deviceToken);
			CloudPush.enabled = true;
			myPushDeviceToken = e.deviceToken;
			Ti.App.Properties.setString('myPushDeviceToken', myPushDeviceToken);
			that.loginUser();
		},
		error : function(e) {
			console.log('=========================================CloudError:');
			console.log(e);
			that.loginUser();

		}
	});
};

ApiomatAdapter.prototype.ping = function() {
	var callbacks = arguments[1] || {};
	var xhr = Ti.Network.createHTTPClient({
		onload : callbacks.ononline,
		onerror : callbacks.onoffline
	});
	xhr.open('HEAD', 'https://apiomat.org/yambas/rest',true);
	xhr.send();
};

ApiomatAdapter.prototype.loginUser = function() {
	var that = this;
	var loaded = false;
	Apiomat.Datastore.configure(this.user);
	//that.getAllWatchedVideos();
	this.user.loadMe({
		onOk : function() {
			that.user.loadMyfavorites("order by createdAt", {
				onOk : function() {
					if (loaded == true)
						return;
					loaded = true;
					if (Ti.Android) {
						that.user.setRegistrationId(myPushDeviceToken);
					} else {
						that.user.setDeviceToken(myPushDeviceToken);
					}
					console.log('User getFav OK');
					var myfavorites = that.user.getMyfavorites();
					Ti.UI.createNotification({
						message : myfavorites.length + ' Favoriten geladen.'
					}).show();
				},
				onError : function(_err) {
					console.log(_err);
				}
			});
			that.user.loadMysubscribedchannels("order by createdAt", {
				onOk : function() {
					var mylectureseries = that.user.getMysubscribedchannels();
					Ti.UI.createNotification({
						message : mylectureseries.length + ' abonnierte Vorlesungsreihen geladen.'
					}).show();

				},
				onError : function(_err) {
					console.log(_err);
				}
			});
			Ti.App.fireEvent('app:apiomatuser_ready');
		},
		onError : function(error) {
			that.user.save(saveCB);
		}
	});
	return this;
};

/* this function will called from camera: */
ApiomatAdapter.prototype.saveUserPhoto = function(_args, _callbacks) {
	var that = this;
	this.user.postPhoto(_args.image, {
		onOk : function() {
			ImageCache.get({
				url : that.user.getPhotoURL(100, 100) + '&format=png'
			}, {
				onload : function(_image) {
					Ti.App.fireEvent('app:newphoto', {
						imageurl : _image
					});
				}
			});

		}
	});
};

ApiomatAdapter.prototype.getAllWatchedVideos = function(_args, _callbacks) {

	Apiomat.WatchedVideo.getWatchedVideos("order by createdAtlimit 100", {
		onOk : function(_res) {
			var bar = [];
			for (var i = 0; i < _res.length; i++) {
				if (_res[i].getLatlngLatitude()) {
					var video = JSON.parse(_res[i].data.video);
					bar.push({
						latitude : _res[i].getLatlngLatitude(),
						longitude : _res[i].getLatlngLongitude(),
						devicename : _res[i].getDevicename(),
						title : video.title,
						atime : moment(_res[i].getCreatedAt()).format('LLL'),
						thumb : video.thumb,
						videoid : video.id
					});
				}
			}
			_callbacks.onload(bar);
		},
		onError : function(error) {
			//handle error
		}
	});

};

/// Getter:
ApiomatAdapter.prototype.getStatusofVideo = function(_id) {
	var myfavorites = this.user.getMyfavorites();
	var faved = localsaved = watched = false;
	for (var i = 0; i < myfavorites.length; i++) {
		if (myfavorites[i].data.videoid == _id) {
			faved = true;
			break;
		}
	}
	return {
		faved : faved,
		localsaved : localsaved,
		watched : watched
	};
};

ApiomatAdapter.prototype.isChannelsubscribed = function(_id) {
	var mychannels = this.user.getMysubscribedchannels();
	for (var i = 0; i < mychannels.length; i++) {
		if (mychannels[i].data.lectureseriesId == _id) {
			return true;
		}
	}
	return false;
};

ApiomatAdapter.prototype.getMyFavorites = function(_args, _callbacks) {
	var myfavorites = this.user.getMyfavorites();
	for (var i = 0; i < myfavorites.length; i++) {
		myfavorites[i].video = JSON.parse(myfavorites[i].data.video);

	}
	_callbacks.onload && _callbacks.onload(myfavorites);
};

ApiomatAdapter.prototype.getMySubscribedChannels = function(_args, _callbacks) {
	var mychannels = this.user.getMysubscribedchannels();
	var lectureseries = [];
	for (var i = 0; i < mychannels.length; i++) {
		var lectureserie = {};
		if (mychannels[i].getChannel()) {
			try {
				lectureserie = JSON.parse(mychannels[i].getChannel());
				lectureserie.ctime = mychannels[i].getCreatedAt();
				lectureserie && lectureseries.push(lectureserie);
			} catch(E) {
				console.log('Error: ' + E);
			}
		}
	}
	_callbacks.onload && _callbacks.onload(lectureseries);
};

/// SETTER:
ApiomatAdapter.prototype.subscribeChannel = function() {
	var options = arguments[0] || {};
	var callbacks = arguments[1] || new Function();
	var that = this;
	var lectureseries = new Apiomat.subscribedChannels();
	lectureseries.setChannel(JSON.stringify(options.lectureseries));
	lectureseries.setLectureseriesId(options.lectureseriesId);
	lectureseries.save({
		onOk : function() {
			that.user.postMysubscribedchannels(lectureseries, {
				onOk : function() {
					callbacks.onsuccess();
					console.log('Info: lectureseries ' + options.lectureseriesId + ' angelegt und user zugeordnet');
				},
				onError : function(error) {
					console.log("Some error occured: (" + error.statusCode + ") " + error.message);
				}
			});
		},
		onError : function(error) {
			console.log("Some error occured: (" + error.statusCode + ") " + error.message);
		}
	});
};

ApiomatAdapter.prototype.setWatchedVideo = function() {
	var options = arguments[0] || {};
	var that = this;
	require('controls/geolocation').get(undefined, function(_coords) {
		var myWatchedVideo = new Apiomat.WatchedVideo();
		myWatchedVideo.setVideo(JSON.stringify(options.video));
		myWatchedVideo.setVideoid(options.video.id);
		myWatchedVideo.setDevicename(Ti.Platform.getModel());
		if (_coords) {
			myWatchedVideo.setLatlngLatitude(_coords.latitude);
			myWatchedVideo.setLatlngLongitude(_coords.longitude);
		}
		myWatchedVideo.save({
			onOk : function() {
				that.user.postMywatched(myWatchedVideo, {
					onOk : function() {
						Ti.API.log("my watched: " + that.user.getMywatched());
					},
					onError : function(error) {
						console.log("Some error occured: (" + error.statusCode + ") " + error.message);
					}
				});
			},
			onError : function(error) {
				console.log(error);
			}
		});
	});
};

ApiomatAdapter.prototype.favVideo = function() {
	var options = arguments[0] || {};
	var that = this;
	var myWatchedVideo = new Apiomat.WatchedVideo();
	myWatchedVideo.setVideo(JSON.stringify(options.video));
	myWatchedVideo.setVideoid(options.video.id);
	myWatchedVideo.save({
		onOk : function() {
			that.user.postMyfavorites(myWatchedVideo, {
				onOk : function() {
					Ti.API.log("Favorites: " + that.user.getMyfavorites());
				},
				onError : function(error) {
					console.log("Some error occured: (" + error.statusCode + ") " + error.message);
				}
			});
		},
		onError : function(error) {
			console.log(error);
		}
	});
};
module.exports = ApiomatAdapter;
