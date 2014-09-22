/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the custom feeds module
** 
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/
define(['dojo/_base/declare',
		'dojo-mama/Module',
		"dojo/_base/lang",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		
		'app/feeds/PublicMainView',
		'app/feeds/FeedView',
		'app/feeds/CreateFeedView',
		'app/feeds/DeleteFeed',
		'app/feeds/EditFeed',
		'app/feeds/EditFeedView',
		'app/feeds/NewCreateFeedView',
		'app/feeds/NewEditFeedView',
		'app/feeds/NewFeedView',
		'app/feeds/LocalMainView',
		'app/feeds/NewDeleteFeed',
		'app/feeds/NewEditFeed',
		'app/mainFeed/BlastView',
		'app/feeds/MainView'
], function(
	declare, 
	Module, 
	lang, 
	kernel,
	
	xhrManager, 
	
	PublicMainView, 
	FeedView, 
	CreateFeedView, 
	DeleteFeed, 
	EditFeed, 
	EditFeedView,
	NewCreateFeedView,
	NewEditFeedView,
	NewFeedView,
	LocalMainView,
	NewDeleteFeed,
	NewEditFeed,
	BlastView,
	MainView
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			//for all of the database feed counting items this var will keep track of
			if(!kernel.global.feedCount){
				kernel.global.feedCount = {};
			}
			
			this.blastView = new BlastView({
				route: '/BlastView',
				mod: 'feeds',
				
				sendPostFile: lang.hitch(this, this.sendPostFile),
				runAtCommand: lang.hitch(this, this.runAtCommand),
				getServiceCreds: lang.hitch(this, this.getServiceCreds)
			});
			
			this.FeedView = new FeedView({
				route: "/FeedView/:feedName",
				
				blastView: this.blastView,
				getSpecificFeedList: lang.hitch(this, this.getSpecificFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				sendSearchString: lang.hitch(this, this.sendSearchString)
			});

			this.CreateFeedView = new CreateFeedView({
				route: "/CreateFeedView",
				
				blastView: this.blastView,
				saveFeedList: lang.hitch(this, this.saveFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				checkFeedName: lang.hitch(this, this.checkFeedName),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject),
				writeLocalFeed: lang.hitch(this, this.writeLocalFeed),
				sendSearchString: lang.hitch(this, this.sendSearchString)
			});

			this.EditFeedView = new EditFeedView({
				route: "/EditFeedView/:feedName",
				
				blastView: this.blastView,
				saveFeedList: lang.hitch(this, this.saveFeedList),
				getSpecificFeedList: lang.hitch(this, this.getSpecificFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList),
				checkFeedName: lang.hitch(this, this.checkFeedName),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				overwriteFeedList: lang.hitch(this, this.overwriteFeedList),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
			});

			this.DeleteFeed = new DeleteFeed({
				route: "/DeleteFeed",
			
				getFeedList: lang.hitch(this, this.getFeedList),
				deleteLocalFeedList: lang.hitch(this, this.deleteLocalFeedList),
				getLocalFeedList: lang.hitch(this, this.getLocalFeedList)
			});

			this.NewDeleteFeed = new NewDeleteFeed({
				route: "/NewDeleteFeed",
			
				getFeedList: lang.hitch(this, this.getFeedList),
				deleteFeedList: lang.hitch(this, this.deleteFeedList),
				deletePublicQueryObjectTerm: lang.hitch(this, this.deletePublicQueryObjectTerm),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
			});

			this.EditFeed = new EditFeed({
				route: "/EditFeed",

				EditFeedView: this.EditFeedView,
				
				getLocalFeedList: lang.hitch(this, this.getLocalFeedList)
				//May need to pass other functions in later
			});

			this.NewEditFeedView = new NewEditFeedView({
				route: '/NewEditFeedView/:feedTitle',

				getFeedList: lang.hitch(this, this.getFeedList),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getPublicQueryObjects: lang.hitch(this, this.getPublicQueryObjects),
				writeQueryTerm: lang.hitch(this, this.writeQueryTerm),
				getPublicDBObjects: lang.hitch(this, this.getPublicDBObjects),
				paginateService: lang.hitch(this, this.paginateService),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
			});

			this.NewEditFeed = new NewEditFeed({
				route: "/NewEditFeed",

				NewEditFeedView: this.NewEditFeedView,

				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
				//May need to pass other functions in later
			});

			this.PublicMainView = new PublicMainView({
				route: '/PublicMainView',
				
				getFeedList: lang.hitch(this, this.getFeedList),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
			});

			this.NewCreateFeedView = new NewCreateFeedView({
				route: '/NewCreateFeedView',
				
				publicQueryTime: lang.hitch(this, this.publicQueryTime),
				getFeedList: lang.hitch(this, this.getFeedList),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getPublicQueryObjects: lang.hitch(this, this.getPublicQueryObjects),
				writeQueryTerm: lang.hitch(this, this.writeQueryTerm),
				getPublicDBObjects: lang.hitch(this, this.getPublicDBObjects),
				paginateService: lang.hitch(this, this.paginateService),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
			});
			
			this.NewFeedView = new NewFeedView({
				route: '/NewFeedView/:feedTitle/:queryTerm',

				getFeedList: lang.hitch(this, this.getFeedList),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getPublicQueryObjects: lang.hitch(this, this.getPublicQueryObjects),
				writeQueryTerm: lang.hitch(this, this.writeQueryTerm),
				getPublicDBObjects: lang.hitch(this, this.getPublicDBObjects),
				paginateService: lang.hitch(this, this.paginateService),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject),
				getSpecificFeedList: lang.hitch(this, this.getSpecificFeedList)
			});

			this.LocalMainView = new LocalMainView({
				route: '/LocalMainView',

				FeedView: this.FeedView,
				
				getLocalFeedList: lang.hitch(this, this.getLocalFeedList)
			});

			this.rootView = new MainView({
				route: '/'
			});
			

			this.registerView(this.rootView);
			this.registerView(this.LocalMainView);
			this.registerView(this.FeedView);
			this.registerView(this.CreateFeedView);
			this.registerView(this.DeleteFeed);
			this.registerView(this.EditFeed);
			this.registerView(this.EditFeedView);
			this.registerView(this.blastView);
			this.registerView(this.NewCreateFeedView);
			this.registerView(this.NewEditFeedView);
			this.registerView(this.NewFeedView);
			this.registerView(this.PublicMainView);
			this.registerView(this.NewDeleteFeed);
			this.registerView(this.NewEditFeed);
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
		
		sendPostFile: function(time, file, tokenArr, msg){
			params = {time: time, file: file, tokenArr: tokenArr, msg: msg};
			console.log("Module.js: Params for sendPostFile are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Blast/blastFiles', params);
		},

		runAtCommand: function(time, file, fileType, tokenArr, msg){
			params = {time: time, file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			return xhrManager.send('POST', 'rest/v1.0/Post/runAtCommand', params);
		},
		
		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},

		getPublicQueryObjects: function(query, authStuff, checked){
			params = {query: query, authStuff: authStuff, checked: checked};
			return xhrManager.send('POST', 'rest/v1.0/Search/getPublicQueryObjects', params);
		},

		writeQueryTerm: function(feedName, services, queryString, feeds){
			params = {feedName: feedName, services: services, queryString: queryString, feeds: feeds};
			console.log("writeQueryTerm params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/PublicQuery/writeQueryTerm', params);
		},

		getPublicDBObjects: function(query, from){
			params = {from: from, query: query};
			return xhrManager.send('POST', 'rest/v1.0/Search/getPublicDBObjects', params);
		},
		
		paginateService: function(authStuff, query, checked, nextToken){
			params = {authStuff: authStuff, query: query, checked: checked, nextToken: nextToken};
			console.log("paginateService params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Search/paginateService', params);
		},

		getPublicQueryObject: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/PublicQuery/getPublicQueryObject', params);
		},

		deletePublicQueryObjectTerm: function(term){
			params = {term: term};
			return xhrManager.send('POST', 'rest/v1.0/PublicQuery/deletePublicQueryObjectTerm', params);
		},

		getLocalFeedList: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/FeedData/getLocalFeedList', params);
		},

		deleteLocalFeedList: function(feedName){
			var params = {feedName: feedName};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/deleteLocalFeedList', params);
		},

		sendSearchString: function(searchString, from){
			var params = {searchString: searchString, from: from};
			return xhrManager.send('GET', 'rest/v1.0/Search/sendSearchString', params);
		},

		writeLocalFeed: function(feedName, queryString){
			params = {feedName: feedName, queryString: queryString};
			console.log("writeQueryTerm params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/FeedData/writeLocalFeed', params);
		},
		
		publicQueryTime: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/FeedData/publicQueryTime', params);
		}
	})
});