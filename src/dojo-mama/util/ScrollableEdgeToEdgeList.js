define(['dojo/_base/declare',
		'dojo/dom-attr',
		'dojo/dom-class',
		'dojo/dom-construct',
		'dojox/mobile/EdgeToEdgeList',
		'./BaseListItem',
		'./ScrollablePane'
], function(declare, domAttr, domClass, domConstruct,
	EdgeToEdgeList, BaseListItem, ScrollablePane) {
	return declare([ScrollablePane], {

		buildRendering: function() {
			this.inherited(arguments);
			this.list = new EdgeToEdgeList();
			this.list.placeAt(this.containerNode);
			this.list.startup();
		},

		addItem: function(/*Object*/ listItem) {
			this.list.addChild(listItem);
		},

		reset: function() {
		   this.list.destroyDescendants();
		}

	});
});
