define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		
		'app/manDatabase/MainView',
		'app/manDatabase/RestartAmazon',
		'app/manDatabase/RestoreDB'
], function(
	declare, 
	Module, 
	lang, 
	kernel,
	
	xhrManager, 
	
	MainView,
	RestartAmazon,
	RestoreDB
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);

			this.restartAmazon = new RestartAmazon({
				route: '/RestartAmazon',
				
				rebootAmazonInstance: this.rebootAmazonInstance,
				getAmazonInstances: this.getAmazonInstances
			});
			this.restoreDB = new RestoreDB({
				route: '/RestoreDB',
				
				restoreBackUpData: lang.hitch(this, this.restoreBackUpData),
				getBackUpList: lang.hitch(this, this.getBackUpList)
			});
			
			this.rootView = new MainView({
				route: '/',
				
				restoreDB: this.restoreDB,
				restartAmazon: this.restartAmazon
			});
			this.registerView(this.rootView);
			this.registerView(this.restartAmazon);
			this.registerView(this.restoreDB);

		},
		
		getBackUpList: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getBackUpList', params);
		},
		
		restoreBackUpData: function(file){
			params = {file: file};
			return xhrManager.send('POST', 'rest/v1.0/Database/restoreBackUpData', params);
		},
		
		getAmazonInstances: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getAmazonInstances', params);
		},
		
		rebootAmazonInstance: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/rebootAmazonInstance', params);
		}

	})
});