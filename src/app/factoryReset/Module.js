define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/factoryReset/MainView'
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
				
				appFactoryReset: this.appFactoryReset
	
			});
			this.registerView(this.rootView);
		},

		appFactoryReset: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/Credentials/appFactoryReset');
		}
	})
});