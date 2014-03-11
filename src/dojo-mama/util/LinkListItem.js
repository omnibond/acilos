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
