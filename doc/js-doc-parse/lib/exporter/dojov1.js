define([
	'dojo/string',
	'../Module',
	'../Value',
	'./util',
	'../console',
	'dojo/node!fs',
], function (stringUtil, Module, Value, util, console, fs) {

	/**
	 * Takes information from metadata stored alongside a Value and adds it to the output.
	 * @param node The node to add metadata to.
	 * @param metadata The metadata to parse.
	 */
	function mixinMetadata(/**XmlNode*/ node, /**Object*/ metadata) {
		if (metadata.type) {
			node.attributes.type = metadata.type;
		}

		for (var metadataName in { summary: 1, description: 1 }) {
			if (metadata.hasOwnProperty(metadataName) && metadata[metadataName]) {
				node.createNode(metadataName).childNodes.push(metadata[metadataName]);
			}
		}

		// “deprecated” node is new vs. old php parser
		if (metadata.isDeprecated) {
			node.createNode('deprecated').childNodes.push(metadata.isDeprecated);
		}

		// “experimental” node is new vs. old php parser
		if (metadata.isExperimental) {
			node.createNode('experimental').childNodes.push(metadata.isExperimental);
		}

		if (metadata.examples && metadata.examples.length) {
			var examplesNode = node.createNode('examples');

			for (var i = 0, j = metadata.examples.length; i < j; ++i) {
				examplesNode.createNode('example').childNodes.push(metadata.examples[i]);
			}
		}
	}

	/**
	 * Given metadata with a type annotation, attempt to resolve the annotated type as an object and (hackily) apply
	 * information about the object’s default properties to the metadata description property.
	 */
	function processTypeAnnotation(/**Object*/ metadata) {
		if (!metadata.type || typeof metadata.type === 'string') {
			return;
		}

		var propertyTemplate = '<li>${key}${type}${summary}</li>',
			annotationObject = metadata.type,
			additionalDescription = '';

		if (annotationObject.relatedModule) {
			metadata.type = annotationObject.relatedModule.id;
			return;
		}

		metadata.type = 'Object';
		additionalDescription += '<p>' + (metadata.description ?
					'The following properties are supported:' :
					'An object with the following properties:') + '</p><ul>';

		(function readProperties(object) {
			var propertyMetadata,
				properties = object.properties,
				k;

			// if the annotationObject is a function, we don't want to pick up any properties apart
			// from what's on the prototype.
			if (object.type === 'function') {
				if (_hasOwnProperty.call(properties, 'prototype')) {
					readProperties(properties.prototype);
				}
				return;
			}

			for (k in properties) {
				if (_hasOwnProperty.call(properties, k)) {
					// Type descriptor could be a plain JS object, or could be a constructor. It is often the
					// latter.
					if (k === 'prototype') {
						readProperties(properties[k]);
					}
					// Filter out built-ins and constructor properties which come from dojo/_base/declare
					else if (k !== 'constructor' && properties[k].file) {
						propertyMetadata = properties[k].metadata;
						additionalDescription += stringUtil.substitute(propertyTemplate, {
							key: k,
							type: propertyMetadata.type ? ' (' + propertyMetadata.type + (propertyMetadata.isOptional ? ', optional' : '') + ')' : '',
							summary: propertyMetadata.summary ? ': ' + propertyMetadata.summary : ''
						});
					}
				}
			}
		}(annotationObject));

		metadata.description = (metadata.description || '') + additionalDescription + '</ul>';
	}

	/**
	 * Takes an array of return Values and processes it for return types, discarding all
	 * duplicates, and applies the resulting list of properties to the node given in returnsNode.
	 * @param returnsNode The XML node to add return types to.
	 * @param returns An array of Values to be processed as return values.
	 */
	function processReturns(/**XmlNode*/ returnsNode, /**Array*/ returns) {
		var returnTypes = {};

		for (var i = 0, returnValue; (returnValue = returns[i]); ++i) {
			returnTypes[returnValue.metadata.type || returnValue.type || 'any'] = 1;
		}

		for (var k in returnTypes) {
			if (returnTypes.hasOwnProperty(k)) {
				returnsNode.createNode('return-type', { type: k });
			}
		}
	}

	/**
	 * Processes the parameters and return values for a function property.
	 * @param propertyNode The XML node to add parameters and returns to.
	 * @param property The Value to be processed as a function.
	 */
	function processFunction(/**XmlNode*/ propertyNode, /**Object*/ property) {
		var parametersNode = propertyNode.createNode('parameters'),
			parameterNode,
			parameterType,
			parameter,
			i;

		for (i = 0; (parameter = property.parameters[i]); ++i) {
			if (typeof parameter.metadata.type !== 'string') {
				processTypeAnnotation(parameter.metadata);
			}
			parameterType = parameter.metadata.type || parameter.type || 'unknown';
			parameterNode = parametersNode.createNode('parameter', {
				name: parameter.name,
				type: parameterType,
				usage: parameter.metadata.isOptional ? 'optional' : 'required'
			});

			for (var metadataName in { summary: 1, description: 1 }) {
				if (parameter.metadata.hasOwnProperty(metadataName) && parameter.metadata[metadataName]) {
					parameterNode.createNode(metadataName).childNodes.push(parameter.metadata[metadataName]);
				}
			}
		}

		var returnsNode = propertyNode.createNode('return-types'),
			returnValue;

		processReturns(returnsNode, property.returns);

		for (i = 0; (returnValue = property.returns[i]); ++i) {
			if (returnValue.metadata.summary) {
				propertyNode.createNode('return-description').childNodes.push(returnValue.metadata.summary);
				break;
			}
		}
	}

	/**
	 * Reads a list of Value properties and creates an appropriate XML structure for the data.
	 * @param scope The scope annotation for the output property, either "prototype" or "normal".
	 * @param propertiesNode The XML node to add new property nodes to.
	 * @param properties The properties object.
	 * @param pulledIn Hash of ids of modules that are pulled in by this module
	 */
	function readProperties(/**string*/ scope, /**XmlNode*/ propertiesNode, /**XmlNode*/ methodsNode,
							/**Object*/ properties, /**Object*/ pulledIn) {
		var property,
			propertyNode;

		function makePropertyObject(name, value) {
			if (typeof value.metadata.type !== 'string') {
				processTypeAnnotation(value.metadata);
			}
			var object = {
				name: name,
				scope: scope,
				type: value.metadata.type || value.type || 'unknown',
				// “from” attribute is new vs. old php parser
				from: value.file.moduleId
			};

			if (value.metadata.tags.indexOf('private') > -1) {
				object["private"] = "true";
			}
			if (value.metadata.tags && value.metadata.tags.length) {
				object["tags"] = value.metadata.tags.join(" ");
			}

			if(!pulledIn[value.file.moduleId]){
				// App needs to manually require value.file.moduleId to use this property
				object["extension-module"] = "true";
			}

			return object;
		}

		for (var k in properties) {
			if (k === 'prototype' && _hasOwnProperty.call(properties, k)) {
				if (properties.prototype.properties === properties) {
					throw new Error('BUG: Infinite prototype loop!');
					continue;
				}

				readProperties('prototype', propertiesNode, methodsNode, properties[k].properties, pulledIn);
			}
			else if (_hasOwnProperty.call(properties, k)) {
				property = properties[k];

				// Filter out built-ins (Object.prototype, etc.)
				if (!property.file) {
					continue;
				}

				// TODO: special handling for constructors (type === "constructor"), which get their own <object> nodes
				// and hence their own pages
				if (property.type in Value.METHOD_TYPES) {
					propertyNode = methodsNode.createNode('method', makePropertyObject(k, property));
					processFunction(propertyNode, property);
				}
				else {
					propertyNode = propertiesNode.createNode('property', makePropertyObject(k, property));
				}

				mixinMetadata(propertyNode, property.metadata);
			}
		}
	}

	var _hasOwnProperty = Object.prototype.hasOwnProperty,
		XmlNode = util.XmlNode;

	/**
	 * Calculate all the modules guaranteed available if the specified module is loaded.
	 * @param file
	 */
	function computedPulledIn(/**string*/ id, /**Module[]*/ parsedModules, /*Object*/ hash)
	{
		hash = hash || {};
		hash[id] = true;
		parsedModules[id].dependencies.forEach(function(dependency){
			if(!hash[dependency.id]){
				computedPulledIn(dependency.id, parsedModules, hash);
			}
		});
		return hash;
	}

	/**
	 * Generates a details.xml-compatible file which is used by the API browser.
	 */
	function generateDetails(file){
		var fd = fs.openSync(file, 'w', parseInt('0644', 8));

		// “version” attribute is new vs. old php parser
		// TODO: Calling fs.writeSync(fd) feels wrong. Is there no fd.writeSync?
		fs.writeSync(fd, '<javascript version="1">', null);

		/**
		 * Parses a code module, or a class within a module, into an XmlNode.
		 */
		function parseObject(value, id, pulledIn){
			var moduleNode = new XmlNode('object', { location: id }),
				propertiesNode = moduleNode.createNode('properties'),
				methodsNode = moduleNode.createNode('methods');

			if (value.type) {
				moduleNode.attributes.type = value.type;
			}

			// Once upon a time, the parser was an instance of an anonymous function;
			// this pattern might be reproduced elsewhere, so it is handled here
			if (value.type === Value.TYPE_INSTANCE && !value.value.relatedModule) {
				value = value.value;
			}

			if (value.metadata.classlike) {
				moduleNode.attributes.classlike = 'true';

				if (value.mixins.length) {
					moduleNode.attributes.superclass = value.mixins[0].id;

					var mixinsNode = moduleNode.createNode('mixins'),
						mixin;
					for (var i = 0; (mixin = value.mixins[i]); ++i) {
						mixinsNode.createNode('mixin', { location: mixin.id });
					}
				}

				var prototype = value;
				while ((prototype = prototype.getProperty('prototype')) && prototype.type !== Value.TYPE_UNDEFINED) {
					if (prototype.getProperty('constructor')) {
						processFunction(moduleNode, prototype.getProperty('constructor'));
						break;
					}
				}
			}
			else if (value.type in Value.METHOD_TYPES) {
				processFunction(moduleNode, value);
			}

			mixinMetadata(moduleNode, value.metadata);

			// dojo/_base/declare’d objects using dojodoc end up with their standard metadata on the prototype object
			// instead of on the value itself
			if (value.metadata.classlike) {
				mixinMetadata(moduleNode, value.getProperty('prototype').metadata);
			}

			readProperties('normal', propertiesNode, methodsNode, value.properties, pulledIn);

			return moduleNode;
		}

		var parsedModules = Module.getAll();

		for (var k in parsedModules) {
			if (parsedModules.hasOwnProperty(k)) {
				console.status('Exporting', k);

				var module = parsedModules[k];
				var pulledIn = computedPulledIn(k, parsedModules);

				fs.writeSync(fd, parseObject(module.value, module.id, pulledIn).toString(), null);

				// If the module contains nested classes (ex: dijit/Tree.TreeNode) or objects,
				// output them as though they were separate modules
				var properties = module.value.properties;
				for(var c in properties){
					if (_hasOwnProperty.call(properties, c)) {
						var property = properties[c];

						// List nested classes or nested objects as separate page.
						if (c !== "prototype" && (property.type === "constructor" || property.type === "object")) {
							fs.writeSync(fd, parseObject(property, k + "." + c, pulledIn).toString(), null);
							property._separatePage = true;
						}
					}
				}
			}
		}

		fs.writeSync(fd, '</javascript>', null);
		fs.closeSync(fd);

		console.status('Output written to', file);
	}

	/**
	 * Generates a tree.json file which lists all the objects output by generateDetails(), in a tree format.
	 */
	function generateTree(jsonFile, htmlFile){
		// Get hash and also array of modules.
		var moduleHash = Module.getAll(), moduleArray = [];
		for(var k in moduleHash){
			if (moduleHash.hasOwnProperty(k)) {
				moduleArray.push(k);
			}
		}

		// Sort list of modules so Tree will show them alphabetically.
		moduleArray.sort(function(a, b)
		{
			a = a.toLowerCase();
			b = b.toLowerCase();
			if(a > b)
				return 1;
			if(a < b)
				return -1;
			return 0;
		});

		// Generate hierarchy of objects, which looks like the directory structure holding the source files,
		// but with each module possibly having some children corresponding to the nested classes in that module.
		// Note that sometimes a module and a folder can have the same name (ex: dojo/date.js and dojo/date).
		// In that case the module will come first.
		var hierarchy = {
			id: "root",
			type: "folder",
			children: []
		};
		moduleArray.forEach(function(k) {
			// Generate node for this module, and any missing folder nodes
			var parent = hierarchy,
				parts = k.split("/");
			parts.forEach(function(part, idx){
				if(idx+1 < parts.length){
					// Create folder node if it doesn't exist.   (If it does exist, it will be the last child of the
					// parent, since we are going in alphabetical order.)
					var id = parts.slice(0, idx+1).join("/"),
						lastChild = parent.children.length && parent.children[parent.children.length-1];
					if(!lastChild || lastChild.fullname != id || lastChild.type != "folder"){
						parent.children.push(lastChild = {
							id: id + "/",		// differentiate modules, ex: dojo/date.js, from dirs, ex: dojo/date/
							name: part,
							fullname: id,
							type: "folder",
							children: []
						});
					}
					parent = lastChild;
				}else{
					// Node for the module itself.
					var child = {
						id: k,
						name: part,
						fullname: k,
						type: moduleHash[k].value._type
					};

					// See if the module has any nested objects, if so, they will be listed as children of the module.
					var children = [],
						module = moduleHash[k],
						properties = module.value.properties;
					for(var c in properties){
						if (properties.hasOwnProperty(c)) {
							var property = properties[c];
							if (property._separatePage) {
								children.push({
									id: k + "." + c,
									name: c,
									fullname: k + "." + c,
									type: property.type,
									children: []
								});
							}
						}
					}
					if(children.length){
						children.sort(function(a, b){
							a = a.id.toLowerCase();
							b = b.id.toLowerCase();
							if(a > b)
								return 1;
							if(a < b)
								return -1;
							return 0;
						});
						child.children = children;
					}

					parent.children.push(child)
				}
			});
		});

		// Output JSON representation of tree
		var fd = fs.openSync(jsonFile, 'w', parseInt('0644', 8));
		fs.writeSync(fd, JSON.stringify(hierarchy, null, "\t"), null);
		fs.closeSync(fd);
		console.status('Output written to', jsonFile);

		// Output HTML representation of tree
		function ul(obj, indent){
			return indent + "<ul>\n" +
			obj.children.map(function(child){
				return  indent + "\t<li>" +
					(child.type == "folder" ? child.name :
					"<a href='" + child.fullname.replace(".", "#") + "'>" + child.name + "</a>") +
					(child.children ? ul(child, indent + "\t") : "") +
					"</li>";
			}).join("\n") +
			"</ul>\n";
		}
		var fd = fs.openSync(htmlFile, 'w', parseInt('0644', 8));
		fs.writeSync(fd, ul(hierarchy, ""), null);
		fs.closeSync(fd);
		console.status('Output written to', htmlFile);
	}

	return function (config) {
		if (!config.details || !config.tree) {
			throw new Error('A config.details and config.tree value must be provided for the dojov1 exporter.');
		}
		generateDetails(config.details);
		generateTree(config.tree, config.htmlTree);
	};
});