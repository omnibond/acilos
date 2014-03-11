define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/barGraph/MainView',
	'app/barGraph/serviceBarGraph',
	'app/barGraph/userBarGraph',
	'app/barGraph/userList'
], function(
	declare, 
	Module, 
	lang, 
	xhrManager, 
	MainView,
	serviceBarGraph,
	userBarGraph,
	userList
) {
	return declare([Module], {
		postCreate: function(){
			this.inherited(arguments);
			
			this.serviceGraph = new serviceBarGraph({
				route: '/serviceGraph',

				getAllBarGraphClients: lang.hitch(this, this.getAllBarGraphClients)
	
			});
			this.userGraph = new userBarGraph({
				route: '/userGraph',
				
				getBarGraphClients: lang.hitch(this, this.getBarGraphClients)
	
			});
			this.userList = new userList({
				route: '/userList',
				
				getContacts: lang.hitch(this, this.getContacts),
				getChattyContacts: lang.hitch(this, this.getChattyContacts),
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				getTopContacts: lang.hitch(this, this.getTopContacts),
				userGraph: this.userGraph
	
			});

			this.rootView = new MainView({
				route: '/'
	
			});
			this.registerView(this.rootView);
			this.registerView(this.serviceGraph);
			this.registerView(this.userGraph);
			this.registerView(this.userList);
		},

		getBarGraphClients: function(users){
			params = {users: users};
			return xhrManager.send('POST', 'rest/v1.0/Charts/getBarGraphClients', params);
		},
		
		getAllBarGraphClients: function(){
			return xhrManager.send('GET', 'rest/v1.0/Charts/getAllBarGraphClients');
		},
		
		getChattyContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getChattyContacts', params)
		},
		
		getSpecificClients: function(ids){
			params = {ids: ids};
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},
		
		getContacts: function(from){
			var params = {from:from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params)
		},

		getTopContacts: function(numClients){
			var params = {numClients: numClients};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getTopContacts', params);
		}
		
	})
});