define(['dojo/_base/declare',
		'dojo-mama/views/_ModuleViewMixin',
		'dojox/mobile/Pane',
		'dijit/_Container'
], function(declare, ModuleViewMixin, Pane, Container) {

	// module:
	//     dojo-mama/views/ModuleView

	return declare([Pane, Container, ModuleViewMixin], {
		// summary:
		//     A base module view
		baseClass: ''
	});
});
