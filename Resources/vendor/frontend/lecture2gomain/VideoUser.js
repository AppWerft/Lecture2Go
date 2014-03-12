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
    goog.provide('Apiomat.VideoUser');
    goog.require('Apiomat.User');
    goog.require('Apiomat.WatchedVideo');
    goog.require('Apiomat.WatchedVideo');
    goog.require('Apiomat.subscribedChannels');
}
if(typeof exports === 'undefined')
{
    var Apiomat = Apiomat || {};
}
(function(Apiomat)
{
Apiomat.VideoUser = function() {
    this.data = new Object();
    this.data["dynamicAttributes"] = {};
    
    this.initDatastoreWithMembersCredentialsIfNeeded = function() {
        //if the datastore is not initialized then do so
        if(Apiomat.Datastore.getInstance().getUsername() == undefined && Apiomat.Datastore.getInstance().getPassword() == undefined) {
            if(this.getUserName() != undefined && this.getPassword() != undefined) {
                Apiomat.Datastore.configure(this);
            } else {
                throw new Error("Please set userName and password first for member!");
            }
        }
    };
    
    /* override save function */
    this.save = function(_callback) {
        this.initDatastoreWithMembersCredentialsIfNeeded();
        Apiomat.AbstractClientDataModel.prototype.save.apply(this, [_callback]);
    };

    /* Requests a new password; user will receive an email to confirm*/
    this.requestNewPassword = function() {
        var callback = {
            onOk : function(refHref) {
            },
            onError : function(error) {
            }
        };
        Apiomat.Datastore.getInstance().postOnServer(this, callback, "models/requestResetPassword/" );
    };
    
    /**
    * Reset password 
    * @param newPassword the new password
    */
    this.resetPassword = function(newPassword, _callback) {
        var internCallback = {
            onOk : function() {
                this.parent.setOffline(this.wasLocalSave || false);
                Apiomat.Datastore.configure(this.parent);
                if (_callback && _callback.onOk)
                {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        internCallback.parent = this;
        this.setPassword( newPassword );
        if(Apiomat.Datastore.getInstance().shouldSendOffline("PUT"))
        {
            internCallback.wasLocalSave = true;
            Apiomat.Datastore.getInstance( ).sendOffline( "PUT", this.getHref(), this, undefined, internCallback );
        }
        else
        {
            Apiomat.Datastore.getInstance().updateOnServer(this, internCallback);
        }
    };
    /* referenced object methods */
    
    var mywatched = [];
    
    this.getMywatched = function() 
    {
        return mywatched;
    };
    
    this.loadMywatched = function(query,callback) 
    {
        var refUrl = this.data.mywatchedHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                mywatched = obj;
                callback.onOk();
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.WatchedVideo);
    };
    
    this.postMywatched = function(_refData, _callback) 
    {
        if(_refData == false || typeof _refData.getHref() === 'undefined') {
            var error = new Apiomat.ApiomatRequestError(Apiomat.Status.SAVE_REFERENECE_BEFORE_REFERENCING);
            if (_callback && _callback.onError) {
                    _callback.onError(error);
            } else if(console && console.log) {
                    console.log("Error occured: " + error);
            }
            return;
        }
        var callback = {
            onOk : function(refHref) {
                if (refHref) {
                                    /* only add reference data if not already in local list */
                    if(mywatched.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        mywatched.push(_refData);
                    } 
                                }
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
         if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
        {
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "mywatched", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.mywatchedHref);
        }
    };
    
    this.removeMywatched = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.mywatchedHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = mywatched.indexOf(_refData);
                if(i != -1) {
                    mywatched.splice(i, 1);
                }
            ;                 
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        Apiomat.Datastore.getInstance().deleteOnServer(deleteHref, callback);
    };    
    
    var myfavorites = [];
    
    this.getMyfavorites = function() 
    {
        return myfavorites;
    };
    
    this.loadMyfavorites = function(query,callback) 
    {
        var refUrl = this.data.myfavoritesHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                myfavorites = obj;
                callback.onOk();
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.WatchedVideo);
    };
    
    this.postMyfavorites = function(_refData, _callback) 
    {
        if(_refData == false || typeof _refData.getHref() === 'undefined') {
            var error = new Apiomat.ApiomatRequestError(Apiomat.Status.SAVE_REFERENECE_BEFORE_REFERENCING);
            if (_callback && _callback.onError) {
                    _callback.onError(error);
            } else if(console && console.log) {
                    console.log("Error occured: " + error);
            }
            return;
        }
        var callback = {
            onOk : function(refHref) {
                if (refHref) {
                                    /* only add reference data if not already in local list */
                    if(myfavorites.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        myfavorites.push(_refData);
                    } 
                                }
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
         if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
        {
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "myfavorites", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.myfavoritesHref);
        }
    };
    
    this.removeMyfavorites = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.myfavoritesHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = myfavorites.indexOf(_refData);
                if(i != -1) {
                    myfavorites.splice(i, 1);
                }
            ;                 
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        Apiomat.Datastore.getInstance().deleteOnServer(deleteHref, callback);
    };    
    
    var mysubscribedchannels = [];
    
    this.getMysubscribedchannels = function() 
    {
        return mysubscribedchannels;
    };
    
    this.loadMysubscribedchannels = function(query,callback) 
    {
        var refUrl = this.data.mysubscribedchannelsHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                mysubscribedchannels = obj;
                callback.onOk();
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.subscribedChannels);
    };
    
    this.postMysubscribedchannels = function(_refData, _callback) 
    {
        if(_refData == false || typeof _refData.getHref() === 'undefined') {
            var error = new Apiomat.ApiomatRequestError(Apiomat.Status.SAVE_REFERENECE_BEFORE_REFERENCING);
            if (_callback && _callback.onError) {
                    _callback.onError(error);
            } else if(console && console.log) {
                    console.log("Error occured: " + error);
            }
            return;
        }
        var callback = {
            onOk : function(refHref) {
                if (refHref) {
                                    /* only add reference data if not already in local list */
                    if(mysubscribedchannels.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        mysubscribedchannels.push(_refData);
                    } 
                                }
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
         if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
        {
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "mysubscribedchannels", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.mysubscribedchannelsHref);
        }
    };
    
    this.removeMysubscribedchannels = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.mysubscribedchannelsHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = mysubscribedchannels.indexOf(_refData);
                if(i != -1) {
                    mysubscribedchannels.splice(i, 1);
                }
            ;                 
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        Apiomat.Datastore.getInstance().deleteOnServer(deleteHref, callback);
    };    
};
/* static constants */
Apiomat.VideoUser.AOMBASEURL = "https://apiomat.org/yambas/rest/apps/lecture2go";
Apiomat.VideoUser.AOMAPIKEY = "7597029286098615760";
Apiomat.VideoUser.AOMSYS = "LIVE";
Apiomat.VideoUser.AOMSDKVERSION = "1.11-105";
/* static methods */

/**
* Returns a list of objects of this class from server.
*
* If query is given than returend list will be filtered by the given query
*
* @param query (optional) a query filtering the results in SQL style (@see <a href="http://doc.apiomat.com">documentation</a>)
* @param withReferencedHrefs set to true to get also all HREFs of referenced models
*/
Apiomat.VideoUser.getVideoUsers = function(query, callback) {
    Apiomat.Datastore.getInstance().loadListFromServerWithClass(Apiomat.VideoUser, query, callback);
};

/* inheritance */
Apiomat.VideoUser.prototype = new Apiomat.User();
Apiomat.VideoUser.prototype.constructor = Apiomat.VideoUser;

/**
* Updates this class from server.
* Be sure that userName and password is set
*/
Apiomat.VideoUser.prototype.loadMe = function(callback) {
    this.initDatastoreWithMembersCredentialsIfNeeded();
    Apiomat.Datastore.getInstance().loadFromServer("models/me", callback, this);
};

Apiomat.VideoUser.prototype.getSimpleName = function() {
    return "VideoUser";
};

Apiomat.VideoUser.prototype.getModuleName = function() {
    return "lecture2goMain";
};

/* easy getter and setter */

        Apiomat.VideoUser.prototype.getMywatched = function() 
{
    return this.data.mywatched;
};

Apiomat.VideoUser.prototype.setMywatched = function(_mywatched) {
    this.data.mywatched = _mywatched;
};

    /**
 * Returns an URL of the image. <br/> You can provide several optional parameters to
 * manipulate the image:
 * 
 * @param width (optional)
 *            the width of the image, 0 to use the original size. If only width
 *            or height are provided, the other value is computed.
 * @param height (optional)
 *            the height of the image, 0 to use the original size. If only width
 *            or height are provided, the other value is computed.
 * @param backgroundColorAsHex (optional)
 *            the background color of the image, null or empty uses the original
 *            background color. Caution: Don't send the '#' symbol! Example:
 *            <i>ff0000</i>
 * @param alpha (optional)
 *            the alpha value of the image (between 0 and 1), null to take the original value.
 * @param format (optional)
 *            the file format of the image to return, e.g. <i>jpg</i> or <i>png</i>
  * @return the URL of the image
 */
Apiomat.VideoUser.prototype.getPhotoURL = function(width, height, bgColorAsHex, alpha, format) 
{
    var url = this.data.photoURL;
    if(!url)
    {
        return undefined;
    }
    url += ".img?apiKey=" + Apiomat.User.AOMAPIKEY + "&system=" + Apiomat.User.AOMSYS;
    if (width) {
        url += "&width=" + width;
    }
    if (height) {
        url += "&height=" + height;
    }
    if (bgColorAsHex) {
        url += "&bgcolor=" + bgColorAsHex;
    }
    if (alpha) {
        url += "&alpha=" + alpha;
    }
    if (format) {
        url += "&format=" + format;
    }
    return url;
}

Apiomat.VideoUser.prototype.loadPhoto = function(width, height, bgColorAsHex, alpha, format,_callback)
{
    var resUrl = this.getPhotoURL(width, height, bgColorAsHex, alpha, format);
    return Apiomat.Datastore.getInstance().loadResource(resUrl, _callback);
}

Apiomat.VideoUser.prototype.postPhoto = function(_data, _callback) 
{
    var postCB = {
            onOk : function(_imgHref) {
                if (_imgHref) {
                    this.parent.data.photoURL = _imgHref;
                    /* update model again */
                    this.parent.save({
                        onOk : function() {
                            if (_callback && _callback.onOk) {
                                _callback.onOk();
                            }           
                        },
                        onError : function(error) {
                            if (_callback && _callback.onError) {
                                _callback.onError(error);
                            }
                        }
                    });
                }
                else {
                    var error = new Apiomat.ApiomatRequestError(Apiomat.Status.HREF_NOT_FOUND);
                    if (_callback && _callback.onError) {
                        _callback.onError(error);
                    } else if(console && console.log) {
                        console.log("Error occured: " + error);
                    }
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
    };
    postCB.parent = this;
    if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
    {
        Apiomat.Datastore.getInstance( ).sendOffline( "POST", null, _data, true, postCB );
    }
    else
    {
        Apiomat.Datastore.getInstance().postStaticDataOnServer(_data, true, postCB);
    }
};

Apiomat.VideoUser.prototype.deletePhoto = function(_callback) 
{
    var imageHref = this.data.photoURL;

    var deleteCB = {
        onOk : function() {
            delete this.parent.data.photoURL;
            /* update model again and save deleted image reference in model */
            this.parent.save({
                onOk : function() {
                    if (_callback && _callback.onOk) {
                        _callback.onOk();
                    }           
                },
                onError : function(error) {
                    if (_callback && _callback.onError) {
                        _callback.onError(error);
                    }
                }
            });
        },
        onError : function(error) {
            if (_callback && _callback.onError) {
                _callback.onError(error);
            }
        }
    };
    deleteCB.parent = this;
    if(Apiomat.Datastore.getInstance().shouldSendOffline("DELETE"))
    {
        Apiomat.Datastore.getInstance( ).sendOffline( "DELETE", imageHref, null, null, deleteCB );
    }
    else
    {
        Apiomat.Datastore.getInstance().deleteOnServer(imageHref, deleteCB);
    }
};

        Apiomat.VideoUser.prototype.getMyfavorites = function() 
{
    return this.data.myfavorites;
};

Apiomat.VideoUser.prototype.setMyfavorites = function(_myfavorites) {
    this.data.myfavorites = _myfavorites;
};

        Apiomat.VideoUser.prototype.getFkennung = function() 
{
    return this.data.fkennung;
};

Apiomat.VideoUser.prototype.setFkennung = function(_fkennung) {
    this.data.fkennung = _fkennung;
};

        Apiomat.VideoUser.prototype.getMysubscribedchannels = function() 
{
    return this.data.mysubscribedchannels;
};

Apiomat.VideoUser.prototype.setMysubscribedchannels = function(_mysubscribedchannels) {
    this.data.mysubscribedchannels = _mysubscribedchannels;
};
})(typeof exports === 'undefined' ? Apiomat
        : exports);