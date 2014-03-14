/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
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
/****************************************************************************
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems: www.omnibond.com for Acilos.com
**
** OpenClemson Dojo-Mama framework: https://github.com/OpenClemson/dojo-mama
** Copyright (C) 2014 Clemson University and/or its subsidiary(-ies).
** All rights reserved.
** Clemson University - www.clemson.edu
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
** If you have questions regarding the use of this file, please contact
** Omnibond Systems - www.omnibond.com
** Clemson University - www.clemson.edu
**
** $QT_END_LICENSE$
*/
define(['dojo/_base/declare',
		'dojo/dom-class',
		'dojo/topic',
		'dojox/mobile/Pane',
		'dojo-mama/util/toaster'
], function(declare, domClass, topic, Pane, toaster) {

	// module:
	//     dojo-mama/views/ModuleViewBase

	return declare([], {
		// summary:
		//     A base module view

		// active: Boolean
		//     Represents the state of this view
		active: false,
		// route: String
		//     The route to match to show this view
		route: null,
		// router: Object
		//     A module-relative dojo/router provided by dojo-mama/Module upon view registration
		router: null,
		// title: String
		//     A title shown in the sub nav. If undefined, dojo-mama/Module uses
		//     the module's title when a view is shown. To explicitly avoid setting the title
		//     when a view loads, set the view's title to `null`.
		title: undefined,

		buildRendering: function() {
			this.inherited(arguments);
			domClass.add(this.domNode, ['dmModuleView']);
			this.domNode.style.display = 'none';
		},

		postCreate: function() {
			// summary:
			//     Override postCreate with your module's content
			// tags:
			//     extension
			this.inherited(arguments);
			if (this.route === null) {
				console.error('Module route not defined');
				return;
			}
		},

		activate: function(/*Object*/ e) {
			// summary:
			//     Called when a view is shown, settings this.active to true
			// e:
			//     The dojo/router event

			this.set('active', true);
			topic.publish('/dojo-mama/analytics',
					'send', 'event', 'activateView',
					e.newPath);
			topic.publish('/dojo-mama/analytics',
					'send', 'event', 'activateViewRoute',
					this.module.getAbsoluteRoute(this.route));
		},

		deactivate: function() {
			// summary:
			//     Called when a view is hidden, settings this.active to false
			this.set('active', false);
			toaster.clearMessages();
		}

	});
});
