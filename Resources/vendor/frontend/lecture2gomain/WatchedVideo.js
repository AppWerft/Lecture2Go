/*
 * Copyright (c) 2011-2013, Apinauten GmbH
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this 
 *    list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice, 
 *    this list of conditions and the following disclaimer in the documentation 
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * THIS FILE IS GENERATED AUTOMATICALLY. DON'T MODIFY IT.
 */
 
/* define namespace */

if(typeof goog !== 'undefined')
{
    goog.provide('Apiomat.WatchedVideo');
    goog.require('Apiomat.AbstractClientDataModel');
}
if(typeof exports === 'undefined')
{
    var Apiomat = Apiomat || {};
}
(function(Apiomat)
{
Apiomat.WatchedVideo = function() {
    this.data = new Object();
    /* referenced object methods */
};
/* static methods */

/**
* Returns a list of objects of this class from server.
*
* If query is given than returend list will be filtered by the given query
*
* @param query (optional) a query filtering the results in SQL style (@see <a href="http://doc.apiomat.com">documentation</a>)
* @param withReferencedHrefs set to true to get also all HREFs of referenced models
*/
Apiomat.WatchedVideo.getWatchedVideos = function(query, callback) {
    Apiomat.Datastore.getInstance().loadListFromServerWithClass(Apiomat.WatchedVideo, query, callback);
};

/* inheritance */
Apiomat.WatchedVideo.prototype = new Apiomat.AbstractClientDataModel();
Apiomat.WatchedVideo.prototype.constructor = Apiomat.WatchedVideo;


Apiomat.WatchedVideo.prototype.getSimpleName = function() {
    return "WatchedVideo";
};

Apiomat.WatchedVideo.prototype.getModuleName = function() {
    return "lecture2goMain";
};

/* easy getter and setter */

        Apiomat.WatchedVideo.prototype.getDevicename = function() 
{
    return this.data.devicename;
};

Apiomat.WatchedVideo.prototype.setDevicename = function(_devicename) {
    this.data.devicename = _devicename;
};

        Apiomat.WatchedVideo.prototype.getVideoid = function() 
{
    return this.data.videoid;
};

Apiomat.WatchedVideo.prototype.setVideoid = function(_videoid) {
    this.data.videoid = _videoid;
};

        Apiomat.WatchedVideo.prototype.getVideo = function() 
{
    return this.data.video;
};

Apiomat.WatchedVideo.prototype.setVideo = function(_video) {
    this.data.video = _video;
};

        Apiomat.WatchedVideo.prototype.getLastposition = function() 
{
    return this.data.lastposition;
};

Apiomat.WatchedVideo.prototype.setLastposition = function(_lastposition) {
    this.data.lastposition = _lastposition;
};

   Apiomat.WatchedVideo.prototype.getLatlngLatitude = function() 
{
    var locArr = this.data.latlng;
    if(locArr)
    {
        return locArr[0];
    }
};

Apiomat.WatchedVideo.prototype.getLatlngLongitude = function() 
{
    var locArr = this.data.latlng;
    if(locArr)
    {
        return locArr[1];
    }
};

Apiomat.WatchedVideo.prototype.setLatlngLatitude = function(_latitude) 
{
    var locArr = this.data.latlng;
    if(!locArr)
    {
        locArr = [_latitude, undefined];
    }
    else
    {
        locArr[0] = _latitude;
    }
    this.data.latlng = locArr;
};

Apiomat.WatchedVideo.prototype.setLatlngLongitude = function(_longitude) 
{
    var locArr = this.data.latlng;
    if(!locArr)
    {
        locArr = [0, _longitude];
    }
    else
    {
        locArr[1] = _longitude;
    }
    this.data.latlng = locArr;
};

    Apiomat.WatchedVideo.prototype.getWatched = function() 
{
    var retDate = this.data.watched;
    return (typeof retDate != 'undefined')? new Date(retDate) : undefined;
};
    Apiomat.WatchedVideo.prototype.setWatched = function(_watched) 
{
    this.data.watched = _watched.getTime();
};
    })(typeof exports === 'undefined' ? Apiomat
        : exports);