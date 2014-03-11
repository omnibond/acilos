define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/locateUsers/MainView'
], function(
	declare, 
	Module, 
	lang, 
	xhrManager, 
	MainView
) {
	return declare([Module], {
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',

				getAroundMe: lang.hitch(this, this.getAroundMe)	
			});
			this.registerView(this.rootView);
		},

		getAroundMe: function(call, location){
			params = {call: call, location: location};
			return xhrManager.send('GET', 'rest/v1.0/LocationData/getAroundMe', params);
		}
		
	})
});