module.exports = function() {
	Ti.Media.showCamera({
		success : function(event) {
			Ti.App.Apiomat.savePhoto2User({
				image : event.media
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
};
