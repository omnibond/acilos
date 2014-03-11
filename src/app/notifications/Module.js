define(['dojo/_base/declare',
	'dojo/_base/kernel',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/topic',
	
	'dojo-mama/Module',
	
	'app/notifications/MainView',

	'app/util/xhrManager'
], function(declare, kernel, domConstruct, lang, topic, Module, MainView, xhrManager) {
	return declare([Module], {
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',
				title: "App Notifications"
			});	
			this.registerView(this.rootView);
		}
	})
});
