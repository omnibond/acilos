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
