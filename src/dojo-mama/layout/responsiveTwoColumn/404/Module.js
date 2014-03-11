define(['dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/dom-construct',
		'dojo-mama/Module',
		'dojo-mama/views/ModuleView'
], function(declare, lang, domConstruct, Module, ModuleView) {
	return declare([Module], {
		'class': '404Module',
		postCreate: function() {
			// summary:
			//     Create the module views
			this.inherited(arguments);

			this.rootView = new ModuleView({
				route: '/',
				title: '404'
			});
			this.registerView(this.rootView);

			domConstruct.create('h1', {
				innerHTML: 'Page does not exist'
			}, this.rootView.domNode);

		},

		// Override handle route to prevent this module's router from changing the URL, since
		// we want the bad URL to be associated with the error message.
		handleRoute: function() {
			// route to 404 with an empty router event
			this.routeView(this.rootView, lang.hitch(this.rootView, this.rootView.activate), {});
		}
	});
});
