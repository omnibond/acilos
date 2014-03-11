define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		
		'app/feeds/MainView',
		'app/feeds/FeedView',
		'app/feeds/CreateFeedView',
		'app/feeds/DeleteFeed',
		'app/feeds/EditFeed',
		'app/feeds/EditFeedView'
], function(
	declare, 
	Module, 
	lang, 
	kernel,
	
	xhrManager, 
	
	MainView, 
	FeedView, 
	CreateFeedView, 
	DeleteFeed, 
	EditFeed, 
	EditFeedView
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			//for all of the database feed counting items this var will keep track of
			if(!kernel.global.feedCount){
				kernel.global.feedCount = {};
			}
			
			this.FeedView = new FeedView({
				route: "/FeedView/:feedName",
				
				getSpecificFeedList: lang.hitch(this, this.getSpecificFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList)
			});
			this.CreateFeedView = new CreateFeedView({
				route: "/CreateFeedView",
			
				saveFeedList: lang.hitch(this, this.saveFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList),
				checkFeedName: lang.hitch(this, this.checkFeedName)
			});
			this.EditFeedView = new EditFeedView({
				route: "/EditFeedView/:feedName",
				
				saveFeedList: lang.hitch(this, this.saveFeedList),
				getSpecificFeedList: lang.hitch(this, this.getSpecificFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList),
				checkFeedName: lang.hitch(this, this.checkFeedName),
				overwriteFeedList: lang.hitch(this, this.overwriteFeedList)
				//checkFeedName: lang.hitch(this, this.checkFeedName)		replace this with my new overwriteFeedName function
			});
			this.DeleteFeed = new DeleteFeed({
				route: "/DeleteFeed",
			
				getFeedList: lang.hitch(this, this.getFeedList),
				deleteFeedList: lang.hitch(this, this.deleteFeedList)
			});
			this.EditFeed = new EditFeed({
				route: "/EditFeed",
				
				getFeedList: lang.hitch(this, this.getFeedList)
				//May need to pass other functions in later
			});
			this.rootView = new MainView({
				route: '/',
				
				getFeedList: lang.hitch(this, this.getFeedList)
			});
			this.registerView(this.rootView);
			this.registerView(this.FeedView);
			this.registerView(this.CreateFeedView);
			this.registerView(this.DeleteFeed);
			this.registerView(this.EditFeed);
			this.registerView(this.EditFeedView);

		},
		
		deleteFeedList: function(feedName){
			params = {feedName: feedName};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/deleteFeedList', params);
		},
		
		checkSpecificFeedList: function(feedObj, from){
			params = {feedObj: feedObj, from: from};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/checkSpecificFeedList', params);
		},
		
		getSpecificFeedList: function(feedName){
			params = {feedName: feedName};
			return xhrManager.send('GET', 'rest/v1.0/FeedData/getSpecificFeedList', params);
		},
		
		getFeedList: function(){
			params = [];
			return xhrManager.send('GET', 'rest/v1.0/FeedData/getFeedList', params);
		},
		
		saveFeedList: function(feedObj){
			params = {feedObj: feedObj};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/saveFeedList', params);
		},
		
		checkFeedName: function(feedName){
			params = {feedName: feedName};
			return xhrManager.send('GET', 'rest/v1.0/FeedData/checkFeedName', params);
		},
		
		overwriteFeedList: function(feedObj, feedName){
			params = {feedObj: feedObj, feedName: feedName};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/overwriteFeedList', params);
		}
	})
});