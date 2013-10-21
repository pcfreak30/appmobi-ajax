(function () {
    document.addEventListener("appMobi.device.remote.data", getRemoteExtCB, false);
    var ajaxCallbacks = [];

    function getRemoteExtCB(obj) {
        if (ajaxCallbacks.length > 0 && ajaxCallbacks[obj.id]) {
            ajaxCallbacks[obj.id](obj);
        }
    }
    MobileXMLHttpRequest.Extension = new Object;

    MobileXMLHttpRequest.Extension.addObject = function (object) {
        uniqueId = Math.floor(Math.random() * 99999999);
        object.uniqueId = uniqueId;
        this[uniqueId] = object;
        return uniqueId;
    }

    MobileXMLHttpRequest.Extension.sendXMLHTTP = function (data) {
        var myparams = new AppMobi.Device.RemoteDataParameters();
        for (var j in data.headers) {
            myparams.addHeader(j, data.headers[j]);
        }

        myparams.url = data.requestData.URL;
        myparams.id = data.uniqueId;
        myparams.method = data.requestData.method
        myparams.body = data.body;
		try{
		if(typeof myparams.body=="object"){
		    myparams.body=JSON.stringify(myparams.body);
		}
        ajaxCallbacks[myparams.id] = this.handleResponseData;
        AppMobi.device.getRemoteDataExt(myparams);
		}
		catch(e){}
    }

    MobileXMLHttpRequest.Extension.handleResponseData = function (object) {

        var XMLObj = MobileXMLHttpRequest.Extension[object.id];
        //EMULATED "HEADERS RECEIVED" CHANGES
        var newHeaders = [];
       
	   if(object.success == false)
	   {
			XMLObj.response = null;
			XMLObj.status = null;
			XMLObj.responseText = null;
			XMLObj.responseXML = null;
			XMLObj.readyState = XMLObj.DONE;

			if (typeof XMLObj.onerror == 'function') XMLObj.onerror();
			if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();		
	   }
	   else
	   {
			for (var j in object.extras.headers) {
				newHeaders[j.toLowerCase()] = object.extras.headers[j]; //jQuery looks for lowercase
				newHeaders[j] = object.extras.headers[j];
			}
			XMLObj.responseData.headers = newHeaders;
			XMLObj.readyState = XMLObj.HEADERS_RECEIVED;
			if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();
	
			XMLObj.readyState = XMLObj.LOADING;
			if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();
	
			XMLObj.response = object.response;
			XMLObj.status = object.extras.status;
			XMLObj.responseText = object.response;
			XMLObj.responseXML = object.response;
			XMLObj.readyState = XMLObj.DONE;
	
			if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();
			if (typeof XMLObj.onloadstart == 'function') XMLObj.onloadstart();
			if (typeof XMLObj.onload == 'function') XMLObj.onload();
	   }
    }


    // XMLHTTP REDEFINE
    //======================c=================================================================================================
    //DEFINE "CONSTANTS" FOR CONSTRUCTOR
    MobileXMLHttpRequest.UNSENT = 0; //const
    MobileXMLHttpRequest.OPENED = 1; //const
    MobileXMLHttpRequest.HEADERS_RECEIVED = 2; //const
    MobileXMLHttpRequest.LOADING = 3; //const
    MobileXMLHttpRequest.DONE = 4; //const

    //DEFINE "CONSTANTS" PROTOTYPE
    MobileXMLHttpRequest.prototype.UNSENT = 0; //const
    MobileXMLHttpRequest.prototype.OPENED = 1; //const
    MobileXMLHttpRequest.prototype.HEADERS_RECEIVED = 2; //const
    MobileXMLHttpRequest.prototype.LOADING = 3; //const
    MobileXMLHttpRequest.prototype.DONE = 4; //const
    //MobileXMLHttpRequest = {readyState:0 };
    MobileXMLHttpRequest.prototype.open;
    MobileXMLHttpRequest.prototype.readyState = 0;
    MobileXMLHttpRequest.prototype.onreadystatechange;
    MobileXMLHttpRequest.prototype.headers = {};
    MobileXMLHttpRequest.prototype.body = "";



    MobileXMLHttpRequest.prototype.requestData = {
        'method': null,
        'URL': null,
        'asynchronous': true,
        'username': null,
        'password': null,
        'headers': null
    };
    MobileXMLHttpRequest.prototype.responseData = {
        'headers': null
    };


    MobileXMLHttpRequest.prototype.abort = function abort() {throw(new Error("abort() is not implemented in the AppMobi XMLHtppRequest object at this time."));};
    MobileXMLHttpRequest.prototype.addEventListener = function addEventListener(eventType, listener, useCapture) {throw(new Error("addEventListener() is not implemented in the AppMobi XMLHtppRequest object at this time."));};
    MobileXMLHttpRequest.prototype.constructor = function MobileXMLHttpRequest() {};
    MobileXMLHttpRequest.prototype.dispatchEvent = function dispatchEvent() {throw(new Error("dispatchEvent() is not implemented in the AppMobi XMLHtppRequest object at this time."));};

    MobileXMLHttpRequest.prototype.getAllResponseHeaders = function getAllResponseHeaders() {
        if (this.readyState == this.OPENED || this.readyState == this.UNSENT) return "";
        else {
            return this.responseData.headers;
        }
    };

    MobileXMLHttpRequest.prototype.getResponseHeader = function getResponseHeader(header) {
        return this.responseData.headers && this.responseData.headers[header] ? this.responseData.headers[header] : "";
    };

    MobileXMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        //supported methods: CONNECT, DELETE, GET, HEAD, OPTIONS, POST, PUT, TRACE, or TRACK
		/*    Empty the list of author request headers.
		Set the request method to method.
		Set the request URL to url.
		Set the request username to temp user.
		Set the request password to temp password.
		Set the asynchronous flag to the value of async.
		*/
        this.requestData.method = method;
        this.requestData.URL = url;
        this.requestData.asynchronous = async;
        this.requestData.user = user;
        this.requestData.password = password;
        this.readyState = this.OPENED;
        if (typeof this.onreadystatechange == 'function') this.onreadystatechange();

    }

    MobileXMLHttpRequest.prototype.overrideMimeType = function overrideMimeType() {};
    MobileXMLHttpRequest.prototype.removeEventListener = function removeEventListener() {};

    MobileXMLHttpRequest.prototype.send = function send(data) {
        this.body = data;
		if(this.requestData.asynchronous===false)
		{
			throw(new Error("Synchronous XMLHtppRequest calls are not allowed.  Please change your request to be asynchronous"));
			return;
		}
        MobileXMLHttpRequest.Extension.sendXMLHTTP(this);
    };

    MobileXMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(header, value) {
        this.headers[header] = value;
    };


    function MobileXMLHttpRequest() {
        MobileXMLHttpRequest.Extension.addObject(this);
        this.onabort = null;
        this.onerror = undefined;
        this.onload = undefined;
        this.onloadstart = undefined;
        this.onprogress = null;
        this.onreadystatechange = null;
        this.readyState = 0;
        this.response = "";
        this.responseText = "";
        this.responseType = "";
        this.responseXML = null;
        this.status = 0;
        this.statusText = "";
        this.withCredentials = false;
        this.requestData = {
            'method': null,
            'URL': null,
            'asynchronous': null,
            'username': null,
            'password': null,
            'headers': null
        };
    }
    window.MobileXMLHttpRequest = MobileXMLHttpRequest;
})();
