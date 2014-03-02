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
	this.myVideoUser = new Apiomat.VideoUser();
	this.myVideoUser.setUserName(uid);
	this.myVideoUser.setPassword('88888888');
	this.Login();
	return this;
};

PrivateDepot.prototype.Login = function() {
	Apiomat.Datastore.configure(this.myVideoUser);
	var that = this;
	this.myVideoUser.loadMe({
		onOk : function() {
			console.log('Info: loadMe() successful');
		},
		onError : function(error) {
			console.log('Info: loadMe gives null => save');
			that.myVideoUser.save(saveCB);
		}
	});
	return this;
};

// here comes trouble in line +10
PrivateDepot.prototype.favVideo = function() {
	var options = arguments[0] || {};
	var that = this;
	var myWatchedVideo = new Apiomat.WatchedVideo();
	myWatchedVideo.setVideoid(options.id);
	myWatchedVideo.save({
		onOk : function() {
			that.myVideoUser.postMyfavorites(myWatchedVideo, {
				onOk : function() {
					that.myVideoUser.getMyfavorites( {
						onOk : function(_favs) {
							console.log(_favs);
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
