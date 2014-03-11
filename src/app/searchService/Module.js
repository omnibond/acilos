define(['dojo/_base/declare',
	'dojo/_base/kernel',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/topic',
	
	'dojo-mama/Module',
	
	'dojox/mobile/EdgeToEdgeList',
	
	'app/searchService/MainView',
	'app/util/error-utils',
	'app/util/xhrManager'
], function(declare, kernel, domConstruct, lang, topic, Module, EdgeToEdgeList, FeedView, errorUtils, xhrManager) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			//for all of the database feed counting items this var will keep track of
			if(!kernel.global.feedCount){
				kernel.global.feedCount = {};
			}
			this.rootView = new FeedView({
				route: '/',
				title: "Search by service",
				
				searchService: lang.hitch(this, this.searchService),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				manualRefresh: lang.hitch(this, this.manualRefresh)
			});	
			this.registerView(this.rootView);
		},
		
		searchService: function(service, from){
			var params = {service: service, from: from};
			return xhrManager.send('GET', 'rest/v1.0/Search/service', params);
		},
	
		setStarredClient: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/setStarredClient', params);
		},
		
		setStarred: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/setStarred', params);
		},
		
		manualRefresh: function(serviceObj){
			var params = {serviceObj: serviceObj};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/manualRefresh', params);
		}
	})
});