/*jshint node:true */
if (typeof process !== 'undefined' && typeof define === 'undefined') {
	(function () {
		var pathUtil = require('path');
		global.dojoConfig = {
			async: true,
			deps: [ 'js-doc-parse/parse' ],
			packages: [
				{ name: 'dojo', location: pathUtil.join(__dirname, 'dojo') },
				{ name: 'js-doc-parse', location: __dirname }
			]
		};

		require('./dojo/dojo.js');
	})();
}
else {
	define([
		'./lib/env',
		'./lib/File',
		'./lib/Module',
		'./lib/node!fs',
		'./lib/node!util',
		'./lib/node!path',
		'./lib/console',
		'./lib/esprimaParser'
	], function (env, File, Module, fs, util, pathUtil, console) {
		env.ready(function () {
			console.status('Processing scripts…');

			var packagePaths = (function () {
				var paths = [],
					packages = env.config.packages;

				for (var k in packages) {
					paths.push(packages[k]);
				}

				return paths;
			})();

			packagePaths.forEach(function processPath(parent, path) {
				path = pathUtil.join(parent, path);
				var stats;

				try {
					stats = fs.statSync(path);
				}
				catch (error) {
					console.error(error);
					return;
				}

				if (stats.isDirectory()) {
					fs.readdirSync(path).sort().forEach(processPath.bind(this, path));
				}
				else if (stats.isFile() && /\.js$/.test(path)) {
					// TODO: This whole thing revolves around Modules because that's what an AMD system uses, but we really
					// ought to isolate modules to the AMD callHandler so this tool can be used as an even more general
					// documentation parser.

					// Skip excluded paths
					if (env.config.excludePaths.some(function (exclude) {
						return typeof exclude === 'string' ?
							path.indexOf(exclude) === 0 :
							exclude.test(path);
					})) {
						return;
					}

					Module.getByFile(new File(fs.realpathSync(path)));
				}
			}.bind(this, env.config.basePath));

			console.status('Exporting results…');

			env.exporters.forEach(function (exporter) {
				exporter.run(exporter.config);
			});

			console.status('Done!');
		});
	});
}