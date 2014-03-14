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
	
	'dojox/mobile/EdgeToEdgeList',
	
	'app/appHelp/MainView',
	'app/appHelp/ManAccountsHelpView',
	'app/appHelp/AddAccountsHelpView',
	'app/appHelp/EditAccountsHelpView',
	'app/appHelp/AboutView',
	
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
	ManAccountsHelpView,
	AddAccountsHelpView,
	EditAccountsHelpView,
	AboutView,
	
	errorUtils, 
	xhrManager
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',
				title: "Get help with the app"
			});	

			this.ManAccountsHelpView = new ManAccountsHelpView({
				route: '/ManAccountsHelpView',
				title: "Get help with Manage Accounts",

				getAuthCreds: lang.hitch(this, this.getAuthCreds)
			});
			
			this.AddAccountsHelpView = new AddAccountsHelpView({
				route: '/AddAccountsHelpView',
				title: "Get help with Adding Accounts",
				
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				saveServiceCreds: lang.hitch(this, this.saveServiceCreds),
				getDomain: lang.hitch(this, this.getDomain)
				
			});
			
			this.EditAccountsHelpView = new EditAccountsHelpView({
				route: '/EditAccountsHelpView',
				title: "Get help with Editing Accounts",
				
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				editServiceCreds: lang.hitch(this, this.editServiceCreds)
				
			});
			
			this.AboutView = new AboutView({
				route: '/AboutView',
				title: "About Acilos"				
			});

			this.registerView(this.rootView);
			this.registerView(this.ManAccountsHelpView);
			this.registerView(this.AddAccountsHelpView);
			this.registerView(this.EditAccountsHelpView);
			this.registerView(this.AboutView);
		},
		
		saveServiceCreds: function(key, secret, redir, color, param){
			var params = {key: key, secret: secret, redir: redir, color: color, param: param};
			return xhrManager.send('POST', 'rest/v1.0/Database/saveServiceCredsObj', params);
		},
		
		editServiceCreds: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/editServiceCreds', params);
		},
		
		deleteServiceCred: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/deleteServiceCred', params);
		},
		
		getServiceCreds: function(){
			return xhrManager.send('GET', 'rest/v1.0/Credentials/getServiceCreds',{});
		},
		
		getAuthCreds: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Credentials/getAuthCreds', params);
		},
		
		getDomain: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getDomain', params);
		}
	})
});
