/*
 * This module shows how you can cache remote SQLite databases
 * Parameters:
 * url<String> == url of database
 * tablecount<Number> = aspected count of tables in database (for validation)
 * Methods:
 * mirror == start mirroring
 * testdb      == tests db on tablecount
 * Events:
 * onload      == if databse is ready to use and can be opened
 *         payload:
 * 				success : true or false
 * 				dbname  : (String) database name
 * 				mtime   : (optional) the age of database
 * onprogress  == during mirroring you get progress (0...1)
 * 		   payload:
 * 				ratio : (0..1)
 *
 * Usage:
 *
 * var dbmodule = new (require('sqlite.adapter'))('http://URLtoSQLiteDB');
 * dbmodule.startmirror();
 * dbmodule.addEventListener('onload',function(_e) {
 * 		if (_e.success==true) Ti.Database.open(_e.dbname);
 * });
 *
 */
var DB = function() {
	this.options = arguments[0] || {};
	this.eventhandlers = {};
	this.dbname = Ti.Utils.md5HexDigest(this.options.url);
};

DB.prototype = {
	/* private functions */
	_onOffline : function() {
		console.log('Info: offline node ==> try to open cached db');
		DBconn = Ti.Database.open(dbname);
		var res = DBconn.execute('SELECT count(*) total FROM sqlite_master WHERE type="table" order by name');
		if (res.isValidRow()) {
			var total = res.fieldByName('total');
			console.log('Info: tables found=' + total + ' aspectedtablecount=' + options.aspectedtablecount);
			res.close();
			if (that.options.tablecount  == that._getNumberofTables()) {
					that.fireEvent('onload', {
						success : true,
						dbname : that.dbname
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
	},
	_getNumberofTables : function() {
		if (!this.dbname)
			return;
		var link = Ti.Database.open(this.dbname);
		var res = link.execute('SELECT count(*) total FROM sqlite_master WHERE type="table" order by name');
		if (res.isValidRow()) {
			var total = res.fieldByName('total');
			res.close();
			link.close();
			return total;
		}
		link.close();
	},
	/* public functions; */
	mirror : function() {
		var that = this;
		var xhr = Ti.Network.createHTTPClient({
			onerror : that._onOffline,
			ondatastream : function(_p) {
				that.fireEvent('progress', {
					progress : _p.progress
				});
			},
			onload : function() {
				var filename = dbname + '.sql';
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
					that._onOffline();
					return;
				}
				var DBconn = Ti.Database.install(tempfile.nativePath, dbname);
				DBconn.close();
				if (that.options.tablecount  == that._getNumberofTables())
					that.fireEvent('onload', {
						success : true,
						dbname : that.dbname
					});
			}
		});
		xhr.open('GET', that.options.url);
		xhr.send();
	},

	/* standard methods for event/observer pattern */
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
