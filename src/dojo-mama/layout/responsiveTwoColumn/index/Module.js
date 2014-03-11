define(['dojo/_base/declare',
		'dojo/_base/window',
		'dojo/dom-class',
		'dojo-mama/Module',
		'dojo-mama/views/ModuleView'
], function(declare, win, domClass,
	Module, ModuleView) { 
	return declare([Module], {
		'class': 'rootModule',
		// body: [private] Object
		//     Alias to window.body
		body: null,
		postCreate: function() {
			// summary:
			//     Create the module views
			this.inherited(arguments);
			this.body = win.body();
			// use the router base instead of the monkey-patched module router
			this.router = this.routerBase;
		},
		activate: function() {
			domClass.add(this.body, 'dmRootView');
		},
		deactivate: function() {
			domClass.remove(this.body, 'dmRootView');
		}
	});
});
