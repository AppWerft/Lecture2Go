var AssetsStorage = function() {
	var options = arguments[0] || {};
	// name of storage folder:
	this.folder = options.cachefolder || 'cache';
	// max. size for quota in MByte, default 10 GB
	this.maxsize = options.maxsize || Ti.App.Properties.getInt('cachemaxsize') || 10000;
	// on Android: if possible on external SD-card, default true
	this.externalallowed = options.externalallowed || true;
	return this;
};

AssetsStorage.prototype.setAsset = function(_url) {
};
AssetsStorage.prototype.getAsset = function(_url) {
};

AssetsStorage.prototype.deleteAsset = function(_url) {
};

AssetsStorage.prototype.getInfoaboutstorage = function() {
	return {
		used : null,
		quota : null,
		available : null,
		assets : []
	};
};

module.exports = AssetsStorage;
