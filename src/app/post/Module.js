/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the views and functions of the post module
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
		"dojo/_base/json",

		'app/util/xhrManager',

		'app/post/MainView',
		'app/post/PostHistoryView',
		'app/post/DeletePostView'
], function(
	declare, 
	Module, 
	lang,
	json,

	xhrManager,

	MainView,
	PostHistoryView,
	DeletePostView
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',

				sendPostFile: lang.hitch(this, this.sendPostFile),
				runAtCommand: lang.hitch(this, this.runAtCommand),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getDomain: lang.hitch(this, this.getDomain)
			});

			this.postHistoryView = new PostHistoryView({
				route: '/PostHistoryView',

				getPostHistory: lang.hitch(this, this.getPostHistory)
			});

			this.deletePostView = new DeletePostView({
				route: '/DeletePostView',

				getPostHistory: lang.hitch(this, this.getPostHistory),
				deleteScheduledPost: lang.hitch(this, this.deleteScheduledPost)
			});
			
			this.registerView(this.rootView);
			this.registerView(this.postHistoryView);
			this.registerView(this.deletePostView);
		},

		sendPostFile: function(time, file, fileType, tokenArr, msg){
			var params = {time: time, file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			console.log("Module.js: Params for sendPostFile are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/postFiles', params);
		},

		runAtCommand: function(time, file, fileType, tokenArr, msg){
			var params = {time: time, file: file, fileType: fileType, tokenArr: tokenArr, msg: msg};
			return xhrManager.send('POST', 'rest/v1.0/Post/runAtCommand', params);
		},
		
		getServiceCreds: function(){
			var params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},
		
		getDomain: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getDomain', params);
		},

		getPostHistory: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getPostHistory');
		},

		deleteScheduledPost: function(key){
			var params = {key: key};
			return xhrManager.send('POST', 'rest/v1.0/Database/deleteScheduledPost', params);
		}
	});
});
