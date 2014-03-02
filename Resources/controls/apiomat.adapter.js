var Apiomat = require('vendor/apiomat');
var saveCB = {
	onOk : function() {
		console.log("saved");
		//Now you can create objects of your class with this new user..
	},
	onError : function(error) {
		console.log("Some error occured: (" + error.statusCode + ")" + error.message);
	}
};

var PrivateDepot = function() {
	var uid = (Ti.App.Properties.hasProperty('uid')) ? Ti.App.Properties.getString('uid') : Ti.Platform.createUUID();
	Ti.App.Properties.setString('uid', uid);
	this.user = new Apiomat.VideoUser();
	this.user.setUserName(uid);
	this.user.setPassword('88888888');
	this.Login();
	return this;
};

PrivateDepot.prototype.Login = function() {
	Apiomat.Datastore.configure(this.user);
	var that = this;
	this.user.loadMe({
		onOk : function() {
			console.log('Info: loadMe() successful');
		},
		onError : function(error) {
			console.log('Info: loadMe gives null => save');
			that.user.save(saveCB);
		}
	});
	return this;
};

PrivateDepot.prototype.favVideo = function() {
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
						onOk : function(_favs) { // _favs is undefined ;-(
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

module.exports = PrivateDepot;
