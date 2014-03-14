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
		'dojo/dom-attr',
		'dojo/dom-class',
		'dojo/dom-construct',
		'dojo/on',
		'dijit/_WidgetBase'
], function(declare, lang, domAttr, domClass, domConstruct, on, _WidgetBase) {
	return declare([_WidgetBase], {

		icon: null,

		onIconLoad: null,

		text: null,

		rightText: null,

		iconContainerNode: null,

		iconNode: null,

		textNode: null,

		rightTextNode: null,

		onClick: null,

		onClickSignal: null,

		buildRendering: function() {
			this.inherited(arguments);

			this.domNode = domConstruct.create('li', {
				'class': 'dmListItem'
			});

			this.textNode = domConstruct.create('div', {
				'class': 'dmListItemText'
			}, this.domNode);
		},

		destroy: function() {
			if (this.onClickSignal) {
				this.onClickSignal.remove();
			}
			this.inherited(arguments);
		},

		_setIconAttr: function(icon) {
			this._set('icon', icon);

			if (icon === null) {
				if (this.iconNode) {
					domConstruct.destroy(this.iconNode);
				}
				return;
			}

			if (!this.iconNode) {
				this.iconContainerNode = domConstruct.create('div', {
					'class': 'dmListItemIconContainer'
				}, this.textNode, 'before');
				this.iconNode = domConstruct.create('img', {
					'class': 'dmListItemIcon'
				}, this.iconContainerNode);
			}

			if (this.onIconLoad !== null) {
				var img = new Image();
				img.onload = lang.hitch(this, lang.partial(this.onIconLoad, img));
				img.src = icon;
			}

			domAttr.set(this.iconNode, 'src', icon);
		},

		_setTextAttr: function(text) {
			this._set('text', text);

			this.textNode.innerHTML = text;
		},

		_setRightTextAttr: function(rightText) {
			this._set('rightText', rightText);

			if (!this.rightTextNode) {
				this.rightTextNode = domConstruct.create('div', {
					'class': 'dmListItemRightText'
				}, this.textNode, 'before');
			}
			this.rightTextNode.innerHTML = rightText;
		},

		_setRightTextNodeAttr: function(node) {
			if (!this.rightTextNode) {
				this.rightTextNode = node;
				domClass.add(node, 'dmListItemRightText');
				domConstruct.place(node, this.textNode, 'before');
			} else {
				domConstruct.destroy(this.rightTextNode);
				this.rightTextNode = node;
			}
		},

		_setOnClickAttr: function(onClick) {
			this._set('onClick', onClick);

			if (this.onClickSignal) {
				this.onClickSignal.remove();
			}
			this.onClickSignal = on(this.domNode, 'click', onClick);
		}

	});
});
