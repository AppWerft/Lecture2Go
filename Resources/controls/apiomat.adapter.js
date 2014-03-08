var Apiomat = require('vendor/apiomat');

var saveCB = {
	onOk : function() {
		console.log("OK");
	},
	onError : function(error) {
		console.log("Some error occured: (" + error.statusCode + ") " + error.message);
	}
};

// Constructor:
var ApiomatAdapter = function() {
	// Following method produced error (file not found stuff)
	/*try {
		Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, saveCB);
	} catch(E) {
		console.log(E);
	}*/
	var uid = (Ti.App.Properties.hasProperty('uid')) ? Ti.App.Properties.getString('uid') : Ti.Platform.createUUID();
	Ti.App.Properties.setString('uid', uid);
	this.myfavorites = [];
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
					that.myfavorites = that.user.getMyfavorites();
					Ti.UI.createNotification({
						message : that.myfavorites.length + ' Favoriten geladen.'
					}).show();

				},
				onError : function(_err) {
					console.log(_err);
				}
			});
			that.user.loadMylocalsaved(undefined, {
				onOk : function() {
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

ApiomatAdapter.prototype.getStatusofVideo = function(_id) {
	console.log('Info: this.getStatusofVideo()');
	var faved = localsaved = watched = false;
	for (var i = 0; i < this.myfavorites.length; i++) {
		if (this.myfavorites[i].data.videoid == _id) {
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

ApiomatAdapter.prototype.getMe = function(_args, _callbacks) {
	console.log(this.myfavorites);
	for (var i = 0; i < this.myfavorites.length; i++) {
		this.myfavorites[i].video = JSON.parse(this.myfavorites[i].data.video);
	}
	_callbacks.onload && _callbacks.onload(this.myfavorites);
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
