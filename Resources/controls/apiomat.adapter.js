var Apiomat = require('vendor/apiomat');
var AssetStorage = require('vendor/asset.storage');

var saveCB = {
	onOk : function() {
	},
	onError : function(error) {
	}
};

// Constructor:
var ApiomatAdapter = function() {
	// Following method produced error (file not found stuff)
	/*	Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
	 onOk : function() {
	 //Cache is initalized
	 },
	 onError : function(err) {
	 //Error occurred
	 }
	 });*/

	var uid = (Ti.App.Properties.hasProperty('uid')) ? Ti.App.Properties.getString('uid') : Ti.Platform.createUUID();
	Ti.App.Properties.setString('uid', uid);
	this.storage = new AssetStorage();
	this.user = new Apiomat.VideoUser();
	this.user.setUserName(uid);
	this.user.setPassword('mylittlesecret');
	// <= das knallt mit file not found Fehler
	this.loginUser();

};

ApiomatAdapter.prototype.loginUser = function() {
	var that = this;
	Apiomat.Datastore.configure(this.user);
	this.user.loadMe({
		onOk : function() {
			that.user.loadMyfavorites("order by createdAt", {
				onOk : function() {
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
	for (var i = 0; i < mychannels.length; i++) {
		console.log(mychannels[i]);
		mychannels[i].channel = JSON.parse(mychannels[i].data.channel);
	}
	_callbacks.onload && _callbacks.onload(mychannels);
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
