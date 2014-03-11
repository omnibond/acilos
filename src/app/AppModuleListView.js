define(['dojo/_base/declare',
		'dojox/mobile/EdgeToEdgeList',
		'dojo-mama/util/LinkListItem',
		'dojo-mama/views/ModuleScrollableView'
], function(declare, EdgeToEdgeList, LinkListItem, ModuleScrollableView) {

	// module:
	//     dojo-mama/views/ModuleList

	return declare([ModuleScrollableView], {
		// summary:
		//     A module list
		postCreate: function() {
			// summary:
			//     Construct the UI for this widget, setting this.domNode
			// tags:
			//     protected

			this.inherited(arguments);

			var li, m;
			this.list = new EdgeToEdgeList();
			this.list.startup();
			for (m in this.modules) {
				if (this.modules.hasOwnProperty(m)) {
					li = new LinkListItem({
						text: this.modules[m].label,
						icon: this.modules[m].icon,
						href: '#/' + m
					});
					this.list.addChild(li);
				}
			}
			this.list.placeAt(this.domNode);
		}
	});
});
