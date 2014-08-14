/*
 * This module shows how you can cache remote SQLite databases
 * Parameters:
 * url<String> == url of database
 * numberoftables<Number> = aspected count of tables in database (optional)
 * aspecttables<Array>      = aspected table names (optional)
 * Methods:
 * mirror == start mirroring
 * testdb      == tests SQLiteAdapter on tablecount
 * Events:
 * load      == if databse is ready to use and can be opened
 *         payload:
 * 				success : true or false
 * 				dbname  : (String) database name
 * 				mtime   : (optional) the age of database
 * progress  == during mirroring you get progress (0...1)
 * 		   payload:
 * 				ratio : (0..1)
 *
 * error      == if database is dead and cannot mirror
 *
 * Usage:
 *
 * var Db = new (require('sqlite.adapter'))('http://MYURL',2,['main','labels']);
 * Db.mirror();
 * Db.on('load',function(_e) {
 * 		if (_e.success==true) Ti.Database.open(_e.dbname);
 * });
 *
 */

function SQLiteAdapter(_url, _numberoftables, _aspectedtables) {
	/*if (this.toType != 'sqliteadapter')
	 return new SQLiteAdapter();*/
	this.url = _url || '';
	this.numberoftables = _numberoftables;
	this.aspectedtables = _aspectedtables || [];
	this.eventhandlers = {};
	this.dbname = Ti.Utils.md5HexDigest(this.url);
	console.log(this);
	console.log('TYPE='+this.toType());
	return this;
};

SQLiteAdapter.prototype = {
	// private functions
	_onOffline : function() {
		this.trigger('offline');
		console.log('Info: offline node ==> try to open cached db');
		if (this.testdb == true)
			that.trigger('load', {
				success : true,
				dbname : that.dbname
			});
		else
			that.trigger('error', {});
	},
	// public functions;
	testdb : function() {
		if (!this.dbname)
			return;
		console.log('Info: test of valide database');
		var tables = [];
		var dbconnection= Ti.Database.open(this.dbname);
		console.log(dbconnection);
		var res = dbconnection.execute('SELECT tbl_name AS name FROM sqlite_master WHERE type="table" AND tbl_name <> "android_metadata" ORDER BY tbl_name');
		while (res.isValidRow()) {
			tables.push(res.fieldByName('name'));
			res.next();
		}
		res.close();
		dbconnection.close();
		// Testing
		var error = false;
		switch (true) {
		case (this.numberoftables && (this.numberoftables != tables.length)) :
			console.log('Error: wrong number of tables. aspected=' + this.numberoftables + ', real=' + tables.count);
			error = true;
			break;
		case (this.aspecttables  && this.aspecttables !=[]  && (this.aspecttables.join() != tables.join())):
			console.log('Error: wrong list of tables.');
			error = true;
			break;
		case (!this.aspecttables && !this.numberoftables && !tables.count) :
			error = true;
			break;
		}
		if (error == true) {
			if (Ti.Android)
				dbconnection.remove();
			else
				dbconnection.file.deleteFile();
			return false;
		}
		return true;
	},
	mirror : function() {
		var that = this;
		this.trigger('mirrorstart');
		var xhr = Ti.Network.createHTTPClient({
			onerror : that._onOffline,
			ondatastream : function(_p) {
				that.trigger('progress', {
					progress : _p.progress
				});
			},
			onload : function() {
				console.log('Info: *.sqlite  received, size=' + this.responseData.length);
				var filename = that.dbname + '.sql';
				var tempfile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), filename);
				tempfile.write(this.responseData);
				try {
					var dummy = Ti.Database.open(that.dbname);
					if (Ti.Android) {
						dummy.close();
						dummy.remove();
					} else {
						console.log('Info: try to remove ' + dummy.file);
						dummy.file.deleteFile();
					}
				} catch(E) {
					console.log(E);
					that._onOffline();
					return;
				}
				var dbconn = Ti.Database.install(tempfile.nativePath, that.dbname);
				dbconn.close();
				if (that.testdb() == true)
					that.trigger('load', {
						success : true,
						dbname : that.dbname
					});
			}
		});
		xhr.open('GET', that.url);
		xhr.send();
	},

	// standard methods for event/observer pattern
	trigger : function(_event, _payload) {
		if (this.eventhandlers[_event]) {
			for (var i = 0; i < this.eventhandlers[_event].length; i++) {
				this.eventhandlers[_event][i].call(this, _payload);
			}
		}
	},
	on : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			this.eventhandlers[_event] = [];
		this.eventhandlers[_event].push(_callback);
	},
	off : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			return;
		var newArray = this.eventhandlers[_event].filter(function(element) {
			return element != _callback;
		});
		this.eventhandlers[_event] = newArray;
	}
};

module.exports = SQLiteAdapter;
