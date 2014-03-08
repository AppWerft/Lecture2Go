var AssetsStorage = function() {
	var options = arguments[0] || {};
	this.folder = options.cachefolder || 'cache';
	this.maxsize = options.maxsize || Ti.App.Properties.getInt('cachemaxsize') || 10000;
	// MB
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
