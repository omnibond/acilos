define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/pieChart/MainView'
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

				getPieChartUsers: lang.hitch(this, this.getPieChartUsers)
			});

			this.registerView(this.rootView);
		},

		getPieChartUsers: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/Charts/getPieChartUsers', params);
		}
	})
});