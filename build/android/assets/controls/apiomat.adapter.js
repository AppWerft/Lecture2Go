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
			// here I hope to load the datas from user:
			that.user.loadMyfavorites(undefined, {
				onOk : function() {
					console.log('Info: loadMyfavorites in loadMe successful');
					that.uservideos.myfavorites = that.user.getMyfavorites();

					var x = {
						"data" : {
							"@type" : "lecture2goMain$WatchedVideo",
							"createdAt" : 1393765482803,
							"lastModifiedAt" : 1393765483204,
							"id" : "53132c6ae4b02a008da637e0",
							"applicationName" : "lecture2go",
							"ownerUserName" : "9b3f7fa3-5418-4fa3-8d74-ab35f6f56f46",
							"moduleName" : "lecture2goMain",
							"allowedRolesRead" : [],
							"allowedRolesWrite" : [],
							"allowedRolesGrant" : [],
							"restrictResourceAccess" : false,
							"referencedHrefs" : {},
							"videoid" : 15866,
							"videouserHref" : "https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/53132c6ae4b02a008da637e0/videouser",
							"href" : "https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/53132c6ae4b02a008da637e0"
						}
					};

					for (var i = 0; i < that.uservideos.myfavorites.length; i++) {
						var videoid = that.uservideos.myfavorites[i].data.videoid;
						console.log(videoid);
						that.uservideos.myfavorites[i].video = Ti.App.Lecture2Go.getVideoById({
							id : that.uservideos.myfavorites[i].data.videoid
						});
					}

					// this comes back:
					console.log(that.uservideos);
					// content of that.uservideos is '{"mysaved":[],"mywatched":[]}'#
					// (myfavorites will deleted by code)

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
