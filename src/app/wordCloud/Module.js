define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		
		'app/util/xhrManager',
		
		'app/wordCloud/MainView',
		'app/wordCloud/WordCloudView'
], function(declare, Module, lang, xhrManager, MainView, WordCloudView) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.WordCloudView = new WordCloudView({
				route: '/WordCloudView',
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				unMergeFriends: lang.hitch(this, this.unMergeFriends),
				createTagCloud: lang.hitch(this, this.createTagCloud)
			});
			
			this.rootView = new MainView({
				route: '/',
				
				getContacts: lang.hitch(this, this.getContacts),
				getChattyContacts: lang.hitch(this, this.getChattyContacts),
				wordCloudView: this.WordCloudView
			});
			this.registerView(this.rootView);
			this.registerView(this.WordCloudView);
		},
		
		getContacts: function(from){
			var params = {from:from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params)
		},
		
		getSpecificClients: function(ids){
			params = {ids: ids};
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},
		
		createTagCloud: function(users, numWords){
			params = {users: users, numWords: numWords};
			console.log("console: Module.js: ", params);
			return xhrManager.send('POST', 'rest/v1.0/WordCloud/createTagCloud', params);
		},

		getChattyContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getChattyContacts', params)
		}
		
	})
});