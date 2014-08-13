/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainFeed module
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
	'dojo/_base/kernel',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/topic',
	
	'dojo-mama/Module',
	
	'app/SelEdgeToEdgeList',
	
	'app/mainFeed/FeedView',
	"app/mainFeed/SearchView",
	"app/mainFeed/BlastView",
	"app/mainFeed/PictureScrollerView",
	
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
	
	FeedView, 
	SearchView, 
	BlastView,
	PictureScrollerView,
	
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
			//this var keeps track of all feed scroll positions
			if(!kernel.global.feedPosition){
				kernel.global.feedPosition = {};
			}
			
			this.pictureScroller = new PictureScrollerView({
				route: '/PictureFeedScroller',
				mod: 'mainFeed'
			});
			
			this.blastView = new BlastView({
				route: '/BlastView',
				mod: 'mainFeed',
				
				sendPostFile: lang.hitch(this, this.sendPostFile),
				getServiceCreds: lang.hitch(this, this.getServiceCreds)
			});
			
			this.searchView = new SearchView({
				route: '/searchView',
				
				blastView: this.blastView,
				pictureScroller: this.pictureScroller,
				updateFeedData: lang.hitch(this, this.updateFeedData),
				getFeedData: lang.hitch(this, this.getFeedData),
				checkForNewItems: lang.hitch(this, this.checkForNewItems),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				searchFilters: lang.hitch(this, this.searchFilters),
				manualRefresh: lang.hitch(this, this.manualRefresh),
				sendSearchString: lang.hitch(this, this.sendSearchString),
				paginateFacebook: lang.hitch(this, this.paginateFacebook),
				writeLocalFeed: lang.hitch(this, this.writeLocalFeed)
			});	

			this.rootView = new FeedView({
				route: '/',
				title: "See what's new",
				feedName: "All Feed Data",

				searchView: this.searchView,
				blastView: this.blastView,
				pictureScroller: this.pictureScroller,
				updateFeedData: lang.hitch(this, this.updateFeedData),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getFeedData: lang.hitch(this, this.getFeedData),
				checkForNewItems: lang.hitch(this, this.checkForNewItems),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				searchFilters: lang.hitch(this, this.searchFilters),
				manualRefresh: lang.hitch(this, this.manualRefresh),
				sendSearchString: lang.hitch(this, this.sendSearchString),
				writeLocalFeed: lang.hitch(this, this.writeLocalFeed)
			});
			this.registerView(this.blastView);
			this.registerView(this.pictureScroller);
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

		paginateFacebook: function(cursor, authStuff){
			params = {cursor: cursor, authStuff: authStuff};
			return xhrManager.send('POST', 'rest/v1.0/Search/paginateFacebook', params);
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

		sendSearchString: function(searchString, from){
			var params = {searchString: searchString, from: from};
			return xhrManager.send('GET', 'rest/v1.0/Search/sendSearchString', params);
		},
		
		sendPostFile: function(time, file, tokenArr, msg){
			params = {time: time, file: file, tokenArr: tokenArr, msg: msg};
			console.log("Module.js: Params for sendPostFile are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Blast/blastFiles', params);
		},
		
		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},

		writeLocalFeed: function(feedName, queryString){
			params = {feedName: feedName, queryString: queryString};
			console.log("writeQueryTerm params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/FeedData/writeLocalFeed', params);
		}
	});
});