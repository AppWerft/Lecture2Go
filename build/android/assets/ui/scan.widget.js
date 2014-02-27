exports.create = function() {
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
	});
	Barcode.addEventListener('success', function(_e) {
		var regex = /\/([\d]+)$/;
		var res = regex.exec(_e.result);
		if (res) {
			console.log(res[1]);
			Barcode.cancel();
			var win = require('ui/videohomepage.window').create(res[1]);
			win.open();
		}
	});
	return self;
};
