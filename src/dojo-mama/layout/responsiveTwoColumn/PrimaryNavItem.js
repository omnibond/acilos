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
