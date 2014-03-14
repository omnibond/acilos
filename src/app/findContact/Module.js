/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the findContacts module
** This Module is DEPRECATED
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
	
	'app/findContact/MainView',
	'app/findContact/ContactView',
	'app/findContact/MergeView',
	'app/util/xhrManager'
], function(declare, kernel, domConstruct, lang, topic, Module, MainView, ContactView, MergeView, xhrManager) {
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
				contactView: this.ContactView,
				
				getContacts: lang.hitch(this, this.getContacts),
				getSpecificClients: lang.hitch(this, this.getSpecificClients),
				getSuggestions: lang.hitch(this, this.getSuggestions),
				getSuggestionsButton: lang.hitch(this, this.getSuggestionsButton)
				
			});	
			this.registerView(this.rootView);
			this.registerView(this.ContactView);
			this.registerView(this.MergeView);
		},
		
		getContacts: function(from){
			var params = {from: from};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContacts', params)
		},
		
		getContactsByLetter: function(letter){
			var params = {letter: letter};
			return xhrManager.send('GET', 'rest/v1.0/Contacts/getContactsByLetter', params);
		},
		
		getSpecificClients: function(ids){
			var params = {ids: ids};
			return xhrManager.send('POST', 'rest/v1.0/Contacts/getSpecificClients', params);
		},

		getSuggestions: function(word){
			var params = {word: word};
			console.log("console: findContact/Module.js: ", params);
			return xhrManager.send('GET', 'rest/v1.0/Suggestions/getSuggestions', params);
		},
		
		getSuggestionsButton: function(word){
			var params = {word: word};
			console.log("console: findContact/Module.js: ", params);
			return xhrManager.send('GET', 'rest/v1.0/Suggestions/getSuggestionsButton', params);
		},
		
		mergeFriends: function(mergeArr){
			var params = {mergeArr: mergeArr};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/mergeFriends', params);
		},
		
		unMergeFriends: function(unMergeArr){
			var params = {unMergeArr: unMergeArr};
			return xhrManager.send('POST', 'rest/v1.0/Favorites/unMergeFriends', params);
		}
		
	})
});