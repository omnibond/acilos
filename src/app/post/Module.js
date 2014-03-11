define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		"dojo/_base/json",

		'app/util/xhrManager',

		'app/post/MainView'
], function(
	declare, 
	Module, 
	lang,
	json,

	xhrManager,

	MainView
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',
				
				//sendPostMsg: lang.hitch(this, this.sendPostMsg),
				sendPostFile: lang.hitch(this, this.sendPostFile),
				runAtCommand: lang.hitch(this, this.runAtCommand),
				getServiceCreds: lang.hitch(this, this.getServiceCreds)
			});
			
			this.registerView(this.rootView);

		},

		sendPostFile: function(file, fileType, tokenArr, msg){
			params = {file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			console.log("Module.js: Params for sendPostFile are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/postFiles', params);
		},
		
		sendPostMsg: function(msg, service){
			params = {msg: msg, service: service};
			return xhrManager.send('POST', 'rest/v1.0/Post/whichService', params);
		},

		runAtCommand: function(date, time, file, fileType, tokenArr, msg){
			params = {date: date, time: time, file: file, fileType: fileType, service: tokenArr, msg: msg};
			return xhrManager.send('POST', 'rest/v1.0/Post/runAtCommand', params);
		},
		
		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		}
	})
});
