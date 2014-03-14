/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the views and functions for the manContacts module
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
		
		'app/util/xhrManager',
		
		'app/manContacts/MainView',
		'app/manContacts/ContactView',
		'app/manContacts/MergeView'
], function(declare, Module, lang, xhrManager, MainView, ContactView, MergeView) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.ContactView = new ContactView({
				route: '/ContactView',
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				unMergeFriends: lang.hitch(this, this.unMergeFriends)
			});
			
			this.MergeView = new MergeView({
				route: '/MergeView/:id',
				getContacts: lang.hitch(this, this.getContacts),
				mergeFriends: lang.hitch(this, this.mergeFriends),
				contactView: this.ContactView
			});
			
			this.rootView = new MainView({
				route: '/',
				mergeFriends: lang.hitch(this, this.mergeFriends),
				getContacts: lang.hitch(this, this.getContacts),
				getContactsByLetter: lang.hitch(this, this.getContactsByLetter),
				contactView: this.ContactView
			});
			this.registerView(this.rootView);
			this.registerView(this.ContactView);
			this.registerView(this.MergeView);
		},
		
		saveFriendsList: function(friendArr){
            params = {friendArr: friendArr};
            return xhrManager.send('POST', "rest/v1.0/Favorites/saveFriendsList", params);
	    },
		
		getContacts: function(from){
			var params = {from:from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params)
		},
		
		mergeFriends: function(mergeArr){
			params = {mergeArr: mergeArr};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/mergeFriends', params);
		},
		
		unMergeFriends: function(unMergeArr){
			params = {unMergeArr: unMergeArr};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/unMergeFriends', params);
		},
		
		getSpecificClients: function(ids){
			params = {ids: ids};
			console.log("console: Module.js: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},
		
		getContactsByLetter: function(letter){
			params = {letter: letter};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContactsByLetter', params);
		}
	})
});