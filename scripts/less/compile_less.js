/*global process*/
var lessTools = require('./less_tools'),
	root = '../src',
	targets = {
		// less target: css output
		'../src/app/resources/less/app.less': '../src/app/resources/css/app.css',
	},
	ignoreDirs = [
		'../src/dojox',
		'../src/dojo',
		'../src/dijit',
		'../src/util',
		'../src/broker',
		'../src/vendor',
		'../src/feed'
	],
	run = function() {
		var target;
		for (target in targets) {
			if (targets.hasOwnProperty(target)) {
				lessTools.applyLess(target, targets[target]);
			}
		}
	},
	args = process.argv;

process.on('uncaughtException', function (exception) {
	console.log('Exception:');
	var key;
	for (key in exception) {
		if (exception.hasOwnProperty(key)) {
			console.log('  ' + key + ':', exception[key]);
		}
	}
});

if (args[2] === 'watch') {
	lessTools.watchLess(root, run, ignoreDirs);
}
run();
