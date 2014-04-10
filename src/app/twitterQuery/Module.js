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
	
	'app/twitterQuery/MainView',
	
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
			//this var keeps track of all feed scroll positions
			if(!kernel.global.feedPosition){
				kernel.global.feedPosition = {};
			}

			this.rootView = new MainView({
				route: '/',
				queryTwitter: lang.hitch(this, this.queryTwitter),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getTwitterQueryObjects: lang.hitch(this, this.getTwitterQueryObjects)
			});

			this.registerView(this.rootView);
		},
		
		getDomain: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getDomain', params);
		},

		queryTwitter: function(query, authStuff){
			var params = {query: query, authStuff: authStuff};
			return xhrManager.send('POST', 'rest/v1.0/Search/queryTwitter', params);
		},

		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},

		getTwitterQueryObjects: function(query, from){
			params = {from: from, query: query};
			return xhrManager.send('POST', 'rest/v1.0/Search/getTwitterQueryObjects', params);
		}
	})
});
