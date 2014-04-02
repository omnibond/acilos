/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the views and functions for the manAccounts module
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
		'dojo/_base/lang',

		'app/manAccounts/MainView',
		'app/manAccounts/AuthenticateAccounts',
		'app/manAccounts/AddEditAccountsView',

		'app/util/xhrManager'
], function(
	declare, 
	Module, 
	lang,

	MainView,
	AuthAccounts,
	AddEditAccountsView,

	xhrManager
){
	return declare([Module], {

		postCreate: function(){
			this.inherited(arguments);

			this.rootView = new MainView({
				route: '/'	
			});
			
			this.AddEditAccountsView = new AddEditAccountsView({
				route: '/AddEditAccountsView',
				title: "Add/Edit new Accounts",
	
				saveNewAccount: lang.hitch(this, this.saveNewAccount),			
				saveServiceCreds: lang.hitch(this, this.saveServiceCreds),			
				getDomain: lang.hitch(this, this.getDomain),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				editServiceCreds: lang.hitch(this, this.editServiceCreds),
				deleteAccountCred: lang.hitch(this, this.deleteAccountCred),				
				deleteServiceCred: lang.hitch(this, this.deleteServiceCred)				
			});

			this.AuthAccounts = new AuthAccounts({
				route: '/AuthAccounts',
				title: "Authenticate Accounts",

				manualCrons: lang.hitch(this, this.manualCrons),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getAuthCreds: lang.hitch(this, this.getAuthCreds),
				setDisableLogin: lang.hitch(this, this.setDisableLogin)
			});

			this.registerView(this.rootView);
			this.registerView(this.AddEditAccountsView);
			this.registerView(this.AuthAccounts);
		},

		manualCrons: function(){
			return xhrManager.send('GET', 'rest/v1.0/Database/manualCrons',{});
		},

		getAuthCreds: function(){
			return xhrManager.send('GET', 'rest/v1.0/Credentials/getAuthCreds',{});
		},

		getServiceCreds: function(){
			return xhrManager.send('GET', 'rest/v1.0/Credentials/getServiceCreds',{});
		},

		saveServiceCreds: function(key, secret, redir, param){
			var params = {key: key, secret: secret, redir: redir, param: param};
			return xhrManager.send('POST', 'rest/v1.0/Database/saveServiceCredsObj', params);
		},
		
		saveNewAccount: function(color, login, auth, param){
			var params = {color: color, login: login, auth: auth, param: param};
			return xhrManager.send('POST', 'rest/v1.0/Database/saveNewAccount', params);
		},

		editServiceCreds: function(uuid, color, param){
			var params = {uuid: uuid, color: color, param: param};
			return xhrManager.send('POST', 'rest/v1.0/Database/editServiceCreds', params);
		},

		deleteAccountCred: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/deleteAccountCred', params);
		},
		
		deleteServiceCred: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/deleteServiceCred', params);
		},

		getDomain: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getDomain', params);
		},

		setDisableLogin: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/setDisableLogin', params);
		}
	})
});