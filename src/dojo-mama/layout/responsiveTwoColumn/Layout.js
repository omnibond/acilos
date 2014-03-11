define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo/_base/window',
		'dojo/Deferred',
		'dojo/dom-attr',
		'dojo/dom-class',
		'dojo/dom-construct',
		'dojo/router',
		'dojo/topic',
		'dijit/_WidgetBase',
		'dojox/css3/transit',
		'dojox/mobile',
		'dojox/mobile/Pane',
		'dojo-mama/ModuleManager',
		'dojo-mama/util/Analytics',
		'./MenuBar',
		'./PrimaryNav',
		'./SubNav'
], function(declare, kernel, lang, win,
	Deferred, domAttr, domClass, domConstruct, router, topic,
	WidgetBase, transit, mobile, Pane, ModuleManager, 
	Analytics, MenuBar, PrimaryNav, SubNav) {

	// module:
	//     dojo-mama/layout/responsiveTwoColumn/Layout

	return declare([WidgetBase], {
		// summary:
		//     Generates the application framework layout from a dmConfig object.

		// activePane: [private] Object
		//     The pane that is currently focused
		activePane: null,
		// analytics: [private] Object
		//     Google Analytics integration module
		analytics: null,
		baseClass: 'dmLayout',
		// config: [private] Object
		//     The dmConfig config object
		config: null,
		// layoutReady: [private] Deferred
		//     Resolved when the first module is focused
		layoutReady: null,
		// leftPane: [private] Object
		//     Container in which the left pane lives
		leftPane: null,
		// menuBar: [private] Object
		//     The secondary navigation
		menuBar: null,
		// metaNav: [private] Object
		//     Container in which the secondary navigation resides
		metaNav: null,
		// mode: [private] String
		//    Either 'phone' or 'tablet'
		mode: null,
		// moduleContent: [private] Object
		//    Container node for modules
		moduleContent: null,
		// moduleManager: [private] Object
		//    Class that controls the launching and routing of modules
		moduleManager: null,
		// primaryNav: [private] Object
		//    The list container in the left pane
		primaryNav: null,
		// screenSizeReady: [private] Object
		//    A deferred that is resolved when the screen size is detected
		screenSizeReady: null,
		// rightPane: [private] Object
		//    Container in which the sub nav and module content lives
		rightPane: null,
		// subNav: [private] Object
		//    Horizontal bar containing the mobile back button,
		//    secondary module selection, and view titles
		subNav: null,
		// titleBar: [private] Object
		//    Horizontal bar containing the application's title
		titleBar: null,
		// titleHeading: [private] Object
		//    The application's title
		titleHeading: null,

		constructor: function(/*Object*/ args) {
			// summary:
			//      Creates a new Layout
			// args:
			//      The dmConfig object

			var config = args.config;
			// mixin some default configuration
			config.index = config.index || {moduleId: 'dojo-mama/index/Module'};
			config.networkTimeout = config.networkTimeout || 15000;
			config.modules['404'] = config.modules['404'] || {moduleId: 'dojo-mama/404/Module'};
			config.transitionDuration = config.transitionDuration || 250;
			config.baseRoute = '/';
			// expose the config globally
			kernel.global.dmConfig = this.config = config;
			// instantiante the module manager
			this.moduleManager = new ModuleManager({
				getMode: lang.hitch(this, this.getMode),
				focusModule: lang.hitch(this, this.focusModule)
			});
			// instantiate Google Analytics wrapper
			this.analytics = new Analytics();
		},

		buildRendering: function() {
			// summary:
			//     Build out the layout elements
			// tags:
			//     protected

			this.inherited(arguments);
			// the splitter consists of two panes
			this.leftPane = new Pane({baseClass: 'dmLeftPane'});
			// hide the layout initially to prevent flashing in mobile view of right pane
			this.domNode.style.display = 'none';
			this.rightPane = new Pane({baseClass: 'dmRightPane'});
			// the left pane contains a title bar and the primary nav
			this.titleBar = new Pane({baseClass: 'dmTitle'});
			this.titleHeading = domConstruct.create('a', {
				'class': 'dmTitleHeading',
				innerHTML: this.config.title,
				href: '#' + this.config.baseRoute
			}, this.titleBar.domNode);
			this.titleBar.placeAt(this.leftPane.domNode);
			this.primaryNav = new PrimaryNav({moduleManager: this.moduleManager});
			this.primaryNav.placeAt(this.leftPane.domNode);
			// the right pane contains the meta nav and sub nav
			this.metaNav = new Pane({baseClass: 'dmMetaNav hidden_phone'});
			this.metaNav.placeAt(this.rightPane.domNode);
			this.subNav = new SubNav();
			this.subNav.placeAt(this.rightPane.domNode);
			// and a container for module content
			this.moduleContent = new Pane({baseClass: 'dmModuleContent'});
			this.config.moduleContentNode = this.moduleContent.domNode;
			this.moduleContent.placeAt(this.rightPane.domNode);
			// create the menu bar (attach it later)
			this.menuBar = new MenuBar();
			// add the panes to the fixed splitter
			this.leftPane.placeAt(this.domNode);
			this.rightPane.placeAt(this.domNode);
			// ARIA
			domAttr.set(this.titleHeading, 'aria-label', this.config.titleLabel);
			domAttr.set(this.moduleContent.domNode, 'tabindex', 0);
			domAttr.set(this.moduleContent.domNode, 'role', 'main');
		},

		startup: function() {
			// summary:
			//     Place the layout in the DOM
			// tags:
			//     protected

			this.inherited(arguments);
			this.layoutReady = new Deferred();
			this.screenSizeReady = new Deferred();
			this.primaryNav.startup();
			this.subNav.startup();
			this.menuBar.startup();
			this.analytics.startup();
			// place the layout into the dom
			this.placeAt(win.body(), 'first');
			// subscribe to screens size events and other topics
			topic.subscribe('/dojox/mobile/screenSize/phone', lang.hitch(this, this.layoutPhone));
			topic.subscribe('/dojox/mobile/screenSize/tablet', lang.hitch(this, this.layoutTablet));
			// detect layout and transform UI
			mobile.detectScreenSize(true);
			// this.screenSizeReady is resolved after the screenSize topic is published
			this.screenSizeReady.then(lang.hitch(this, function(mode) {
				this.mode = mode;
				this.moduleManager.startup();
			}), function() { console.error('Cannot detect screensize'); });
			return this.layoutReady;
		},

		getActiveModuleName: function() {
			// summary:
			//     Return the module manager's active module name
			// tags:
			//     private

			var activeModule = this.moduleManager.activeModule;
			return activeModule && activeModule.name;
		},

		layoutPhone: function(/*Boolean?*/ transition) {
			// summary:
			//     Adjust layout for mobile/phone
			// tags:
			//     callback private
			// transition:
			//     True if a pane transition should occur. Any other value,
			//     including the dimensions provided by the screenSize topic,
			//     results in no transition.

			var postTransition, from, to;
			transition = (transition === true);

			// on the first layout, resolve screenSizeReady and startup module manager
			if (!this.mode) {
				this.screenSizeReady.resolve('phone');
				return;
			}
			this.mode = 'phone';

			console.log('laying out phone' + (transition ? ' with transition' : ''));

			if (this.getActiveModuleName() === 'index') {
				from = this.rightPane.domNode;
				to = this.leftPane.domNode;
				this.leftPane.domNode.style.display = '';
				this.showLeftPane();
			} else {
				from = this.leftPane.domNode;
				to = this.rightPane.domNode;
				this.showRightPane();
			}

			postTransition = function() {
				from.style.display = 'none';
			};

			to.style.display = '';

			if (transition) {
				transit(from, to, {
					transition: 'fade',
					duration: this.config.transitionDuration
				}).then(postTransition);
			} else {
				postTransition();
			}
		},

		layoutTablet: function() {
			// summary:
			//     Adjust layout for tablet/desktop
			// tags:
			//     callback private

			// on the first layout, resolve screenSizeReady and startup module manager
			if (!this.mode) {
				this.screenSizeReady.resolve('tablet');
				return;
			}
			this.mode = 'tablet';

			console.log('laying out tablet');

			// show the appropriate pane
			if (this.getActiveModuleName() === 'index') {
				this.rightPane.domNode.style.display = 'none';
				this.leftPane.domNode.style.display = '';
				this.showLeftPane();
			} else {
				this.showBothPanes();
			}
		},

		getMode: function() {
			// summary:
			//     Return the layouts current mode, 'phone' or 'tablet'
			return this.mode;
		},

		showLeftPane: function() {
			// summary:
			//     Update layout when only left pane is shown
			// tags:
			//     private

			this.menuBar.placeAt(this.titleBar.domNode);
			domConstruct.place(this.titleHeading, this.titleBar.domNode, 'first');
		},

		showRightPane: function() {
			// summary:
			//     Update layout when only the right pane is shown
			// tags:
			//     private

			this.menuBar.placeAt(this.subNav.domNode);
		},

		showBothPanes: function() {
			// summary:
			//     Show both panes and update the layout accordingly
			// tags:
			//     private

			this.leftPane.domNode.style.display = '';
			this.rightPane.domNode.style.display = '';
			this.menuBar.placeAt(this.metaNav.domNode);
			domConstruct.place(this.titleHeading, this.titleBar.domNode, 'first');
		},

		focusModule: function(module) {
			// summary:
			//     Update panes when a module launches (desktop+mobile)
			// module:
			//     The module instance to focus
			// tags:
			//     callback private

			var transition;

			if (module.name === 'index') {
				if (this.activePane === this.rightPane) {
					transition = true;
				}
				this.activePane = this.leftPane;
			} else {
				if (this.activePane === this.leftPane) {
					transition = true;
				}
				this.activePane = this.rightPane;
			}
			if (this.mode === 'phone') {
				this.layoutPhone(transition);
			} else {
				this.layoutTablet();
			}

			this.domNode.style.display = '';

			if (!this.layoutReady.isFulfilled()) {
				this.layoutReady.resolve();
			}
		}
	});
});
