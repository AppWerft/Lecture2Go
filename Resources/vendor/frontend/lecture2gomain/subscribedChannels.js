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
    goog.provide('Apiomat.subscribedChannels');
    goog.require('Apiomat.AbstractClientDataModel');
}
if(typeof exports === 'undefined')
{
    var Apiomat = Apiomat || {};
}
(function(Apiomat)
{
Apiomat.subscribedChannels = function() {
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
Apiomat.subscribedChannels.getsubscribedChannelss = function(query, callback) {
    Apiomat.Datastore.getInstance().loadListFromServerWithClass(Apiomat.subscribedChannels, query, callback);
};

/* inheritance */
Apiomat.subscribedChannels.prototype = new Apiomat.AbstractClientDataModel();
Apiomat.subscribedChannels.prototype.constructor = Apiomat.subscribedChannels;


Apiomat.subscribedChannels.prototype.getSimpleName = function() {
    return "subscribedChannels";
};

Apiomat.subscribedChannels.prototype.getModuleName = function() {
    return "lecture2goMain";
};

/* easy getter and setter */

        Apiomat.subscribedChannels.prototype.getChannel = function() 
{
    return this.data.channel;
};

Apiomat.subscribedChannels.prototype.setChannel = function(_channel) {
    this.data.channel = _channel;
};

        Apiomat.subscribedChannels.prototype.getLectureseriesId = function() 
{
    return this.data.lectureseriesId;
};

Apiomat.subscribedChannels.prototype.setLectureseriesId = function(_lectureseriesId) {
    this.data.lectureseriesId = _lectureseriesId;
};
})(typeof exports === 'undefined' ? Apiomat
        : exports);