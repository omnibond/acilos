define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		
		'app/util/xhrManager',
		'app/restartDB/MainView'
], function(declare, Module, lang, xhrManager, MainView) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',
				restartDB: lang.hitch(this, this.restartDB)
			});
			
			this.registerView(this.rootView);
			
		},
		
		restartDB: function(){
			return xhrManager.send('GET', 'rest/v1.0/Database/restart', {});
		}
	})
});
