var Model = function() {
	this.url = 'http://lecture2go.uni-hamburg.de/veranstaltungen?p_p_id=gastVeranstaltungen_WAR_lecture2gogastspringportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1';
	this.PrivateCache = Ti.Database.install('/lecture2go.db', 'private.history');
	if (Ti.Platform.name === 'iPhone OS') {
		this.PrivateCache.file.setRemoteBackup(false);
		console.log(this.PrivateCache.file);
	}
	console.log(this.PrivateCache.file);

	return;
	this.getLatest();
	var self = this;
	setTimeout(function() {
		self.getRecentMovies();
		self.getFavs();
	}, 3000);
}
Model.prototype.mirrorDB = function(_pb,_callback) {
	var self = this;
	var url = 'http://lab.min.uni-hamburg.de/l2g/lecture2go.sql';
	var start = new Date().getTime();
	var xhr = Ti.Network.createHTTPClient({
		ondatastream : function(_e) {
			_pb.progress = _e.progress;
		},
		onload : function() {
			var db = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, DBNAME + '.sql');
			var DBNAME = 'lecture2go';
			var tempfile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), DBNAME + '.sql');
			tempfile.write(this.responseData);
			var dbfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, DBNAME);
			if (!dbfile.exists())
				self.mirrorDB = Ti.Database.install(tempfile.nativePath, DBNAME);
			else {
				dbfile.write(tempfile.read());
				self.mirrorDB = Ti.Database.open(DBNAME);
			}
			var end = new Date().getTime();
			console.log(end - start);
			_callback(true);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);

}

Model.prototype.importScanURL = function(_result, _callback) {
	function Alert() {
		var dialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK'],
			message : 'Dieser QR-Code ist nicht gültig. Er sollte die URL eines Videos im lecture2go-Portal sein.',
			title : 'Ungültiger QR-Code'
		});
		dialog.show();
	}

	//				 http://lecture2go.uni-hamburg.de/veranstaltungen/-/v/10197
	var regex = /^http\:\/\/lecture2go\.uni\-hamburg\.de\/(konferenzen|veranstaltungen)\/\-\/(k|v)\/([\d]+)/g;
	if (regex.test(_result)) {
		_callback(_result);
	} else {
		Alert();
	}
}

Model.prototype.setFav = function(movie) {
	var date = new Date();
	this.PrivateCache.execute('INSERT INTO movies (link,fav,author,image,title,ctime,atime) VALUES (?,?,?,?,?,?,?)', movie.link, 1, movie.author, movie.image, movie.title, date.getTime(), date.getTime());
	this.getFavs();
}

Model.prototype.setRecentMovie = function(movie) {
	var date = new Date();
	this.PrivateCache.execute('INSERT INTO movies (link,fav,author,image,title,ctime,atime) VALUES (?,?,?,?,?,?,?)', movie.link, 0, movie.author, movie.image, movie.title, date.getTime(), date.getTime());
	this.getRecentMovies();
}

Model.prototype.getRecentMovies = function() {
	var result = this.PrivateCache.execute('SELECT * from movies WHERE fav=0 ORDER BY ctime DESC');
	var videos = [];
	while (result.isValidRow()) {
		videos.push({
			title : result.fieldByName('title'),
			link : result.fieldByName('link'),
			image : result.fieldByName('image'),
			author : result.fieldByName('author'),
		});
		result.next();
	}
	result.close();
	Ti.App.fireEvent('recentmovies_changed', {
		videos : videos
	});
}

Model.prototype.getFavs = function() {
	var result = this.PrivateCache.execute('SELECT * from movies WHERE fav=1 ORDER BY ctime DESC');
	var videos = [];
	while (result.isValidRow()) {
		videos.push({
			title : result.fieldByName('title'),
			link : result.fieldByName('link'),
			image : result.fieldByName('image'),
			author : result.fieldByName('author'),
		});
		result.next();
	}
	result.close();
	Ti.App.fireEvent('favs_changed', {
		videos : videos
	});
}

Model.prototype.isFav = function(id) {
	var is = 0;
	var fav = this.PrivateCache.execute('SELECT COUNT(*) total from channels WHERE id=' + id);
	if (fav.isValidRow()) {
		is = fav.fieldByName('total');
	}
	fav.close();
	return is;
}

Model.prototype.getPlaylistByHomepage = function(_url, _callback) {
	function clean(foo) {
		return foo.replace(/Ã¤/g, 'ä').replace(/Ã¶/g, 'ö').replace(/Ã¼/g, 'ü').replace(/Ã³/g, 'ó').replace(/Ã©/g, 'é').replace(/ÃŸ/g, 'ß')
	}


	this.getVideoByHomepage(_url, function(_res) {
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				var XMLTools = require('libs/xmltools');
				var parser = new XMLTools(this.responseXML);
				var obj = parser.toObject();
				var items = (Object.prototype.toString.call(obj.channel.item) === '[object Array]' ) ? obj.channel.item : [obj.channel.item];
				var videos = [];
				for (var i = 0; i < items.length; i++) {
					if (items[i].enclosure) {
						var image = items[i].enclosure.url.replace(/fms1\.rrz\.uni\-hamburg\.de\/abo\//, 'lecture2go.uni-hamburg.de/images/').replace(/mp4/, 'jpg');
					} else {
						var image = '/assets/dummy.png';
					}
					videos.push({
						author : clean(items[i]['itunes:author']),
						image : image,
						link : items[i].link,
						title : clean(items[i].title)
					});
				}
				_callback({
					videos : videos,
					title : clean(obj.channel.title)
				});
			}
		});
		xhr.open('GET', 'http://lecture2go.uni-hamburg.de/rss/' + _res.rss + '.mp4.xml');
		xhr.send();
	});
};

Model.prototype.getVideoByHomepage = function(_url, _callback) {
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var regex = /embed\.html\?src=(.*?)\/manifest\.f4m/gm;
			var res = regex.exec(this.responseText);
			var rssregex = /\/rss\/(.*?)\.mp4\.xml/;
			var rss = rssregex.exec(this.responseText);
			if ( typeof (_callback) === 'function')
				_callback({
					cuppertino : res[1] + '/playlist.m3u8',
					rss : rss[1]
				});
		},
		onerror : function(e) {
			Ti.API.log(e.error);
		},
		timeout : 55000
	});
	xhr.open("GET", _url);
	xhr.send();
}

Model.prototype.getVideoKeyByHomepage = function(_url, _callback) {
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var regex = /_definst_\/mp4\:(.*?)\.mp4\/manifest\.f4m/gm;
			var regex = /embed\.html\?src=(.*?)\/manifest\.f4m/gm;
			var res = regex.exec(this.responseText);
			_callback({
				cuppertino : res[1]
			});
		},
		onerror : function(e) {
			Ti.API.log(e.error);
		},
		timeout : 55000
	});
	xhr.open("GET", _url);
	xhr.send();
}
Model.prototype.getLatest = function() {
	
	var self = this;
	var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Flecture2go.uni-hamburg.de%2Fl2gos%22%20and%20compat%3D%22html5%22%20and%20xpath%3D%27%2F%2Fdiv[contains%28%40class%2C%22videotile%22%29]%27&format=json";
	var xhr = Ti.Network.createHTTPClient({
		timeout : 8000,
		onerror : function() {
			console.log('onError');
			console.log(url);

			require('modules/parts/offline').create('Offline', '', function() {
				self.getLatest();
			});
		},
		onload : function() {
			var results = JSON.parse(this.responseText).query.results.div;
			if (!results) {
				console.log('onResult');
				console.log(results);
				require('modules/parts/offline').create('Offline', '', function() {
					self.getLatest();
				});
				return;
			}
			var videos = [];
			for (var i = 0; i < results.length; i++) {
				var result = results[i].a;
				videos.push({
					link : result.href,
					image : result.img.src,
					author : result.span[0].content,
					title : result.span[2].content
				});
			}
			Ti.App.fireEvent('app:latestready', {
				videos : videos
			});
		}
	});
	xhr.open('GET', url);
	xhr.send();

}

Model.prototype.getFakultaeten = function(_type, _callback) {
	this.Model = {};
	var self = this;
	if (Ti.App.Properties.hasProperty('fakultaeten')) {
		var fakultaeten = Ti.App.Properties.getString('fakultaeten');
		this.cached = true;
	}
	if (!Ti.Network.online) {
		require('modules/parts/offline').create();
	}
	Ti.Yahoo.yql('SELECT * FROM html WHERE url="' + "http://lecture2go.uni-hamburg.de/" + _type + "/" + '" and xpath="//form"', function(y) {
		if (!y.data) {
			Ti.App.fireEvent('data_ready');
			require('modules/parts/offline').create();
			return;
		}
		var form = y.data.form[1];
		self.url = form.action;
		if (self.cached == true)
			return;
		var options = form.select.option;
		for (var i = 1; i < options.length; i++) {
			var fakultaetId = options[i].value;
			self.Model[fakultaetId] = options[i].content;
			//getsubs(0, fakultaetId);
		}
		Ti.App.Properties.setString('fakultaeten', JSON.stringify(self.Model));
		_callback(self.Model);
	});
	if (this.cached)
		_callback(JSON.parse(fakultaeten));
}

Model.prototype.getFachbereiche = function(_fakultaetId, _callback) {
	if (Ti.App.Properties.hasProperty('fakultaeten' + _fakultaetId)) {
		var f = Ti.App.Properties.getString('fakultaeten' + _fakultaetId);
		Ti.App.fireEvent('data_ready');
		_callback(JSON.parse(f));
		return;
	}
	var url = this.url + '&fakultaetId=' + _fakultaetId + '&currentPage=0';
	var self = this;
	Ti.Yahoo.yql('SELECT * FROM html WHERE url="' + url + '" AND xpath="//select[1]"', function(y) {
		Ti.App.fireEvent('data_ready');
		try {
			var options = y.data.select[1].option;
			var bereiche = {};
			for (var i = 1; i < options.length; i++) {
				var bereichId = options[i].value;
				bereiche[bereichId] = options[i].content;
				//		getsubs(0,options[i].value);
			}
			Ti.App.Properties.setString('fakultaeten' + _fakultaetId, JSON.stringify(bereiche));
			_callback(bereiche);
		} catch (E) {
		}

	});
}

Model.prototype.getKanaeleByKurs = function(_id, _callback) {
	var key = '_' + _id;
	if (Ti.App.Properties.hasProperty(key)) {
		var f = Ti.App.Properties.getString(key);
		Ti.App.fireEvent('data_ready');
		_callback(JSON.parse(f));
		return;
	}
	if (!Ti.Network.online)
		require('modules/parts/offline').create();
	var url = this.url + '&currentPage=0&fakultaetId=' + _id.split(':')[0] + '&subEinrichtung1Id=' + _id.split(':')[1];
	Ti.Yahoo.yql('SELECT * FROM html WHERE url="' + url + '" AND xpath="//select"', function(y) {
		try {
			var options = y.data.select[2].option;
			var course = {};
			Ti.App.fireEvent('data_ready');
			for (var i = 1; i < options.length; i++) {
				var coursedataId = _id + ':' + options[i].value;
				course[coursedataId] = options[i].content.replace(/&amp;/g, '&');
			}
			Ti.App.Properties.setString(key, JSON.stringify(course));
			_callback(course);
		} catch (E) {
		}
	});
}
// Click on third select => give us channel
// template: http://lecture2go.uni-hamburg.de/rss/3851.mp4.xml
// first id 3786
Model.prototype.getMetaByID = function(_id, _callback) {
	function getLink(text) {
		var regex = /http\:\/\/lecture2go\.uni\-hamburg\.de\/(konferenzen|veranstaltungen)\/\-\/(k|v)\/([\d]+)/g;
		var res = regex.exec(text);
		return 'http://lecture2go.uni-hamburg.de/' + res[1] + '/-/' + res[2] + '/' + res[3];
	}

	function getImage(text) {
		var regex = /poster\:"http\:\/\/lecture2go\.uni\-hamburg\.de\/images\/(.*?)\.jpg/g;
		var res = regex.exec(text);
		return 'http://lecture2go.uni-hamburg.de/images/' + res[1] + '.jpg'
	}

	var url = this.url + '&currentPage=0&fakultaetId=' + _id.split(':')[0] + '&subEinrichtung1Id=' + _id.split(':')[1] + '&coursedataId=' + _id.split(':')[2];
	var xhr = Ti.Network.createHTTPClient({
		timeout : 15000,
		onload : function(e) {
			_callback({
				link : getLink(this.responseText),
				image : getImage(this.responseText)
			});
		}
	});
	xhr.open('GET', url);
	xhr.send();
}

Model.prototype.search = function(needle, onSuccess, onError) {
	var url = 'http://lecture2go.uni-hamburg.de/web/lecture2go/suche?p_p_id=gastSearch_WAR_lecture2gogastspringportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&search=' + encodeURI(needle);
	var yql = 'SELECT * FROM html WHERE url="' + encodeURI(url) + '"';
	Ti.Yahoo.yql(yql, function(_y) {
		if (_y.success && _y.data && _y.data.body) {
			var res = _y.data.body.div.div[2].div[1].div.div.div.div.div[1].div.div.div;
			if (!res) {
				onError();
				return;
			}
			var videos = [];
			for (var i = 0; i < res.length; i++) {
				videos.push({
					link : res[i].a[0].href,
					image : res[i].a[0].img.src,
					author : res[i].div[0].p.content.replace(/, $/g, ''),
					//pubdate : res[i].div[0].p.span.content,
					title : res[i].div[1].p,
					//channel : res[i].p
				});
			}
			onSuccess(videos);
		} else {
			onError(null);
		}
		_y = null;
	});
}

module.exports = Model;
