define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		
		'app/userLookup/MainView',
		'app/util/xhrManager'
], function(declare, Module, lang, MainView, xhrManager) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',
				getUser: lang.hitch(this, this.getUser)
			});
			
			this.registerView(this.rootView);
			
		},
		
		getUser: function(name, media){			// username and service previously
			var params = {name: name, media: media};
			console.log("console: userLookup/Module.js: ", params);
			return xhrManager.send('GET', 'rest/v1.0/Search/getUser', params);
		}
	})
});