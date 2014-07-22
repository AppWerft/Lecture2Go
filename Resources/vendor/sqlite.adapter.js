/*
 * This module shows how you can cache remote SQLite databases
 * Parameters:
 * url<String> == url of database 
 * tablecount<Number> = aspected count of tables in database (for validation)
 * Methods:
 * startmirror == start mirroring
 * testdb      == tests db 
 * Events:
 * onloaded    == if databse is ready to use and can be opened
 *         payload:
 * 				success : true or false
 * 				mtime   : (optional) the age of database	
 * onprogress  == during mirroring you get progress (0...1) 
 * 		   payload:
 * 				ratio : (0..1)		
 * 
 *
*/
var DB = function() {
	this.options = arguments[0] || {};
	this.eventhandlers = {};
	this.dbname = Ti.Utils.md5HexDigest(options.url);
	function getNumberofTables() {
		if (!dbname)
			return;
		var link = Ti.Database.open(dbname);
		var res = link.execute('SELECT count(*) total FROM sqlite_master WHERE type="table" order by name');
		if (res.isValidRow()) {
			var total = res.fieldByName('total');
			res.close();
			link.close();
			return total;
		}
		link.close();
	};

	var onOffline = function() {
		console.log('Info: offline node ==> try to open cached db');
		DBconn = Ti.Database.open(dbname);
		var res = DBconn.execute('SELECT count(*) total FROM sqlite_master WHERE type="table" order by name');
		if (res.isValidRow()) {
			var total = res.fieldByName('total');
			console.log('Info: tables found=' + total + ' aspectedtablecount=' + options.aspectedtablecount);
			res.close();

			if (total == options.aspectedtablecount && options.onload) {
				Ti.Android && Ti.UI.createNotification({
					message : "Keine neue Version verfügbar, nutze Daten der letzten Mutzung.",
					duration : Ti.UI.NOTIFICATION_DURATION_LONG
				}).show();
				options.onload({
					dbname : dbname,
					tables : total
				});
			} else {
				if (Ti.Android)
					DBconn.remove();
				else
					DBconn.file.deleteFile();
				alert('Für die Aktualisierung der Daten braucht die App wenigstens einmal das Internet');
				return;
			}
		} else {
			if (Ti.Android)
				DBconn.remove();
			else
				DBconn.file.deleteFile();
			alert('Für die Aktualisierung der Daten braucht die App wenigstens einmal das Internet');
		}
	};
	var self = this;
	var DBconn = undefined;
	var dbname = Ti.Utils.md5HexDigest(options.url);
	if (!options.mirror) {
		options.onload && options.onload({
			dbname : dbname,
			numberoftables : getNumberofTables()
		});
		return;
	}
	var xhr = Ti.Network.createHTTPClient({
		onerror : onOffline,
		ondatastream : function(_p) {
			if (options.onprogress) {
				if (_p.progress < 0)
					_p.progress = (1 - _p.progress / options.aspectedcontentlength) / 2;
				options.onprogress(_p.progress);
			}
		},
		onload : function() {
			var filename = dbname + '.sql';
			console.log('Info: dbfilename=' + filename);
			var tempfile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), filename);
			tempfile.write(this.responseData);
			try {
				var dummy = Ti.Database.open(dbname);
				if (Ti.Android) {
					dummy.close();
					dummy.remove();
				} else {
					console.log('Info: try to remove ' + dummy.file);
					dummy.file.deleteFile();
				}
			} catch(E) {
				onOffline();
				return;
			}
			DBconn = Ti.Database.install(tempfile.nativePath, dbname);
			DBconn.close();
			var numberoftables = getNumberofTables();
			options.onload && options.onload({
				dbname : dbname,
				numberoftables : numberoftables
			});
		}
	});
	console.log(options);
	xhr.open('GET', options.url);
	xhr.send();

};

DB.prototype = {/* standard methods for event/observer pattern */
	fireEvent : function(_event, _payload) {
		if (this.eventhandlers[_event]) {
			for (var i = 0; i < this.eventhandlers[_event].length; i++) {
				this.eventhandlers[_event][i].call(this, _payload);
			}
		}
	},
	addEventListener : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			this.eventhandlers[_event] = [];
		this.eventhandlers[_event].push(_callback);
	},
	removeEventListener : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			return;
		var newArray = this.eventhandlers[_event].filter(function(element) {
			return element != _callback;
		});
		this.eventhandlers[_event] = newArray;
	}
};

module.exports = DB;
