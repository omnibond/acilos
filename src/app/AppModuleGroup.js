define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo-mama/Module',
		'app/AppModuleListView'
], function(declare, kernel, lang, Module, ModuleListView) {
	return declare([Module], {

		config: null,

		constructor: function() {
			this.config = kernel.global.dmConfig;
		},

		postCreate: function() {
			// summary:
			//    A module containing a list of other modules

			this.inherited(arguments);
			var i, moduleName, modules = {};

			for (i=0; i < this.modules.length; ++i) {
				moduleName = this.modules[i];
				modules[moduleName] = {
					route: this.config.baseRoute + moduleName,
					label: this.config.modules[moduleName].title,
					icon: this.config.modules[moduleName].icon
				};
			}
			this.rootView = new ModuleListView({
				module: this,
				modules: modules,
				route: '/'
			});
			this.registerView(this.rootView);
		}

	});
});
