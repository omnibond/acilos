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
				//app.toaster.setContent("Service returned an error.");
				//app.toaster.show();
			}				
		}
	});
	
	return new xhrManager();
});
