exports.create = function(_args) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = Ti.UI.createImageView({
		image : 'http://qrfree.kaywa.com/?l=1&s=8&d=AAA',
		width : w / 14,
		right : w / 14,
		borderRadius : 5,
		right : w / 3.8,
		opacity : 0.8
	});
	self.addEventListener('click', function() {
		var Barcode = require('ti.barcode');
		Barcode.allowRotation = true;
		Barcode.displayedMessage = '';
		Barcode.useLED = false;
		Barcode.capture({
			animate : false,
			showCancel : true,
			keepOpen : false
		});
		Barcode.addEventListener('cancel', function(_e) {
			console.log('barcodecancel ' + typeof (_callback));
			if (Ti.Platform.model == 'Simulator')
				Ti.App.Model.readScannnedURL({
					qr : 'http://lecture2go.uni-hamburg.de/veranstaltungen/-/v/10197',
					onsuccess : _args.onsuccess
				});
		});
		Barcode.addEventListener('success', function(_e) {
			Ti.App.Model.readScannnedURL({
				qr : _e.result,
				onsuccess : _args.onsuccess
			});
			Barcode.cancel();
		});
	});
	return self;
}
