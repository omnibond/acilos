/*
dojo-mama: a JavaScript framework
Copyright (C) 2014 Clemson University

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/
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
						href: '#/' + m
					});
					this.list.addChild(li);
				}
			}
			this.list.placeAt(this.domNode);
		}
	});
});
