exports.get = function(_args, _callbacks) {
	var fn = Ti.Utils.md5HexDigest(_args.url) + '.png';
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fn);
	if (file.exists()) {
		_callback.onload(file.nativePath);
	} else {
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				file.write(this.responseData);
				_callbacks.onload(file.nativePath); 
			}
		});
		xhr.open('GET', _args.url);
		xhr.send();
	}
};
