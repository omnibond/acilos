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
