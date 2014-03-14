/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the lineChart module
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
define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/lineChart/MainView',
	'app/lineChart/userLineChart',
	'app/lineChart/serviceLineChart',
	'app/lineChart/selectUsers'
], function(
	declare, 
	Module, 
	lang, 
	xhrManager, 
	MainView,
	userLineChart,
	serviceLineChart,
	selectUsers
) {
	return declare([Module], {
		postCreate: function(){
			this.inherited(arguments);

			this.userLineChartView = new userLineChart({
				route: '/userLineChartView',

				getLineChartUsers: lang.hitch(this, this.getLineChartUsers)
			});

			this.selectUsersView = new selectUsers({
				route: '/selectUsersView',

				getContacts: lang.hitch(this, this.getContacts),
				getChattyContacts: lang.hitch(this, this.getChattyContacts),
				getTopContacts: lang.hitch(this, this.getTopContacts),
				userLineChartView: this.userLineChartView
			});

			this.serviceLineChartView = new serviceLineChart({
				route: '/serviceLineChartView',

				getLineChartServices: lang.hitch(this, this.getLineChartServices)
			});
			
			this.rootView = new MainView({
				route: '/',

				getLineChartServices: lang.hitch(this, this.getLineChartServices)
	
			});
			this.registerView(this.rootView);
			this.registerView(this.userLineChartView);
			this.registerView(this.serviceLineChartView);
			this.registerView(this.selectUsersView);
		},

		getLineChartServices: function(){
			params = {};
			return xhrManager.send('GET', 'rest/v1.0/Charts/getLineChartServices');
		},

		getLineChartUsers: function(users){
			var params = {users: users};
			console.log("Module.js: PARAMS IS: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Charts/getLineChartUsers', params);
		},

		getContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params);
		},

		getChattyContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getChattyContacts', params);
		},

		getTopContacts: function(numClients){
			var params = {numClients: numClients};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getTopContacts', params);
		}
	})
});