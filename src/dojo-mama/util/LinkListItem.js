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
		'dojo/dom-attr',
		'dojo/dom-class',
		'dojo/dom-construct',
		'./BaseListItem'
], function(declare, domAttr, domClass, domConstruct, BaseListItem) {
	return declare([BaseListItem], {

		href: null,

		hrefTarget: null,

		linkNode: null,

		rightIconNode: null,

		buildRendering: function() {
			this.inherited(arguments);

			domClass.add(this.domNode, 'dmLinkListItem');

			this.linkNode = domConstruct.create('a', null, this.domNode);

			domConstruct.place(this.textNode, this.linkNode);

			this.rightIconNode = domConstruct.create('div', {
				'class': 'dmRightIcon'
			}, this.textNode, 'after');
		},

		_setTextAttr: function(text) {
			this.inherited(arguments);

			domAttr.set(this.linkNode, 'title', text);
		},

		_setHrefAttr: function(href) {
			this._set('href', href);

			if (href === null) {
				domAttr.remove(this.linkNode, 'href');
			}
			else {
				domAttr.set(this.linkNode, 'href', href);
			}
		},

		_setHrefTargetAttr: function(hrefTarget) {
			this._set('hrefTarget', hrefTarget);

			if (hrefTarget === null) {
				domAttr.remove(this.linkNode, 'target');
			}
			else {
				domAttr.set(this.linkNode, 'target', hrefTarget);
			}
		},

		_setRightTextAttr: function() {
			this.inherited(arguments);

			domConstruct.place(this.rightTextNode, this.textNode, 'before');
		}

	});
});
