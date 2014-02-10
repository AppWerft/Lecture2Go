exports.getDB = function(_args) {
	function getNumberofTables() {
		if (!dbname) return;
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
	var self = this;
	var DBconn = undefined;
	var dbname = Ti.Utils.md5HexDigest(_args.url);
	var onOffline = function() {
		console.log('Info: offline node ==> try to open cached db');
		DBconn = Ti.Database.open(dbname);
		var res = DBconn.execute('SELECT count(*) total FROM sqlite_master WHERE type="table" order by name');
		if (res.isValidRow()) {
			var total = res.fieldByName('total');
			console.log('Info: tables found=' + total + ' aspectedtablecount=' + _args.aspectedtablecount);
			res.close();
			if (total == _args.aspectedtablecount && _args.onload) {
				Ti.Android && Ti.UI.createNotification({
					message : "Keine neue Version verfügbar, nutze Daten der letzten Mutzung.",
					duration : Ti.UI.NOTIFICATION_DURATION_LONG
				}).show();
				_args.onload({
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
	var xhr = Ti.Network.createHTTPClient({
		onerror : onOffline,
		ondatastream : function(_p) {
			if (_args.onprogress) {
				if (_p.progress < 0)
					_p.progress = (1 - _p.progress / _args.aspectedcontentlength) / 2;
				_args.onprogress(_p.progress);
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
			_args.onload && _args.onload({
				dbname : dbname,
				numberoftables : numberoftables
			});
		}
	});
	xhr.open('GET', _args.url);
	xhr.send();
};
