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
		mysaved : [],
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
					console.log('Info: loadMyfavorites in loadMe successful');
					that.uservideos.myfavorites = that.user.getMyfavorites();
					for (var i = 0; i < that.uservideos.myfavorites.length; i++) {
						that.uservideos.myfavorites[i].video = Ti.App.Lecture2Go.getVideoById({
							id : that.uservideos.myfavorites[i].data.videoid
						});
					}
					Ti.App.FireEvent('app:myfavorites', {
						myfavorites : that.uservideos.myfavorites[i]
					});
				},
				onError : function(error) {
					console.log("Some error occured: (" + error.statusCode + ") " + error.message);
				}
			});
		},
		onError : function(error) {
			that.user.save(saveCB);
		}
	});
	return this;
};

Lecture2GoWatchedVideo.prototype.watchVideo = function() {
};
Lecture2GoWatchedVideo.prototype.localsavedVideo = function() {
};

Lecture2GoWatchedVideo.prototype.favVideo = function() {
	var options = arguments[0] || {};
	var that = this;
	var myWatchedVideo = new Apiomat.WatchedVideo();
	myWatchedVideo.setVideoid(options.id);
	myWatchedVideo.save({
		onOk : function() {
			// add video to user
			that.user.postMyfavorites(myWatchedVideo, {
				onOk : function() {
					// successful => load favorites from apiomat:
					/* don't load again, because new video will automatically added to local favorites property */
					Ti.API.log("Favorites: " + that.user.getMyfavorites());
					// that.user.loadMyfavorites(undefined, {
					// onOk : function(_favs) {// _favs is undefined ;-(
					// },
					// onError : function(error) {
					// console.log("Some error occured: (" + error.statusCode + ") " + error.message);
					// }
					// });
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
