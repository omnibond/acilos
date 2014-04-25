/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the appHelp module and all of its views and functions
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
	
	'app/query/MainView',
	'app/mainFeed/BlastView',
	
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
	BlastView,
	
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
			
			this.blastView = new BlastView({
				route: '/BlastView',
				mod: 'query',
				
				sendPostFile: lang.hitch(this, this.sendPostFile),
				runAtCommand: lang.hitch(this, this.runAtCommand),
				getServiceCreds: lang.hitch(this, this.getServiceCreds)
			});
			
			this.rootView = new MainView({
				route: '/',
				blastView: this.blastView,
				getPublicQueryObjects: lang.hitch(this, this.getPublicQueryObjects),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getPublicDBObjects: lang.hitch(this, this.getPublicDBObjects),
				paginateService: lang.hitch(this, this.paginateService),
				writeQueryTerm: lang.hitch(this, this.writeQueryTerm),
				getPublicQueryObject: lang.hitch(this, this.getPublicQueryObject)
			});

			this.registerView(this.rootView);
			this.registerView(this.blastView);
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

		getPublicQueryObjects: function(query, authStuff, checked){
			params = {query: query, authStuff: authStuff, checked: checked};
			return xhrManager.send('POST', 'rest/v1.0/Search/getPublicQueryObjects', params);
		},

		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},

		writeQueryTerm: function(feedName, services, queryString, feeds){
			params = {feedName: feedName, services: services, queryString: queryString, feeds: feeds};
			console.log("writeQueryTerm params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/PublicQuery/writeQueryTerm', params);
		},
		
		sendPostFile: function(file, fileType, tokenArr, msg){
			params = {file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			console.log("Module.js: Params for sendPostFile are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/postFiles', params);
		},

		runAtCommand: function(time, file, fileType, tokenArr, msg){
			params = {time: time, file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			return xhrManager.send('POST', 'rest/v1.0/Post/runAtCommand', params);
		},
		
		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},

		getPublicQueryObject: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/PublicQuery/getPublicQueryObject', params);
		}
	})
});
