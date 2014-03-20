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
		'dojo/_base/lang',
		'dojo/dom-attr',
        'dojo/dom-construct',
		'dijit/_WidgetBase'],
function(declare, lang, domAttr, domConstruct, WidgetBase) {

	// module:
	//     dojo-mama/layout/responsiveTwoColumn/PrimaryNavItem

	return declare([WidgetBase], {
		// summary:
		//     A primary navigation item

		// linkNode: Object
		//     The node containing the navigation item's a tag
		linkNode: null,
		// href: String
		//     The destination this navigation item links to
		href: null,
		// colorNode: Object
		//     The node containing the navigation item's color
		colorNode: null,
		// contentNode: oBject
		//     The node containing additional content in tablet view
		contentNode: null,
		// iconNode: Object
		//     The node containing the navigation item's icon
		iconNode: null,
		// clickable: Boolean
		//     dojox/mobile/ListItem clickable attribute
		clickable: true,

		constructor: function(args) {
			lang.mixin(this, args);
		},

		buildRendering: function() {
			// summary:
			//     Build out the primary navigation item
			this.domNode = domConstruct.create('li', {
				role: 'menuitem'
			});

			this.linkNode = domConstruct.create('a', {
				style: {
					display: 'block',
					overflow: 'hidden'
				}
			}, this.domNode);

			this.colorNode = domConstruct.create('div', {
				'class': 'dmPrimaryNavItemColor'
			}, this.linkNode);
			this.iconNode = domConstruct.create('div', {
				'class': 'dmPrimaryNavItemIcon'
			}, this.linkNode);
			this.labelNode = domConstruct.create('div', {
				'class': 'dmPrimaryNavItemLabel'
			}, this.linkNode);
			this.contentNode = domConstruct.create('div', {
				'class': 'dmPrimaryNavItemContent'
			}, this.linkNode);
			this.inherited(arguments);
		},

		_setLabelAttr: function(/*String*/ label) {
			this.labelNode.innerHTML = label;
		},

		_setHrefAttr: function(/*String*/ href) {
			domAttr.set(this.linkNode, 'href', href);
		}
	});
});
