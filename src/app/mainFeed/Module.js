define(['dojo/_base/declare',
	'dojo/_base/kernel',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/topic',
	
	'dojo-mama/Module',
	
	'dojox/mobile/EdgeToEdgeList',
	
	'app/mainFeed/FeedView',
	"app/mainFeed/SearchView",
	'app/util/error-utils',
	'app/util/xhrManager'
], function(declare, kernel, domConstruct, lang, topic, Module, EdgeToEdgeList, FeedView, SearchView, errorUtils, xhrManager) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
		
			//for all of the database feed counting items this var will keep track of
			if(!kernel.global.feedCount){
				kernel.global.feedCount = {};
			}
			//this var keeps track of all feed scroll positions
			if(!kernel.global.feedPosition){
				kernel.global.feedPosition = {};
			}
			
			this.searchView = new SearchView({
				route: '/searchView',

				updateFeedData: lang.hitch(this, this.updateFeedData),
				getFeedData: lang.hitch(this, this.getFeedData),
				checkForNewItems: lang.hitch(this, this.checkForNewItems),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				searchFilters: lang.hitch(this, this.searchFilters),
				manualRefresh: lang.hitch(this, this.manualRefresh),
				sendSearchString: lang.hitch(this, this.sendSearchString)
			});	

			this.rootView = new FeedView({
				route: '/',
				title: "See what's new",
				feedName: "All Feed Data",

				searchView: this.searchView,
				updateFeedData: lang.hitch(this, this.updateFeedData),
				getFeedData: lang.hitch(this, this.getFeedData),
				checkForNewItems: lang.hitch(this, this.checkForNewItems),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				searchFilters: lang.hitch(this, this.searchFilters),
				manualRefresh: lang.hitch(this, this.manualRefresh),
				sendSearchString: lang.hitch(this, this.sendSearchString)
			});
			this.registerView(this.searchView);
			this.registerView(this.rootView);
		},
		
		getObjects: function(){
			var params = ["feedList"];
			return xhrManager.send('getObjects', 'app/util/_scaffold.php', params)
				.then(lang.hitch(this,this.handleGetObjects));
		},
		
		getFeedData: function(feed, from){
			var params = {feed: feed, from: from};
			return xhrManager.send('GET', 'rest/v1.0/FeedData/getFeedData', params);
		},
		
		updateFeedData: function(feed, size){
			var params = {feedName: feed, size: size};
			console.log("console: ", params);
			return xhrManager.send('POST', 'rest/v1.0/FeedData/update', params);
		},
		
		setStarred: function(status, id){
			var params = {status: status, id: id};
			console.log("setStarred: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Favorites/setStarred', params);
		},
		
		setStarredClient: function(status, id){
			var params = {status: status, id: id};
			console.log('Module.js: ', params);
			//debugger;
			return xhrManager.send('POST', 'rest/v1.0/FeedData/setStarredClient', params);
		},
		
		checkForNewItems: function(feed){
			var params = {feed: feed};
			console.log("console: Module.js: ", params);
			return xhrManager.send('GET', 'rest/v1.0/Database/checkForNewItems', params);
		},
		
		handleGetObjects: function(obj){
			console.log("handleGetObjects",arguments);
			this.objects = obj;
		},
		
		manualRefresh: function(serviceObj){
			var params = {serviceObj: serviceObj};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/manualRefresh', params);
		},

		sendSearchString: function(searchString){
			var params = {searchString: searchString};
			return xhrManager.send('GET', 'rest/v1.0/Search/sendSearchString', params);
		}
	});
});