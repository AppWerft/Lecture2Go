const VIDEOSTORAGENAME = 'VideoStorage';
var DBNAME = null;
const WOWZA_URL = 'http://fms1.rrz.uni-hamburg.de';
const RTSP_URL = 'rtsp://fms.rrz.uni-hamburg.de';
const L2G_URL = 'https://lecture2go.uni-hamburg.de';
const SELECT = 'SELECT v.pathpart, v.downloadLink, v.lectureseriesId einrichtungId, v.generationDate ctime, v.pathpart, v.resolution, v.filename, v.duration,v.title title,v.hits,v.author,v.publisher,v.id id, v.description, c.nr nr,c.lang lang, c.id channelid, c.name channelname FROM videos v, lectureseries c';
var moment = require('vendor/moment');
moment.lang('de_DE');

var Model = function() {
	var that = this;
	this.getVideosFromSQL = function(sql,withthumb) {
		var link = Ti.Database.open(DBNAME);
		var _result = link.execute(sql);
		var videos = [];
		while (_result.isValidRow()) {
			if (_result.fieldByName('resolution') && _result.fieldByName('duration')) {
				var resolution = _result.fieldByName('resolution');
				var regex = /^([\d]+)x([\d]+)/g;
				var ratio = regex.exec(resolution);
				var idstr = _result.fieldByName('filename').replace(/\.mp4/, '');
				var duration = _result.fieldByName('duration').replace(/\.([\d]+)/, '');

				var video = {
					ctime : _result.fieldByName('ctime'),
					'duration_min' : parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]),
					'ctime_i18n' : moment(_result.fieldByName('ctime'), 'YYYY-MM-DD_HH-mm').format('LLLL'),
					day : _result.fieldByName('ctime').split('_')[0],
					ratio : (ratio) ? ratio[2] / ratio[1] : 1,
					title : _result.fieldByName('title'),
					hits : _result.fieldByName('hits'),
					author : _result.fieldByName('author'),
					publisher : _result.fieldByName('publisher'),
					description : '', //_result.fieldByName('description'),
					pathpart : _result.fieldByName('pathpart'),
					id : _result.fieldByName('id'),
					ctime : _result.fieldByName('ctime'),
					filename : _result.fieldByName('filename'),
					downloadlink : _result.fieldByName('downloadLink'),
					channel : {
						id : _result.fieldByName('channelid'),
						lang : _result.fieldByName('lang'),
						nr : _result.fieldByName('nr'),
						name : _result.fieldByName('channelname')
					},
					duration : duration,
					videouri : {
						cuppertino : WOWZA_URL + '/vod/_definst_/mp4:' + _result.fieldByName('pathpart') + '/' + idstr + '/playlist.m3u8',
						mp4 : _result.fieldByName('downloadLink') ? WOWZA_URL + '/abo/' + idstr + '.mp4' : null,
						rtsp : RTSP_URL + '/vod/_definst_/mp4:' + _result.fieldByName('pathpart') + '/' + idstr + '.mp4',
					},
					thumb : L2G_URL + '/images/' + idstr + '_m.jpg',
					image : L2G_URL + '/images/' + idstr + '.jpg',
				};
				if (withthumb) video.channel.thumb =  that.getLatestImageByLectureseries(_result.fieldByName('channelid')).thumb;
			
				videos.push(video);
			}
			_result.next();
		}
		_result.close();
		link.close();
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
	var old_mtime = null, new_mtime = null;
	if (Ti.App.Properties.hasProperty('old_mtime')) {
		old_mtime = Ti.App.Properties.getString('old_mtime');
		options.onstatuschanged({
			text : 'alte Version vom ' + old_mtime + ' gefunden.'
		});
	}
	// now we try if a newer version is on server:
	function onoffline() {
		if (Ti.App.Properties.hasProperty('dburl')) {
			options.onstatuschanged({
				text : 'Teste aktuelle Datenbank auf Richtigkeit.'
			});
			require('vendor/sqlite.adapter').getDB({
				url : Ti.App.Properties.getString('dburl'),
				mirror : false,
				onload : function(_args) {
					console.log(_args);
					options.onstatuschanged({
						text : 'Kein Netz: verwende Offline-Datenbank.'
					});
					DBNAME = _args.dbname;
					options.onload({
						success : true,
						date : old_mtime
					});

				}
			});
		} else {
			alert('Kein Internet und auch keine alte, gültige Version der Datenbank');
		}
	}

	if (Ti.Network.online == false) {
		onoffline();
		return;
	}
	var xhr = Ti.Network.createHTTPClient({
		onerror : onoffline,
		onload : function() {
			try {
				var res = JSON.parse(this.responseText);
				new_mtime = res.mtime;
				options.onstatuschanged({
					text : 'neue Version vom ' + new_mtime + ' auf dem Lecture2Go-Server.'
				});
				require('vendor/sqlite.adapter').getDB({
					url : res.sqlite.url,
					mirror : (new_mtime == old_mtime) ? false : true,
					aspectedcontentlength : res.sqlite.filesize,
					onprogress : options.onprogress,
					onstatuschanged : options.onstatuschanged,
					onload : function(_args) {
						console.log('Info: new database with mtime and tables' + new_mtime + '    ' + _args.numberoftables);
						options.onstatuschanged({
							text : 'Datenbank auf neuestem Stande.'
						});
						DBNAME = _args.dbname;
						Ti.App.Properties.setString('old_mtime', new_mtime);
						Ti.App.Properties.setString('dbname', dbname);
						Ti.App.Properties.setString('dburl', res.sqlite.url);
						options.onload({
							success : true,
							date : new_mtime
						});
					}
				});
				console.log('Info: mirror started.');
			} catch(E) {
				onoffline();
			}
		}
	});
	xhr.open('GET', Ti.App.Properties.getString('dbmirrorurl'), true);
	xhr.send();
	options.onstatuschanged({
		text : 'Teste auf neue Version.'
	});
};

/*Model.prototype.mirrorRemoteDB = function(_args) {
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
 xhr.open('GET', url);
 xhr.send(null);
 };
 */
Model.prototype.getTree = function() {
	var options = arguments[0] || {};
	var link = Ti.Database.open(DBNAME);
	var q = 'SELECT SUM(videos.hits) hits, MN.treeid treeid FROM videos,lectureseries_tree MN,lectureseries WHERE  videos.lectureseriesId = lectureseries.id AND lectureseries.id = MN.lectureseriesId GROUP BY MN.treeid ORDER by hits';
	var result = link.execute(q);
	var hits = {};
	while (result.isValidRow()) {
		hits[result.fieldByName('treeid')] = result.fieldByName('hits');
		result.next();
	}
	result.close();
	var res = link.execute('SELECT json FROM tree LIMIT 1');
	if (res) {
		options.onload(JSON.parse(res.fieldByName('json')), hits);
		res.close();
	}
	link.close();
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

Model.prototype.getVideosByChannel = function(_args) {
	var q = SELECT + ' WHERE c.id=v.lectureseriesId AND c.id =' + _args.id + ' ORDER BY generationDate DESC ';
	_args.onload({
		videos : this.getVideosFromSQL(q)
	});
};

Model.prototype.getVideoList = function() {
	var options = arguments[0] || {};
	var offset = (options.min) ? options.min : 0;
	var limit = (options.max) ? options.max : 150;
	switch (options.key) {
		case 'idlist':
			var q = SELECT + ' WHERE c.id=v.lectureseriesId AND v.id IN (' + options.value.join(',') + ')';
			break;
		case 'latest' :
			var q = SELECT + ' WHERE c.id=v.lectureseriesId ORDER BY generationDate DESC LIMIT ' + offset + ',' + limit;
			break;
		case 'popular':
			var q = SELECT + ' WHERE c.id=v.lectureseriesId ORDER BY hits DESC LIMIT ' + offset + ',' + limit;
			break;
		case 'author':
			var q = SELECT + ' WHERE c.id=v.lectureseriesId AND v.author="' + options.value + '" ORDER BY generationDate DESC LIMIT ' + offset + ',' + limit;
			break;
		case 'publisher':
			var q = SELECT + ' WHERE c.id=v.lectureseriesId AND v.publisher="' + options.value + '" ORDER BY generationDate DESC LIMIT ' + offset + ',' + limit;
			break;
		case 'day':
			var q = SELECT + ' WHERE c.id=v.lectureseriesId AND v.generationDate LIKE "' + options.value + '%" ORDER BY generationDate DESC LIMIT ' + offset + ',' + limit;
			break;
		case 'channel':
		case 'lectureseries':
			var q = SELECT + ' WHERE c.id=v.lectureseriesId AND v.lectureseriesId="' + options.value + '" ORDER BY generationDate DESC LIMIT ' + offset + ',' + limit;

			break;
		default:
			return;
	}
	options.onload({
		videos : this.getVideosFromSQL(q)
		//	section : require('modules/menueitems').list[Ti.App.Properties.getString('menuemodus')]
	});
};

Model.prototype.getLatestImageByLectureseries = function(_id) {
	var link = Ti.Database.open(DBNAME);
	var q = 'SELECT * FROM videos WHERE filename <> "" AND lectureseriesid=' + _id + ' ORDER BY id DESC LIMIT 0,1';
	var result = link.execute(q);
	if (result.isValidRow()) {
		var video = {
			thumb : L2G_URL + '/images/' + result.fieldByName('filename').replace(/\.mp4/, '') + '_m.jpg',
			ctime : result.fieldByName('generationDate'),
			title : result.fieldByName('title'),
			id : result.fieldByName('id')
		};
		result.close();
		link.close();
		return video;
	}
	link.close();
	return null;
};

Model.prototype.getLectureseriesByTreeId = function() {
	var options = arguments[0] || {};
	var link = Ti.Database.open(DBNAME);
	var q = 'SELECT lectureseries.* from lectureseries,lectureseries_tree WHERE lectureseries.id=lectureseries_tree.lectureseriesid AND lectureseries_tree.treeid=' + options.id;
	var result = link.execute(q);
	var lectureseries = [];
	while (result.isValidRow()) {
		var id = result.fieldByName('id');
		// noch Bild besorgen:
		var lastvideo = this.getLatestImageByLectureseries(id);
		if (lastvideo)
			lectureseries.push({
				thumb : lastvideo.thumb,
				ctime : lastvideo.ctime,
				name : result.fieldByName('name').replace(/&amp;/g, '&'),
				instructors : result.fieldByName('instructors'),
				lectureseriesid : id
			});
		result.next();
	}
	result.close();
	link.close();
	options.onload({
		lectureseries : lectureseries
	});
};

Model.prototype.searchNeedle = function() {
	var options = arguments[0] || {};
	limit = 500;
	console.log('Info: searching by „' + options.needle + '“');
	var q = SELECT + ' WHERE c.id=v.lectureseriesId   AND (title LIKE "%' + options.needle + '%" ' + 'OR author LIKE "%' + options.needle + '%" ' + 'OR publisher LIKE "%' + options.needle + '%" ' + ') ORDER BY generationDate DESC LIMIT 0,' + limit;
	options.onload(this.getVideosFromSQL(q));
};

Model.prototype.getVideoById = function() {
	var options = arguments[0] || {};
	var q = SELECT + ' WHERE c.id=v.lectureseriesId AND v.id = "' + options.id + '"';
	return this.getVideosFromSQL(q,true)[0];
};

module.exports = Model;

