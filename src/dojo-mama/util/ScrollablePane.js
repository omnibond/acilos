/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/
/****************************************************************************
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems: www.omnibond.com for Acilos.com
**
** OpenClemson Dojo-Mama framework: https://github.com/OpenClemson/dojo-mama
** Copyright (C) 2014 Clemson University and/or its subsidiary(-ies).
** All rights reserved.
** Clemson University - www.clemson.edu
** 
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems - www.omnibond.com
** Clemson University - www.clemson.edu
**
** $QT_END_LICENSE$
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
