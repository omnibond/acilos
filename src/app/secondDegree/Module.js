define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		'app/secondDegree/MainView',
		'app/secondDegree/FeedView'
], function(
	declare, 
	Module, 
	lang, 
	kernel,
	
	xhrManager, 
	MainView, 
	FeedView
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			//for all of the database feed counting items this var will keep track of
			if(!kernel.global.feedCount){
				kernel.global.feedCount = {};
			}
			
			this.FeedView = new FeedView({
				route: '/FeedView',
				
				searchUser: lang.hitch(this, this.searchUser),
				setStarred: lang.hitch(this, this.setStarred),
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				manualRefresh: lang.hitch(this, this.manualRefresh)
				
			});
			
			this.rootView = new MainView({
				route: '/',
				getContacts: lang.hitch(this, this.getContacts),
				getSecondFriendContacts: lang.hitch(this, this.getSecondFriendContacts),
				FeedView: this.FeedView
			});
			this.registerView(this.rootView);
			this.registerView(this.FeedView);
		},
		
		searchUser: function(user, from){
			var params = {user: user, from: from};
			return xhrManager.send('GET', 'rest/v1.0/Search/user', params);
		},
		
		setStarred: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/setStarred', params);
		},
		
		getContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params)
		},
		
		getSecondFriendContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getSecondFriendContacts', params)
		},
		
		getSpecificClients: function(ids){
			params = {ids: ids};
			console.log("console: userFeeds/Module.js: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},
		
		setStarredClient: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST','rest/v1.0/FeedData/setStarredClient', params);
		},
		
		manualRefresh: function(serviceObj){
			var params = {serviceObj: serviceObj};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/manualRefresh', params);
		}
	})
});
	