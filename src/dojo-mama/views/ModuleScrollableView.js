define(['dojo/_base/declare',
		'dojo-mama/views/_ModuleViewMixin',
		'dojo-mama/util/ScrollablePane',
		'dijit/_Container'
], function(declare, ModuleViewMixin, ScrollablePane, Container) {

	// module:
	//     dojo-mama/views/ModuleScrollableView

	return declare([ScrollablePane, Container, ModuleViewMixin], {
		// summary:
		//     A scrollable module view
	});

});
