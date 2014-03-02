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
	this.user.setPassword('88888888');
	this.Login();
	return this;
};

Lecture2GoWatchedVideo.prototype.Login = function() {
	Apiomat.Datastore.configure(this.user);
	var that = this;
	this.user.loadMe({
		onOk : function() {
			// here I hope to load the datas from user:
			that.user.loadMyfavorites(undefined, {
				onOk : function(_favs) {// _favs is undefined ;-(
					console.log('_favs=' + _favs);
					that.uservideos.myfavorites = _favs;
					// doesn't work
				},
				onError : function(error) {
					console.log("Some error occured: (" + error.statusCode + ") " + error.message);
				}
			});
			console.log('Info: loadMe() successful');
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
					that.user.loadMyfavorites(undefined, {
						onOk : function(_favs) {// _favs is undefined ;-(
							console.log('_favs=' + _favs);
						},
						onError : function(error) {
							console.log("Some error occured: (" + error.statusCode + ") " + error.message);
						}
					});
				},
				onError : function(error) {
					console.log("Some error occured: (" + error.statusCode + ")" + error.message);
				}
			});
		},
		onError : function(error) {
			console.log(error);
		}
	});
};

module.exports = Lecture2GoWatchedVideo;
