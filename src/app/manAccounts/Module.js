define(['dojo/_base/declare',
		'dojo-mama/Module',
		'dojo/_base/lang',

		'app/manAccounts/MainView',
		'app/manAccounts/AddAccounts',
		'app/manAccounts/EditAccounts',
		'app/manAccounts/AuthenticateAccounts',

		'app/util/xhrManager'
], function(
	declare, 
	Module, 
	lang,

	MainView,
	AddAccounts,
	EditAccounts,
	AuthAccounts,

	xhrManager
){
	return declare([Module], {

		postCreate: function(){
			this.inherited(arguments);

			this.rootView = new MainView({
				route: '/'	
			});

			this.AddAccounts = new AddAccounts({
				route: '/AddAccounts',
				title: "Add new Accounts",

				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				saveServiceCreds: lang.hitch(this, this.saveServiceCreds),			
				getDomain: lang.hitch(this, this.getDomain)			
			});

			this.EditAccounts = new EditAccounts({
				route: '/EditAccounts',
				title: "Edit new Accounts",

				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				editServiceCreds: lang.hitch(this, this.editServiceCreds),
				deleteServiceCred: lang.hitch(this, this.deleteServiceCred)				
			});

			this.AuthAccounts = new AuthAccounts({
				route: '/AuthAccounts',
				title: "Authenticate Accounts",

				manualCrons: lang.hitch(this, this.manualCrons),
				getServiceCreds: lang.hitch(this, this.getServiceCreds),
				getAuthCreds: lang.hitch(this, this.getAuthCreds),
				setMainLogin: lang.hitch(this, this.setMainLogin)
			});

			this.registerView(this.rootView);
			this.registerView(this.AddAccounts);
			this.registerView(this.EditAccounts);
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

		saveServiceCreds: function(key, secret, redir, color, param){
			var params = {key: key, secret: secret, redir: redir, color: color, param: param};
			return xhrManager.send('POST', 'rest/v1.0/Database/saveServiceCredsObj', params);
		},

		editServiceCreds: function(key, secret, redir, color, param){
			var params = {key: key, secret: secret, redir: redir, color: color, param: param};
			return xhrManager.send('POST', 'rest/v1.0/Database/editServiceCreds', params);
		},

		deleteServiceCred: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/deleteServiceCred', params);
		},

		getDomain: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getDomain', params);
		},

		setMainLogin: function(obj){
			var params = {obj: obj};
			return xhrManager.send('POST', 'rest/v1.0/Database/setMainLogin', params);
		}
	})
});