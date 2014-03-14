/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the barGraph module
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
define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/barGraph/MainView',
	'app/barGraph/serviceBarGraph',
	'app/barGraph/userBarGraph',
	'app/barGraph/userList'
], function(
	declare, 
	Module, 
	lang, 
	xhrManager, 
	MainView,
	serviceBarGraph,
	userBarGraph,
	userList
) {
	return declare([Module], {
		postCreate: function(){
			this.inherited(arguments);
			
			this.serviceGraph = new serviceBarGraph({
				route: '/serviceGraph',

				getAllBarGraphClients: lang.hitch(this, this.getAllBarGraphClients)
	
			});
			this.userGraph = new userBarGraph({
				route: '/userGraph',
				
				getBarGraphClients: lang.hitch(this, this.getBarGraphClients)
	
			});
			this.userList = new userList({
				route: '/userList',
				
				getContacts: lang.hitch(this, this.getContacts),
				getChattyContacts: lang.hitch(this, this.getChattyContacts),
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				getTopContacts: lang.hitch(this, this.getTopContacts),
				userGraph: this.userGraph
	
			});

			this.rootView = new MainView({
				route: '/'
	
			});
			this.registerView(this.rootView);
			this.registerView(this.serviceGraph);
			this.registerView(this.userGraph);
			this.registerView(this.userList);
		},

		getBarGraphClients: function(users){
			params = {users: users};
			return xhrManager.send('POST', 'rest/v1.0/Charts/getBarGraphClients', params);
		},
		
		getAllBarGraphClients: function(){
			return xhrManager.send('GET', 'rest/v1.0/Charts/getAllBarGraphClients');
		},
		
		getChattyContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getChattyContacts', params)
		},
		
		getSpecificClients: function(ids){
			params = {ids: ids};
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},
		
		getContacts: function(from){
			var params = {from:from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params)
		},

		getTopContacts: function(numClients){
			var params = {numClients: numClients};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getTopContacts', params);
		}
		
	})
});