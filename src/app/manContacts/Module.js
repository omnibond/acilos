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