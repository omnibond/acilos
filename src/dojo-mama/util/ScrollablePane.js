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
		'dojo/dom-geometry',
		'dojo/dom-style',
		'dojo/has',
		'dojo/NodeList-traverse',
		'dojo/query',
		'dojo/touch',
        'dojox/mobile/Pane'],
function(declare, lang, domGeom, domStyle, has, traverse, query, touch, Pane) {

	// module:
	//     dojo-mama/util/ScrollablePane

	var ScrollablePane;

	if (has('android') < 4) {
		ScrollablePane = declare([Pane], {

			dragStart: null,
			offset: null,
			maxOffset: null,

			transformInterval: null,

			postCreate: function() {
				this.inherited(arguments);

				this.offset = {x: 0, y: 0};

				touch.press(document.body, lang.hitch(this, function(e) {
					e.preventDefault();
					e.stopPropagation();

					this.dragStart = {x: e.pageX, y: e.pageY};

					// Find total height of children
					// Compare to view's height to find max allowable offset
					var nl = new query.NodeList();
					nl.push(this.domNode);
					var children = nl.children();
					var i;
					var contentHeight = 0;
					for (i = 0; i < children.length; i++) {
						contentHeight += domGeom.getMarginBox(children[i]).h;
					}

					var nodeHeight = domGeom.getMarginBox(this.domNode).h;

					this.maxOffset = Math.min(0, nodeHeight - contentHeight);
				}));

				touch.move(document.body, lang.hitch(this, function(e) {
					e.preventDefault();
					e.stopPropagation();

					if (this.dragStart) {
						var dx = e.pageX - this.dragStart.x;
						var dy = e.pageY - this.dragStart.y;

						this.dragStart = {x: e.pageX, y: e.pageY};

						this.offset.x += dx;
						this.offset.y += dy;

						this.offset.y = Math.max(Math.min(this.offset.y, 0), this.maxOffset);

						domStyle.set(this.domNode, {
							'-webkit-transform': 'translate(0, ' + this.offset.y + 'px)'
						});
					}

				}));

				touch.release(document.body, lang.hitch(this, function(e) {
					e.preventDefault();
					e.stopPropagation();
					this.dragStart = null;
				}));
			}
		});
	}

	else {
		ScrollablePane = declare([Pane], {
			style: {
				overflow: 'auto'
			}
		});
	}

	return ScrollablePane;
});
