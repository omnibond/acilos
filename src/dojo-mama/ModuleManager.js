define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo/_base/window',
		'dojo/dom-class',
		'dojo/router',
		'dojo/topic',
		'dojo-mama/util/toaster'
], function(declare, kernel, lang, win, domClass, router, topic, toaster) {

	// module:
	//     dojo-mama/ModuleManager

	return declare([], {
		// summary:
		//     Manages the launching and routing of modules.

		// activeModule: [private] Object
		//     The currently displayed module
		activeModule: null,
		// config: [private] Object
		//     The dmConfig config object
		config: null,
		// getMode: Function
		//     Set by dojo-mama/Layout, returns
		//     the current mode, 'phone' or 'tablet'
		getMode: null,
		// lastRoute: [private] String
		//     The last route matched by the router
		lastRoute: null,
		// modules: [private] Object
		//     An object mapping a module ID to its instance.
		modules: {},
		// show404Handle: [private] Object
		//     Handle for subscription to /dojo-mama/show404 topic
		show404Handle: null,
		// showing404: [private] Boolean
		//     Whether or not the 404 module is currently being displayed.

		constructor: function(args) {
			lang.mixin(this, args);
			this.config = kernel.global.dmConfig;
		},

		startup: function() {
			// summary:
			//     Start up the module manager

			// subscribe to 404 topic
			this.show404Handle = topic.subscribe('/dojo-mama/show404', lang.hitch(this, this.show404));

			// register routes
			var hash = kernel.global.location.hash,
				handleRoute = lang.hitch(this, this.handleRoute);
			// index (a special root module)
			router.register(this.config.baseRoute, handleRoute);
			// module root view
			router.register('/:module', handleRoute);
			router.register('/:module/', handleRoute);
			// module view
			router.register('/:module/*view', handleRoute);
			// startup the router
			router.startup();

			// If we're at the index level, route to /
			if (hash === '#' + this.config.baseRoute) {
				// prevent flashing when refreshing #/
				domClass.add(win.body(), 'dmRootView');
			} else if (hash === '') {
				// prevent flashing when refreshing #/
				domClass.add(win.body(), 'dmRootView');
				// route to index
				router.go(this.config.baseRoute);
			}

			require.on('error', function(e) {
				console.error('Cannot load module');
				console.error(e);
				var seconds = 5,
					resetTimeNode;
				toaster.displayMessage({
					text: "Connection error; retrying in <span id='dmLoadErrorResetTime'></span>...",
					containerNode: win.body(),
					type: 'error',
					time: -1
				});
				resetTimeNode = document.getElementById('dmLoadErrorResetTime');
				(function countdown () {
					if (seconds < 1) {
						return location.reload(true);
					}
					resetTimeNode.innerHTML = seconds + " second" + (seconds == 1 ? "" : "s");
					seconds--;
					setTimeout(countdown, 1000);
				}());
			});

		},

		destroy: function() {
			this.show404Handle.remove();
			this.inherited(arguments);
		},

		activateModule: function(/*Object*/ module, /*Object*/ e) {
			// summary:
			//     Helper function to activate a new module.
			// tags:
			//     private
			// module:
			//     The module instance to activate
			// e:
			//     The router event

			var activeModule = this.activeModule,
				setActiveModule;

			// don't reactivate the same module
			if (activeModule === module) {
				module.handleRoute(e);
				return;
			}

			// deactivate the currently active module
			if (activeModule) {
				activeModule.deactivate();
				domClass.remove(win.body(), 'dmActiveModule_' + activeModule.name);
				if (activeModule.domNode) {
					activeModule.domNode.style.display = 'none';
				}
			}
			// activate the new module
			this.activeModule = module;
			this.config.activeModule = module;
			domClass.add(win.body(), 'dmActiveModule_' + module.name);
			topic.publish('/dojo-mama/activateModule', module);
			this.focusModule(module);
			module.activate(e);
		},

		handleRoute: function(/*Object*/ e) {
			// summary:
			//     Route a module; a callback to router.register()
			// tags:
			//     private callback
			// e:
			//     The router event
			console.log('handle route');

			var module,  // the module instance
				moduleConfig,  // the module's config (defined in dmConfig)
				moduleName = e.params.module || 'index',  // the module matched by the route
				moduleId,  // the dojo path to a module (defined in dmConfig)
				route = e.newPath;  // the route's new path (url)

			moduleConfig = this.config.modules[moduleName];
			moduleId = moduleConfig && moduleConfig.moduleId;

			// ignore bad paths
			if (!moduleId) {
				console.warn('Module ID is undefined for route:', route);
				moduleName = '404';
				moduleConfig = this.config.modules[moduleName];
				moduleId = moduleConfig && moduleConfig.moduleId;
			}
			// ignore repeated routes
			if (route === this.lastRoute) {
				console.log('ignoring duplicate route', route);
				return;
			}
			console.log('routing', e.newPath);
			// remember the route
			this.lastRoute = route;

			module = this.modules[moduleName];
			if (module) {
				// if the module has already been created, activate it
				console.log('using cached module', module.name);
				this.activateModule(module, e);
			} else {
				// otherwise, require it
				console.log('instantiating', moduleId);
				topic.publish('/dojo-mama/startLoadingModule', moduleName);
				require([moduleId], lang.hitch(this, function(Module) {
					// extend dmConfig module settings with containerNode and name
					moduleConfig.containerNode = this.config.moduleContentNode;
					moduleConfig.name = moduleName;
					moduleConfig.getMode = this.getMode;
					// create a module instance
					module = new Module(moduleConfig);
					// remember this instance by its moduleId
					this.modules[moduleName] = module;
					// initialize the module
					module.startup();
					topic.publish('/dojo-mama/doneLoadingModule', moduleName);
					// activate the module
					this.activateModule(module, e);
				}));
			}
		},

		show404: function() {
			// summary:
			//    Show the 404 module

			console.log('show 404');

			var module = this.modules['404'];
			if (module) {
				this.activateModule(module);
			}
			else {
				var moduleId = this.config.modules['404'].moduleId;
				require([moduleId], lang.hitch(this, function(Module) {
					module = new Module({
						containerNode: this.config.moduleContentNode,
						getMode: this.getMode,
						name: '404'
					});
					this.modules['404'] = module;
					module.startup();
					this.activateModule(module);
				}));
			}
		}
	});
});
