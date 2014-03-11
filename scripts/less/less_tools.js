/*global exports,process*/
exports.applyLess = function(file, outputFile){
	var fs = require("fs");
	var path = require("path");
	var less = require("less");

	console.log("compiling:", file);

	var parser = new(less.Parser)({paths: [path.dirname(file)], filename: file, optimization: 1});
	var lessContent = fs.readFileSync(file, "utf-8");

	parser.parse(lessContent, function(error, tree){
		if(error){
			less.writeError(error);
			process.exit(1);
		}
		var fd = fs.openSync(outputFile, "w");

		fs.write(fd, tree.toCSS({compress: false}).replace(/\n/g, "\r\n"), 0,   "utf-8", function(f){
			fs.close(fd);
			console.log("writing:", outputFile);
		});
	});
};

exports.watchLess = function(root, cb, ignoreDirs) {
	var watch = require('./watch'),
		options = {
			interval: 500,
			filter: function(f) {
				return f.slice(-5) !== '.less';
			},
			directoryFilter: function(f) {
				var i, ignores = ignoreDirs || [], ignore;
				for (i=0; i < ignores.length; i++) {
					ignore = ignores[i];
					if (f === ignore) {
						return true;
					}
				}
				return false;
			},
			ignoreDotFiles: true
		};
	var callback = function(f, curr, prev) {
		var fn;
		if (typeof f == "object" && prev === null && curr === null) {
			// Finished walking the tree
			console.log('Watching less');
			// for (fn in f) { console.log(fn); }
		} else {
			for (fn in f) {
				if (f.hasOwnProperty(fn)) {
					if (f.slice(-5) === '.less') {
						cb();
						return;
					}
				}
			}
		}
	};
	console.log('Processing...');
	watch.watchTree(root, options, callback); 
};
