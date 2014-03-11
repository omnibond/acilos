define(['dojo/_base/declare',
	'dojo/_base/kernel',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/topic',
	
	'dojo-mama/Module',
	
	'dojox/mobile/EdgeToEdgeList',
	
	'app/favoritePeople/MainView',
	'app/util/error-utils',
	'app/util/xhrManager'
], function(
	declare, 
	kernel, 
	domConstruct, 
	lang, 
	topic, 
	
	Module, 
	
	EdgeToEdgeList, 
	
	MainView, 
	errorUtils, 
	xhrManager
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			//for all of the database feed counting items this var will keep track of
			if(!kernel.global.feedCount){
				kernel.global.feedCount = {};
			}
			
			this.rootView = new MainView({
				route: '/',
				title: "Your favorite posts",
				
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				searchStarredClients: lang.hitch(this, this.searchStarredClients),
				searchUser: lang.hitch(this, this.searchUser),
				manualRefresh: lang.hitch(this, this.manualRefresh)
			});	
			this.registerView(this.rootView);
		},
		
		setStarred: function(status, id){
			var params = {status : status, id : id};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/setStarred', params);
		},
		
		setStarredClient: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/setStarredClient', params);
		},
		
		searchStarredClients: function(){
			var params = [];
			return xhrManager.send('GET', 'rest/v1.0/Search/starredClients', params);
		},
		
		searchUser: function(user, from){
			//var params = [user, from];
			var params = {user: user, from: from};
			return xhrManager.send('GET', 'rest/v1.0/Search/user', params);
		},
		
		manualRefresh: function(serviceObj){
			var params = {serviceObj: serviceObj};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/manualRefresh', params);
		}
	})
});
