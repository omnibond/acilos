define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo/_base/window',
		'dojo/_base/array',
		'dojo/dom-attr',
		'dojo/dom-class',
		'dojo/dom-construct',
		'dojo/keys',
		'dojo/topic',
		'dojo/on',
		'dojo/router',
		'dojox/mobile/Pane'
], function(declare, kernel, lang, win, array, domAttr, domClass, domConstruct, keys, topic, on, router, Pane) {

	// module:
	//     dojo-mama/layout/responsiveTwoColumn/MenuBar

	return declare([Pane], {
		// summary:
		//     The secondary navigation menu

		constructor: function() {
			// summary:
			//      Instantiate the menu
			this.config = kernel.global.dmConfig;
		},

		baseClass: 'dmMenuBar',
		// cog: [private] Object
		//     The div that activates the popup menu
		cog: null,
		// config: [private] Object
		//     The dmConfig config object
		config: null,
		// menuItems: [private] Array
		//     An array of menu items
		// menuItems: [],
		// moduleManager: [private] Object
		//    Class that controls the launching and routing of modules
		moduleManager: null,
		// popupMenu: [private] Object
		//    A div used for the popup secondary navigation menu
		popupMenu: null,
		// popupMenuItems: [private] Array
		//     An array of the drop down menu items
		popupMenuItems: [],
		// allPopupMenuItems: [private] Array
		//     An array of the drop down menu items in the phone mode
		allPopupMenuItems: [],
		// visible: [private] Boolean
		//     Visibility of the popup menu
        visible: false,

		buildRendering: function() {
			// summary:
			//     Build out the menu bar
			// tags:
			//     protected

			this.inherited(arguments);
			var items = this.config.nav.secondary || [],
				i, name,
				selectedMenuItem,  // the currently selected drop down link
				handlePopupMenuKeyEvent,  // key event handler for popup menu
				togglePopup,  // helper function to toggle the popup menu
				handleCogKeyEvent,  // cog icon key event handler
				focusSelectedMenuItem;  // focus a selected popup menu item

			// create the popup menu icon
			this.cog = domConstruct.create('a', {
				'class': 'dmMenuBarItem dmMenuBarPopupItem dmMenuBarPopupItemHiddenTablet'
			});

			this.popupMenu = domConstruct.create('div', {
				'class': 'dmPopupMenu hidden_tablet'
			});

			// add all the menu items to the menu bar and the popup menu
			for(i=0; i < items.length; ++i) {
				name = items[i];
				// names beginning with an exclamation point
				// are also added as text links
				this.addMenuItem(name, this.config.modules[name].linkText);
			}

			domConstruct.place(this.cog, this.domNode, 'last');

			// the responsive version of popupMenuItems (is changed in mobile view)
			var responsivePopupMenuItems = this.popupMenuItems;

			// toggle popup menu
			togglePopup = function(e) {
				domClass.toggle(this.popupMenu, 'visible');
				domAttr.set(this.popupMenu, 'aria-hidden', this.visible ? 'true' : 'false');
				this.visible = !this.visible;
				if (!this.visible) {
					this.cog.focus();
				}
				e.stopPropagation();
			};
			// handle cog keyboard navigation
			handleCogKeyEvent = function(e) {
				var code = e.charCode || e.keyCode,
					toggle = lang.hitch(this, togglePopup, e);
				switch(code) {
					// toggle the menu using enter or space
					case keys.ENTER:
					case keys.SPACE:
						toggle();
						e.preventDefault();
						break;
					case keys.DOWN_ARROW:
						if (!this.visible) {
							toggle();
						}
						selectedMenuItem = 0;
						focusSelectedMenuItem();
						break;
					// if tabbing away from the drop down menu, close it
					case keys.TAB:
					case keys.ESCAPE:
						if (this.visible) {
							toggle();
						}
						break;
					default:
						break;
				}
			};
			focusSelectedMenuItem = lang.hitch(this, function() {
				var menuItem = responsivePopupMenuItems[selectedMenuItem];
				menuItem.focus();
			});
			// handle popup menu keyboard navigation
			handlePopupMenuKeyEvent = function(e) {
				var code = e.charCode || e.keyCode,
					toggle = lang.hitch(this, togglePopup, e);
				switch(code) {
					// toggle the menu using enter or space
					case keys.DOWN_ARROW:
						selectedMenuItem = (selectedMenuItem + 1) % responsivePopupMenuItems.length;
						focusSelectedMenuItem();
						e.stopPropagation();
						e.preventDefault();
						break;
					case keys.UP_ARROW:
						if (selectedMenuItem === 0) {
							selectedMenuItem = responsivePopupMenuItems.length;
						}
						selectedMenuItem--;
						focusSelectedMenuItem();
						e.stopPropagation();
						e.preventDefault();
						break;
					case keys.TAB:
					case keys.ESCAPE:
						toggle();
						break;
					default:
						break;
				}
			};

			var _this = this;
			function changeToPhone() {
				array.forEach(_this.allPopupMenuItems, function (item) {
					domAttr.remove(item, 'aria-hidden');
				});
				responsivePopupMenuItems = _this.allPopupMenuItems;
			}
			function changeToTablet() {
				array.forEach(_this.allPopupMenuItems, function (item) {
					domAttr.set(item, 'aria-hidden', 'true');
				});
				array.forEach(_this.popupMenuItems, function (item) {
					domAttr.remove(item, 'aria-hidden');
				});
				responsivePopupMenuItems = _this.popupMenuItems;
			}

			// bind events
			on(this.cog, 'click', lang.hitch(this, togglePopup));
			on(this.cog, 'keydown', lang.hitch(this, handleCogKeyEvent));
			on(this.cog, 'keypress', lang.hitch(this, handleCogKeyEvent));
			on(this.popupMenu, 'keydown', lang.hitch(this, handlePopupMenuKeyEvent));
			on(this.popupMenu, 'keypress', lang.hitch(this, handlePopupMenuKeyEvent));

			// ARIA
			// menu bar container
			domAttr.set(this.domNode, 'role', 'navigation');
			domAttr.set(this.domNode, 'title', 'Menu Bar');
			domAttr.set(this.domNode, 'tabindex', 0);
			// gear icon
			domAttr.set(this.cog, 'role', 'menu');
			domAttr.set(this.cog, 'tabindex', 0);
			domAttr.set(this.cog, 'aria-haspopup', 'true');

			topic.subscribe('/dojox/mobile/screenSize/phone', changeToPhone);
			topic.subscribe('/dojox/mobile/screenSize/tablet', changeToTablet);

			// add the popup menu to the menu bar
			domConstruct.place(this.popupMenu, this.domNode, 'last');
		},

		startup: function() {
			on(win.body(), 'click', lang.hitch(this, function(e) {
                if (!this.visible) { return; }
				var target = e.target;
				while (target) {
					// ignore my click events
					if (target === this.popupMenu) { return; }
					target = target.parentNode;
				}
				domClass.remove(this.popupMenu, 'visible');
                this.visible = false;
				// ARIA
				domAttr.set(this.popupMenu, 'aria-hidden', true);
			}));
		},

		addMenuItem: function(/*String*/ name, /*Boolean*/ linkText) {
			// summary:
			//     Add a menu item to the menu bar and to the popup menu
			// tags:
			//     private
			// name:
			//     The name of the module to add to the navigation. The module's title
			//     attribute is used for the link label.
			// linkText:
			//     If falsey, only add the menu item to the popup menu. If truthy,
			//     add the menu item to the popup menu as well as a text link
			//     in the menu bar.
			var module = this.config.modules[name],
				menuItem;
			if (!module) {
				console.error('Undefined module in dmConfig secondary navigation:', name);
				return;
			}
			if (linkText) {
				menuItem = domConstruct.create('a', {
					'class': 'dmMenuBarItem',
					innerHTML: module.title,
					href: '#' + this.config.baseRoute + name
				}, this.domNode, 'last');
				// ARIA
				domAttr.set(menuItem, 'role', 'menuitem');
			}
			else {
				domClass.remove(this.cog, 'dmMenuBarPopupItemHiddenTablet');
				domClass.remove(this.popupMenu, 'hidden_tablet');
			}
			var _this = this;
			menuItem = domConstruct.create('a', {
				'class': 'dmMenuBarItem' + (linkText ? ' hidden_tablet' : ''),
				// id: 'dmPopupMenuItem_' + this.menuItems.length,
				innerHTML: module.title,
				href: '#' + this.config.baseRoute + name,
				onclick: function(e) {
					router.go(_this.config.baseRoute + name);
					domClass.remove(_this.popupMenu, 'visible');
					domAttr.set(_this.popupMenu, 'aria-hidden', 'true');
                    _this.visible = false;
					//this.cog.focus();
					this.blur();
				}
			}, this.popupMenu, 'last');
			// this.menuItems.push(menuItem);
			if (!linkText) {
				this.popupMenuItems.push(menuItem);
			}
			this.allPopupMenuItems.push(menuItem);
			// ARIA
			domAttr.set(menuItem, 'role', 'menuitem');
		}
	});
});
