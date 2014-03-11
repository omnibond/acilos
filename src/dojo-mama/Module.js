define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo/dom-construct',
		'dojo/router/RouterBase',
		'dojo/topic',
		'dijit/_WidgetBase',
		'dojox/css3/transit'
], function(declare, kernel, lang, domConstruct, RouterBase, topic, WidgetBase, transit) {

	// module:
	//     dojo-mama/views/Module

	return declare([WidgetBase], {
		// summary:
		//     The base module class

		baseClass: 'stretch',
		// active: Boolean
		//     Signifies if the module is currently selected
		active: false,
		// containerNode: Object
		//     The module's container node, mixed in by the constructor
		containerNode: null,
		// config: [private] Object
		//     The dmConfig config object
		config: null,
		// currentView: Object
		//     The module's currently active view
		currentView: null,
		// getMode: Function
		//     Set by dojo-mama/ModuleManager, returns
		//     the current mode, 'phone' or 'tablet'
		getMode: null,
		// moduleId: String
		//     Contains the dojo path to the module
		moduleId: '',
		// name: String
		//     The key used in dmConfig for this module
		name: '',
		// prevTransit: [private] Object
		//     The previous view transition promise
		prevTransit: null,
		// rootView: Object
		//     The primary view of this module
		rootView: null,
		// router: Object
		//     A monkey-patched dojo/router/RouterBase to handle
		//     module-relative routes
		router: null,
		// routerBase: Object
		//     A dojo/router/RouterBase
		routerBase: null,

		constructor: function() {
			this.config = kernel.global.dmConfig;
			this.routerBase = new RouterBase();
			// monkey-patch the router base
			var go = lang.hitch(this, function(route) {
				route = this.getAbsoluteRoute(route);
				this.routerBase.go(route);
			});
			var register = lang.hitch(this, function(route, cb) {
				route = this.getAbsoluteRoute(route);
				this.routerBase.register(route, cb);
			});
			this.router = {
				go: go,
				register: register,
				goToAbsoluteRoute: lang.hitch(this.routerBase, this.routerBase.go)
			};
		},

		buildRendering: function() {
			this.inherited(arguments);
			domConstruct.place(this.domNode, this.containerNode);
		},

		startup: function() {
			// summary:
			//     Startup the module
			this.inherited(arguments);
		},

		activate: function(/*Object*/ e) {
			// summary:
			//     Activates a module, showing the current view.
			//     May be used to initiate a module's background processing.
			// e:
			//     The router event
			console.log('activating', this.name);
			this.set('active', true);
			this.domNode.style.display = '';
			if (!this.rootView) {
				console.error('Module rootView is undefined');
				return;
			}

			if (!this.routerBase._started) {
				this.routerBase.startup();
			}
			this.handleRoute(e);
		},

		deactivate: function() {
			// summary:
			//     Deactivates a module, hiding the current view.
			//     May be used to stop any background processing.
			console.log('deactivating', this.name);
			if (this.currentView) {
				this.currentView.deactivate();
			}
			this.set('active', false);
			this.domNode.style.display = '';
			if (this.currentView && this.currentView.domNode) {
				this.currentView.domNode.style.display = 'none';
			} else {
				console.warn("Deactivate cannot hide current view. " +
					"A view route may not have been registered. Module:", this);
			}
			this.currentView = null;
		},

		getAbsoluteRoute: function(/*String?*/ route) {
			// summary:
			//     Return the absolute route for a module's view route
			// route:
			//     A module-relative view route

			// no trailing slashes
			var r = route === '/' ? '' : route;
			return this.config.baseRoute + this.name + r;
		},

		getRouteHref: function(/*String?*/ route) {
			// summary:
			//     Return an absolute href for a module's view route
			// route:
			//     A module-relative view route

			var r = route === '/' ? '' : route;
			return '#' + this.config.baseRoute + this.name + r;
		},

		handleRoute: function(/*Object*/ e) {
			// summary:
			//    Handle a routing event
			// e:
			//    A dojo/router event
			var view = e.params.view;
			var match = false;
			console.log("Module handling route");

			// Check to see if any of this module's views are registered for the route
			var i;
			for (i = this.routerBase._routes.length - 1; i >= 0; i--) {
				if (this.routerBase._routes[i].route.test(e.newPath)) {
					match = true;
					break;
				}
			}

			if (match) {
				console.log('Route matches');
				this.router.go(view ? '/' + view : '/');
			}
			else {
				console.log('No route match: showing 404');
				topic.publish('/dojo-mama/show404', e);
			}
		},

		registerView: function(/*Object*/ view) {
			// summary:
			//     Add a view's DOM node to the module's container
			//     and register the view's route with the router
			// view:
			//     A dojo-mama/ModuleView

			// register the view with the router
			this.registerViewRoute(view, view.route);
			// give the view a handle to its module
			view.module = this;
			// provide router methods
			view.router = this.router;
			view.placeAt(this.domNode);
			view.startup();
		},

		registerViewRoute: function(/*Object*/ view, /*Object*/ route, /*Function?*/ callback) {
			// summary:
			//     Register a view's route with the router
			// view:
			//     A dojo-mama/ModuleView
			// route:
			//     A dojo/router route
			// callback:
			//     A callback function passed to router.register().
			//     If not given, view.activate will be used as the callback and hitched to the view.
			//     The callback will be called with the router's
			//     routing event as described at the following link:
			//     http://dojotoolkit.org/reference-guide/1.9/dojo/router.html#register

			var viewCallback = callback || lang.hitch(view, view.activate),
				routerCallback = lang.hitch(this, this.routeView, view, viewCallback);
			this.router.register(route, routerCallback);
		},

		routeView: function(view, cb, e) {
			// summary:
			//     Route to a module view
			// view:
			//     The view to route to
			// cb:
			//     A callback to call after routing
			// e:
			//     The dojo/router event associated with this view

			console.log('routeView');
			console.log(e);

			// create a callback augmented with the route event as a parameter
			// note: partial will return a function even if the first parameter is
			// undefined
			var callback = lang.partial(cb, e),
				showTransition,
				oldView = this.currentView,
				postTransition;
			
			// show transition?
			if (e.oldPath  // if we're not deep linking
				&& e.newPath !== this.config.baseRoute  // we're not at the index
				&& oldView  // a previous view exists
				&& oldView !== view  // the old view isn't the one we're showing
				&& this.getMode() === 'phone'  // and we're in mobile mode
			) {
				showTransition = true;
			} else {
				showTransition = false;
			}

			postTransition = function() {
				if (oldView) {
					oldView.domNode.style.display = 'none';
				}
				view.domNode.style.display = '';
			};

			// update the sub nav
			// TODO take this out of core
			topic.publish('/dojo-mama/updateSubNav', {
				back: view.parentView ? this.getAbsoluteRoute(view.parentView) : '/',
				title: view.title || (this.title || '')
			});

			// perform view transition
			view.domNode.style.display = '';
			if (showTransition) {
				if (this.prevTransit && !this.prevTransit.isFulfilled()) {
					this.prevTransit.cancel();
				}
				this.prevTransit = transit(oldView.domNode, view.domNode, {
					transition: 'fade',
					duration: this.config.transitionDuration
				});
				this.prevTransit.then(postTransition, postTransition);
			} else {
				postTransition();
			}

			// activate/deativate views
			if (oldView && view !== oldView) {
				oldView.deactivate();
			}
			this.currentView = view;
			callback();

		}

	});
});
