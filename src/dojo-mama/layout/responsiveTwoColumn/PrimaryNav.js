define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo/_base/window',
		'dojo/dom-class',
		'dojo/dom-construct',
		'dojo/topic',
		'dojo-mama/util/ScrollablePane',
		'./PrimaryNavItem'
], function(declare, kernel, lang, win, domClass, domConstruct, topic, ScrollablePane, PrimaryNavItem) {

	// module:
	//     dojo-mama/layout/responsiveTwoColumn/PrimaryNav

	return declare([ScrollablePane], {
		// summary:
		//     Generates the application framework layout from a dmConfig object.

		constructor: function() {
			// summary:
			//      Instantiate the primary nav
			this.config = kernel.global.dmConfig;
		},

		'class': 'dmPrimaryNav',
		// config: [private] Object
		//     The dmConfig config object
		config: null,
		// lastSelectedNavItem: [private] Object
		//     Used to maintain proper focus on navigation items
		lastSelectedNavItem: null,
		// moduleManager: [private] Object
		//    Class that controls the launching and routing of modules
		moduleManager: null,
		// navItems: [private] Object
		//     Maps module names to their navigation elements to maintain
		//     proper focus of navigation items when deep-linking
		navItems: {},

		buildRendering: function() {
			// summary:
			//     Build out the primary navigation
			this.inherited(arguments);
			var i, items,
				moduleConfig,
				modules,
				name,
				nav,
				navItem;
			nav = domConstruct.create('ul', {
				role: 'navigation',
				title: 'Menu'
			});
			// create the nav list items
			modules = this.config.modules;
			items = this.config.nav.primary;
			for (i=0; i < items.length; ++i) {
				name = items[i];
				moduleConfig = modules[name];
				if (!moduleConfig) {
					console.error('Undefined module in dmConfig primary navigation:', name);
					return;
				}
				navItem = new PrimaryNavItem({
					label: moduleConfig.title || '',
					href: '#/' + name
				});
				domClass.add(navItem.domNode, 'dmPrimaryNavItem_' + name);
				navItem.startup();

				// save the route mapping for style updates on deep linking
				navItem.name = name;
				this.navItems[name] = navItem;
				domConstruct.place(navItem.domNode, nav);
			}

			// map submodules to primary nav items
			for (name in this.config.modules) {
				if (this.config.modules.hasOwnProperty(name)) {
					if (!this.navItems[name]) {
						moduleConfig = this.config.modules[name];
						if (moduleConfig.selectedPrimaryNavItem) {
							this.navItems[name] = this.navItems[moduleConfig.selectedPrimaryNavItem];
						}
					}
				}
			}

			// add the nav to this dom node
			domConstruct.place(nav, this.containerNode);
		},

		startup: function() {
			this.inherited(arguments);
			// subscribe to update nav item selections on module launch
			var secondaryNavItems = {},
				len = this.config.nav.secondary ? this.config.nav.secondary.length : 0,
				i;
			for (i=0; i < len; ++i) {
				secondaryNavItems[this.config.nav.secondary[i]] = true;
			}
			topic.subscribe('/dojo-mama/activateModule', lang.hitch(this, function(module) {
				var navItem = this.navItems[module.name];
				// remove selection from last selected nav item
				if (this.lastSelectedNavItem) {
					domClass.remove(win.body(), 'dmSelectedPrimaryNavItem_' + this.lastSelectedNavItem.name);
					if (navItem || secondaryNavItems[module.name] || module.name === '404') {
						domClass.remove(this.lastSelectedNavItem.domNode, 'dmPrimaryNavItemSelected');
					}
				}
				// add selection to newly launched item
				if (navItem) {
					domClass.add(navItem.domNode, 'dmPrimaryNavItemSelected');
					this.lastSelectedNavItem = navItem;
					// add class to body for selected primary nav item
					domClass.add(win.body(), 'dmSelectedPrimaryNavItem_' + navItem.name);
				}
			}));
		}
	});
});
