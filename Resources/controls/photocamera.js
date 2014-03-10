module.exports = function() {

	Ti.Media.showCamera({
		success : function(event) {
			Ti.App.Apiomat.saveUserPhoto({
				image : event.media
			}, {
				onload : function() {
				}
			});
		},
		cancel : function() {
		},
		error : function(error) {
		},
		saveToPhotoGallery : true,
		allowEditing : true,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
	setTimeout(function() { // better would be onshow, but this event doesn't exist
		Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
	}, 5000);
};
