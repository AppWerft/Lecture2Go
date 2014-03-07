var Apiomat = require('vendor/apiomat');
var saveCB = {
	onOk : function() {
		console.log("saved");
	},
	onError : function(error) {
		console.log("Some error occured: (" + error.statusCode + ") " + error.message);
	}
};

// Constructor:
var Lecture2GoWatchedVideo = function() {
	this.uservideos = {
		myfavorites : [],
		mylocalsaved : [],
		mywatched : []
	};
	var uid = (Ti.App.Properties.hasProperty('uid')) ? Ti.App.Properties.getString('uid') : Ti.Platform.createUUID();
	Ti.App.Properties.setString('uid', uid);
	this.user = new Apiomat.VideoUser();
	this.user.setUserName(uid);
	this.user.setPassword('mylittlesecret');
	// Following method produced error (network staff)
	/*Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
	 onOk : function() {
	 },
	 onError : function(err) {
	 }
	 });*/
	this.Login();
	return this;
};

Lecture2GoWatchedVideo.prototype.Login = function() {
	var that = this;
	Apiomat.Datastore.configure(this.user);
	this.user.loadMe({
		onOk : function() {
			that.user.loadMyfavorites(undefined, {
				onOk : function() {
					that.uservideos.myfavorites = that.user.getMyfavorites();
				}
			});
			that.user.loadMylocalsaved(undefined, {
				onOk : function() {
					that.uservideos.mylocalsaved = that.user.getMylocalsaved();
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

Lecture2GoWatchedVideo.prototype.getMe = function(_args, _callbacks) {
	for (var i = 0; i < this.uservideos.myfavorites.length; i++) {
		var video = Ti.App.Lecture2Go.getVideoById({
			id : this.uservideos.myfavorites[i].data.videoid
		});
		this.uservideos.myfavorites[i].video = video;
	}
	_callbacks.onload && _callbacks.onload(this.uservideos);
};


Lecture2GoWatchedVideo.prototype.favVideo = function() {
	var options = arguments[0] || {};
	var that = this;
	var myWatchedVideo = new Apiomat.WatchedVideo();
	myWatchedVideo.setVideoid(options.id);
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

module.exports = Lecture2GoWatchedVideo;
