/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the appModuleGroup which extends the dojo-mama framework to allow for more attributes
** 
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/
define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo-mama/Module',
		'app/AppModuleListView'
], function(declare, kernel, lang, Module, ModuleListView) {
	return declare([Module], {

		config: null,

		constructor: function() {
			this.config = kernel.global.dmConfig;
		},

		postCreate: function() {
			// summary:
			//    A module containing a list of other modules

			this.inherited(arguments);
			var i, moduleName, modules = {};

			for (i=0; i < this.modules.length; ++i) {
				moduleName = this.modules[i];
				modules[moduleName] = {
					route: this.config.baseRoute + moduleName,
					label: this.config.modules[moduleName].title,
					icon: this.config.modules[moduleName].icon
				};
			}
			this.rootView = new ModuleListView({
				module: this,
				modules: modules,
				route: '/'
			});
			this.registerView(this.rootView);
		}

	});
});
