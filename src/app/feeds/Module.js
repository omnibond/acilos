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
		
		'app/feeds/MainView',
		'app/feeds/FeedView',
		'app/feeds/CreateFeedView',
		'app/feeds/DeleteFeed',
		'app/feeds/EditFeed',
		'app/feeds/EditFeedView',
		'app/mainFeed/BlastView'
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
	EditFeedView,
	BlastView
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
				setStarredClient: lang.hitch(this, this.setStarredClient)
			});
			this.CreateFeedView = new CreateFeedView({
				route: "/CreateFeedView",
				
				blastView: this.blastView,
				saveFeedList: lang.hitch(this, this.saveFeedList),
				checkSpecificFeedList: lang.hitch(this, this.checkSpecificFeedList),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				checkFeedName: lang.hitch(this, this.checkFeedName)
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
			this.registerView(this.blastView);

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
		
		sendPostFile: function(file, fileType, tokenArr, msg){
			params = {file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			console.log("Module.js: Params for sendPostFile are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/postFiles', params);
		},

		runAtCommand: function(date, time, file, fileType, tokenArr, msg){
			params = {date: date, time: time, file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			return xhrManager.send('POST', 'rest/v1.0/Post/runAtCommand', params);
		},
		
		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		}
	})
});