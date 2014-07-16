/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the xhrManager which interacts with Slim to talk with the server
** 
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/
define([
	'dojo/_base/declare',
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/Deferred",
	"dojo/_base/xhr",
	"dojo/DeferredList"

],function(
	declare,
	lang,
	json,
	Deferred,
	xhrZ,
	DeferredList
){
	var xhrManager = declare([], {
		
		send: function(method, url, args){
			var errorStr;
			switch(method){
				case "get":
				case "GET":
					var dfd = xhrZ.get({
						url:url,
						handleAs: 'json',
						preventCache: true,
						headers: {
							"Content-Type": "application/json"
						},
						content: args
					})
					console.log("xhrManager.js: ARGS IS: ", args);
				break;
				case "post":
				case "POST":
					var postObj = {
						url: url,
						handleAs: 'json',
						preventCache: true,
						headers: {
							"Content-Type": "application/json"
						}
					};
					if(args !== undefined){
						postObj.postData = json.toJson(args);
						console.log("xhrManager.js: postObj.postData is ", postObj.postData);
					}
					var dfd = xhrZ.post(postObj);
				break;
			}
			
			if(errorStr !== undefined){
				console.log(errorStr);
				dfd.reject(errorStr);
				return dfd;
			}
			
			return dfd.then(this.handler.bind(this, dfd), this.errorHandler.bind(this, dfd));
		},
		
		handler: function(dfd, result){
			var status = dfd.ioArgs.xhr.status;
			if(status != 200){
				//dfd.cancel();
				var message = message = "Service returned an HTTP error code of "+status+".";
				if(status == 302){
					message += "You may need to re-authenticate.";
				}
				return new Error(message);
			}
			return result;
		},
		
		errorHandler: function(dfd, error){
			console.log("[this.errorHandler]: error: ",error);
			if(error.dojoType == 'timeout'){
				//app.toaster.setContent("Service timed out.");
				//app.toaster.show();fixe
			}
			if(error.status == 404 ){
				//ow my legs
			}
			if(error.status == 403 ){
				window.location = "login.php?logout=true";
			}				
		}
	});
	
	return new xhrManager();
});
