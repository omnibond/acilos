/**
 * This file is used to reconfigure parts of the loader at runtime for this application.
 */
require({
	baseUrl: '',
	packages: [
		'dojo',
		'dijit',
		'dojox',
		'dojo-mama',
		'app'
	]
// Require `app`. This loads the main application module, `app/main`, since we registered the `app` package above.
}, ['app']);
