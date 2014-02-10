const VIDEOSTORAGENAME = 'VideoStorage';
const DBNAME = 'lecture2go';
const WOWZA_URL = 'http://fms1.rrz.uni-hamburg.de';
const L2G_URL = 'http://fms1.rrz.uni-hamburg.de';
const SELECT = 'SELECT v.treeid einrichtungId, v.dimension, v.filename, v.filesize,v.duration,v.title title,v.hits,v.author,v.publisher,v.id id,c.nr nr,c.lang lang, c.id channelid, c.name channelname FROM videos v, channels c';

var Model = function() {
	console.log('Info: Start l2g-model');
	this.getVideosFromSQL = function(sql) {
		var _result = this.videoDB.execute(sql);
		var videos = [];
		while (_result.isValidRow()) {
			var dimensions = _result.fieldByName('dimension').split('x');
			var idstr = _result.fieldByName('filename').replace(/\.mp4/, '');
			videos.push({
				ratio : (dimensions[1]) ? dimensions[0] / dimensions[1] : 1,
				title : _result.fieldByName('title'),
				hits : _result.fieldByName('hits'),
				author : _result.fieldByName('author'),
				publisher : _result.fieldByName('publisher'),
				id : _result.fieldByName('id'),
				filename : _result.fieldByName('filename'),
				channel : {
					id : _result.fieldByName('channelid'),
					lang : _result.fieldByName('lang'),
					nr : _result.fieldByName('nr'),
					name : _result.fieldByName('channelname')
				},
				filesize : _result.fieldByName('filesize'),
				duration : _result.fieldByName('duration'),
				stream : WOWZA_URL + '/vod/_definst_/mp4:' + _result.fieldByName('einrichtungId') + 'l2g' + _result.fieldByName('produzentId') + '/' + idstr + '/playlist.m3u8',
				image : L2G_URL + '/images/' + idstr + '.jpg',
				mp4 : WOWZA_URL + '/abo/' + idstr + '.mp4'
			});
			_result.next();
		}
		_result.close();
		return videos;
	};
	if (!Ti.App.Properties.hasProperty('menuemodus'))
		Ti.App.Properties.setString('menuemodus', 'latest');
	if (!Ti.App.Properties.hasProperty('catmodus'))
		Ti.App.Properties.setString('catmodus', 'uhh');
	var videostorage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, VIDEOSTORAGENAME);
	if (!videostorage.exists())
		videostorage.createDirectory();

	this.historyDB = Ti.Database.open('privatehistory');
	this.historyDB.execute('BEGIN TRANSACTION;');
	this.historyDB.execute('CREATE TABLE IF NOT EXISTS private (id TEXT, cached NUMERIC, faved NUMERIC, watched NUMERIC, ctime TEXT);');
	this.historyDB.execute('COMMIT;');
	if (Ti.Platform.name === 'iPhone OS') {
		this.historyDB.file.setRemoteBackup(false);
	}
};

Model.prototype.initVideoDB = function() {
	var options = arguments[0] || {};
	var dbname = null;
	var old_mtime = 0, new_mtime = 0;
	if (Ti.App.Properties.hasProperty('old_mtime')) {
		old_mtime = Ti.App.Properties.getString('old_mtime');
		console.log('Info: old_mtime from properties: ' + old_mtime);
	}
	var xhr = Ti.Network.createHTTPClient({
		onerror : function() {
			options.onload({
				success : false
			});
		},
		onload : function() {
			console.log('Info: retrieving of meta infos successful');
			try {
				var res = JSON.parse(this.responseText);
				new_mtime = res.mtime;
				Ti.UI.createNotification({
					message : res['videos_total'] + ' Videos in ' + res['courses_total'] + ' Kursen\nStand: ' + res.mtime
				}).show();
				console.log('Info: answer of server valide, new mtime = ' + new_mtime);
				require('vendor/dataproxy').getDB({
					url : res.sqlite.url,
					aspectedcontentlength : res.sqlite.filesize,
					progress : options.progress,
					onload : function(_args) {
						console.log('Info: new database with mtime and tables' + new_mtime + '    ' + _args.numberoftables);
						dbname = _args.dbname;
						Ti.App.Properties.setString('old_mtime', new_mtime);
						Ti.App.Properties.setString('dbname', dbname);
						console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
						options.onload({
							success : true,
							date : new_mtime
						});
					}
				});
				console.log('Info: mirror started.');
			} catch(E) {
				options.onload({
					success : false
				});
			}
		}
	});
	xhr.open('GET', Ti.App.Properties.getString('dbmirrorurl'), true);
	xhr.send();
};

Model.prototype.getAllSectionnames = function() {
	var bar = [];
	for (var section in this.sections) {
		bar.push(this.sections[section].name);
	}
	return bar;
};

Model.prototype.getTree = function(_args) {
	return;
	if (_args.modus) {
		Ti.App.Properties.setString('catmodus', _argc.modus);
	}
	var catmodus = Ti.App.Properties.getString('catmodus');
	var catmenue = require('modules/catitems').list;
	var url = 'http://lab.min.uni-hamburg.de/l2g/tree.json';
	var xhr = Ti.Network.createHTTPClient({
		onerror : function() {
			_args.onload({
				title : sectiontitle,
				tree : JSON.parse(Ti.App.Properties.getString('tree'))[section]
			});
		},
		onload : function() {
			Ti.App.Properties.setString('tree', this.responseText);
			_args.onload({
				title : catmenue[catmodus].title,
				icon : catmenue[catmodus].icon,
				tree : JSON.parse(Ti.App.Properties.getString('tree'))[catmodus]
			});
		},
		timeout : 60000
	});
	xhr.open('GET', url);
	xhr.send(null);
};

Model.prototype.mirrorRemoteDB = function(_args) {
	var self = this;
	function existsDB() {
		self.videoDB = Ti.Database.open(DBNAME);
		var result = self.videoDB.execute('SELECT name FROM sqlite_master');
		if (result.isValidRow()) {
			return true;
			result.close();
		} else
			return false;
	}


	console.log('Info: start mirroring DB');
	var url = Ti.App.Properties.getString('dbmirror');
	function onOffline() {
		if (existsDB()) {
			console.log('Info: offline, but existing old DB');
			_args.onload(true);
		} else {
			console.log('Info: offline and no DB');
			_args.onload(false);
		}
	}

	// Decision if mirroring:
	if (Ti.Network.online == false) {
		onOffline();
		return;
	};
	var xhr = Ti.Network.createHTTPClient({
		timeout : (Ti.Network.networkType === Ti.Network.NETWORK_WIFI) ? 2000 : 20000,
		onerror : onOffline,
		onload : function() {
			var filename = DBNAME + '.sql';
			var tempfile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), filename);
			console.log('Info: Receiving sqlite, length=' + this.responseData.length);
			console.log('Info: Tempfile created ' + tempfile.nativePath);
			tempfile.write(this.responseData);
			try {
				var dummy = Ti.Database.open(DBNAME);
				dummy.remove();
			} catch(E) {
				onOffline();
			}
			self.videoDB = Ti.Database.install(tempfile.nativePath, DBNAME);
			_args.onload(true);
		},
		onsendstream : function(e) {
		},
		ondatastream : function(_e) {
			if (_args.progress)
				_args.progress.value = _e.progress;
		}
	});
	console.log('Info: retrieving URL ' + url);
	xhr.open('GET', url);
	xhr.send(null);
};

Model.prototype.getImageByChannel = function(_channelid) {
	if (!this.videoDB)
		this.videoDB = Ti.Database.open(this.DBNAME);
	var q = 'SELECT filename FROM videos WHERE openaccess =1 AND filename <> "" AND channelid=' + _channelid + ' ORDER BY id DESC LIMIT 0,1';
	var result = this.videoDB.execute(q);
	if (result.isValidRow()) {
		var image = 'http://lecture2go.uni-hamburg.de/images/' + result.fieldByName('filename').replace(/\.mp4/, '.jpg');
		return image;
	}
	return '';
};

Model.prototype.getLatestVideofromChannel = function(_channelid) {
	if (!this.videoDB)
		this.videoDB = Ti.Database.open(this.DBNAME);
	var q = 'SELECT filename,title,hits,author,publisher,id FROM videos WHERE channelid=' + _channelid + ' ORDER BY cdate DESC LIMIT 0,1';
	var result = this.videoDB.execute(q);
	var videos = [];
	if (result.isValidRow()) {
		var video = {
			title : result.fieldByName('title'),
			hits : result.fieldByName('hits'),
			author : result.fieldByName('author'),
			publisher : result.fieldByName('publisher'),
			id : result.fieldByName('id'),
			channel : {
				id : _channelid
			},
			image : 'http://lecture2go.uni-hamburg.de/images/' + result.fieldByName('filename').replace(/\.mp4/, '.jpg')
		};
	}
	result.close();
	return video;
};

Model.prototype.readScannnedURL = function(_args) {
	function alertwrongQR() {
		var dialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK'],
			message : 'Dieser QR-Code ist nicht gültig. Er sollte die URL eines Videos im lecture2go-Portal sein.',
			title : 'Ungültiger QR-Code'
		});
		dialog.show();
	}

	function alertwrongID() {
		var dialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK'],
			message : 'ZU dieser Nummer gibt es kein (öffentliches) Video im Portal',
			title : 'Ungültige VideoId'
		});
		dialog.show();
	}

	//	http://lecture2go.uni-hamburg.de/veranstaltungen/-/v/15253
	var res = _args.qr.match(/\/([\d]+)$/);
	if (res) {
		var video = this.getVideoById(res[1]);
		if (video[0]) {
			console.log(video[0]);
			_args.onsuccess(video[0]);
		} else
			alertwrongID();
	} else {
		alertwrongQR();
	}
};

Model.prototype.getVideoStorage = function() {
	var storage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, VIDEOSTORAGENAME);
	var directory = storage.getDirectoryListing();

};

Model.prototype.getVideoStatus = function(_args) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, VIDEOSTORAGENAME, _args.filename);
	return {
		exists : file.exists()
	};
};

Model.prototype.saveVideo2Storage = function(_args) {
	// args:
	// video : videofilename
	// onprogress : callback for progress display
	// onload: callback for successfull caching
	var url = 'http://fms1.rrz.uni-hamburg.de/abo/' + _args.video;
	var self = this;

	var destfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, VIDEOSTORAGENAME, _args.video);
	var xhr = Ti.Network.createHTTPClient({
		ondatastream : _args.onprogress,
		onload : function() {
			destfile.setRemoteBackup(false);
			_args.onload();
		},
		onerror : function(_e) {
			console.log(_e);
		}
	});
	xhr.open('GET', url);
	xhr.file = destfile;
	xhr.send();
};

Model.prototype.setFavedVideo = function(_id) {
	var id = _id;
	var res = this.historyDB.execute('SELECT id FROM private WHERE id=' + id);
	if (res.getRowCount()) {
		this.historyDB.execute('UPDATE movies SET faved=1, ctime=?  WHERE id =?', new Date().getTime(), id);
	} else {
		this.historyDB.execute('INSERT INTO movies (id,faved,cached,watched,ctime) VALUES (?,1,0,0,?)', id, new Date().getTime());
	}
	res.close();
};

Model.prototype.setWatchedVideo = function(_id) {
	var id = _id;
	var res = this.historyDB.execute('SELECT id FROM private WHERE id=' + id);
	if (res.getRowCount()) {
		this.historyDB.execute('UPDATE private SET watched=1, ctime=?  WHERE id =?', new Date().getTime(), id);
	} else {
		this.historyDB.execute('INSERT INTO private (id,faved,cached,watched,ctime) VALUES (?,0,0,1,?)', id, new Date().getTime());
	}
	res.close();
};

Model.prototype.getWatchedVideos = function() {
	var res = this.historyDB.execute('SELECT * from private WHERE faved=0 ORDER BY ctime DESC');
	var videos = [];
	while (result.isValidRow()) {
		videos.push({
			id : result.fieldByName('id'),
		});
		result.next();
	}
	result.close();
};

Model.prototype.getFavedVideos = function() {
	var res = this.historyDB.execute('SELECT * from private WHERE faved=1 ORDER BY ctime DESC');
	var videos = [];
	while (result.isValidRow()) {
		videos.push({
			id : result.fieldByName('id'),
		});
		result.next();
	}
	result.close();
};

Model.prototype.isFaved = function(_id) {
	var res = this.privateDB.execute('SELECT id total from private WHERE id=' + id);
	if (res.fav.isValidRow()) {
		is = fav.fieldByName('total');
	}
	fav.close();
	return is;
};

Model.prototype.getPlaylistById = function(_args) {
	var q = 'SELECT v.dimension, v.duration, v.filesize, v.filename,v.title,v.hits,v.author,v.publisher,v.id id,c.nr,c.lang,c.id channelid, c.name channelname FROM videos v, channels c ' + 'WHERE c.id=v.channelid AND v.openaccess=1 ' + 'AND c.id =' + _args.id + ' ORDER BY cdate DESC ';
	_args.onload(this.getVideosFromSQL(q));
};

Model.prototype.getVideoList = function(_argc) {
	var offset = (_argc.offset) ? _argc.offset : 0;
	var limit = (_argc.count) ? _argc.count : 100;
	if (_argc.modus) {
		Ti.App.Properties.setString('menuemodus', _argc.modus);
	}
	switch (Ti.App.Properties.getString('menuemodus')) {
		case 'latest' :
			var q = SELECT + ' WHERE c.id=v.channelid ORDER BY cdate DESC LIMIT ' + offset + ',' + limit;
			break;
		case 'popular':
			var q = SELECT + ' WHERE c.id=v.channelid ORDER BY hits DESC LIMIT ' + offset + ',' + limit;
			break;
		default:
			return;
	}
	_argc.onload({
		videos : this.getVideosFromSQL(q),
		section : require('modules/menueitems').list[Ti.App.Properties.getString('menuemodus')]
	});
};

Model.prototype.getChannelsByDepartment = function(_args) {
	if (!this.videoDB)
		this.videoDB = Ti.Database.open(this.DBNAME);
	var q = 'SELECT channels.* from channels,channel_tree WHERE channels.id=channel_tree.channelid AND channel_tree.treeid=' + _args.id;
	var result = this.videoDB.execute(q);
	var channels = [];
	while (result.isValidRow()) {
		var id = result.fieldByName('id');
		// noch Bild besorgen:
		channels.push({
			video : this.getLatestVideofromChannel(id),
			image : this.getImageByChannel(id),
			name : result.fieldByName('name').replace(/&amp;/g, '&'),
			instructors : result.fieldByName('instructors'),
			id : id
		});
		result.next();
	}
	result.close();
	return channels;
};
Model.prototype.search = function(_args) {
	var needle = _args.needle;
	var limit = _args.limit || 25;
	var q = SELECT + ' WHERE c.id=v.channelid AND v.openaccess=1 AND (title LIKE "%' + needle + '%" ' + 'OR author LIKE "%' + needle + '%" ' + 'OR publisher LIKE "%' + needle + '%" ' + ') ORDER BY cdate DESC LIMIT 0,' + limit;
	_args.onsuccess(this.getVideosFromSQL(q));
};

Model.prototype.getVideoById = function(_id) {
	var q = SELECT + ' WHERE c.id=v.channelid AND v.openaccess=1 AND v.id = "' + _id + '"';
	console.log(q);
	return this.getVideosFromSQL(q);
};
module.exports = Model;

