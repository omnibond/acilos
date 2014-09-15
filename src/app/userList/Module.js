/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the userList module
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
		'app/userList/MainView',
		'app/userList/UserView',
		'app/mainFeed/BlastView'
], function(
	declare, 
	Module, 
	lang, 
	kernel,
	
	xhrManager, 
	MainView, 
	UserView,
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
				mod: 'people',
				
				sendPostFile: lang.hitch(this, this.sendPostFile),
				runAtCommand: lang.hitch(this, this.runAtCommand),
				getServiceCreds: lang.hitch(this, this.getServiceCreds)
			});
			
			this.UserView = new UserView({
				route: '/UserView',
				
				blastView: this.blastView,
				searchUser: lang.hitch(this, this.searchUser),
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				manualRefresh: lang.hitch(this, this.manualRefresh)
			});
			
			this.rootView = new MainView({
				route: '/',
				
				RecentView: this.RecentView,
				blastView: this.blastView,
				getRecentContacts: lang.hitch(this, this.getRecentContacts),
				getAlphaContacts: lang.hitch(this, this.getAlphaContacts),
				getChattyContacts: lang.hitch(this, this.getChattyContacts),
				getSecondFriendContacts: lang.hitch(this, this.getSecondFriendContacts),
				UserView: this.UserView
			});
			this.registerView(this.rootView);
			this.registerView(this.UserView);
			this.registerView(this.blastView);
		},
		
		searchUser: function(user, from){
			var params = {user: user, from: from};
			return xhrManager.send('GET', 'rest/v1.0/Search/user', params);
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
		
		setStarredClient: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/setStarredClient', params);
		},
		
		setStarred: function(status, id){
			var params = {status: status, id: id};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/setStarred', params);
		},

		getAlphaContacts: function(from){
			var params = {from:from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getAlphaContacts', params)
		},
		
		getRecentContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getRecentContacts', params)
		},

		getChattyContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getChattyContacts', params)
		},

		getSecondFriendContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getSecondFriendContacts', params)
		},
		
		getSpecificClients: function(ids){
			params = {ids: ids};
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},
		
		manualRefresh: function(serviceObj){
			var params = {serviceObj: serviceObj};
			return xhrManager.send('POST', 'rest/v1.0/FeedData/manualRefresh', params);
		}
	})
});
	