/*
 * 
 Parameters:
 
 url: URL of remote SQLITE
 aspectedtablecount: count of aspected tables in db for validierung
 aspectedcontentlength : min. length of sqlite
 onprogress: callback for progress indication, parameter is progress value 0 … 1
 onconnect: callback for success, parameter is dbname
 * 
 * 
 */

exports.mirrorDB = function(_args) {
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
                        if (total == _args.aspectedtablecount && _args.onconnect) {
                                Ti.Android && Ti.UI.createNotification({
                                        message : ('TXT_USINGCACHE'),
                                        duration : Ti.UI.NOTIFICATION_DURATION_LONG
                                }).show();
                                _args.onconnect(dbname);
                        } else {
                                if (Ti.Android)
                                        DBconn.remove();
                                else
                                        DBconn.file.deleteFile();
                                alert(L('TXT_NEED_FIRSTCONNECTIVITY'));
                                return;
                        }
                } else {
                        if (Ti.Android)
                                DBconn.remove();
                        else
                                DBconn.file.deleteFile();
                        alert(L('TXT_NEED_FIRSTCONNECTIVITY'));
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
                                if (Ti.Android)
                                        dummy.remove();
                                else {
                                        console.log('Info: try to remove ' + dummy.file);
                                        dummy.file.deleteFile();
                                }
                        } catch(E) {
                                onOffline();
                                return;
                        }
                        DBconn = Ti.Database.install(tempfile.nativePath, dbname);
                        console.log('Info: DBhandler ' + DBconn);
                        _args.onconnect && _args.onconnect(dbname);
                }
        });
        xhr.open('GET', _args.url);
        xhr.send();
};


/*
Parameters:
url:
onload:


 * 
*/
exports.getRemoteData = function(_options) {
        var md5, url = _options.url;
        var key = Ti.Utils.md5HexDigest(url);
        if (Ti.App.Properties.hasProperty(key)) {
                var data = JSON.parse(Ti.App.Properties.getString(key));
                md5 = Ti.Utils.md5HexDigest(JSON.stringify(data));
                console.log('Info: old json found => onload');
                _options.onload && _options.onload(data);
        }
        var xhr = Ti.Network.createHTTPClient({
                onload : function(e) {
                        console.log(this.status);
                        console.log(e.status);
                        var data;
                        if (this.responseText.match(/<\?xml/)) {
                                var XMLTools = require("vendor/XMLTools");
                                var xmltools = new XMLTools(this.responseText);
                                data = xmltools.toObject();
                                console.log(data);
                        } else
                                data = this.responseText;
                        Ti.App.Properties.setString(key, JSON.stringify(data));
                        if (!md5 || md5 != Ti.Utils.md5HexDigest(JSON.stringify(data)))
                                _options.onload && _options.onload(data);
                },
                onerror : function(e) {
                        console.log('Warning: ' + e.error);
                        if (Ti.App.Properties.hasProperty(key)) {
                                _options.onload && _options.onload(JSON.parse(Ti.App.Properties.getString(key)));
                        } else if (_options.defaultjson) {

                        }
                }
        });
        xhr.open('GET', url, true);
        xhr.send();
        console.log('Info: start data xhr');
};