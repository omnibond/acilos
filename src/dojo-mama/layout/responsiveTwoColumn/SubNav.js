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
		'dojo/_base/kernel',
		'dojo/_base/lang',
		'dojo/dom-attr',
		'dojo/dom-class',
		'dojo/dom-construct',
		'dojo/dom-style',
		'dojo/has',
		'dojo/on',
		'dojo/router',
		'dojo/topic',
		'dojox/gesture/swipe',
		'dojox/mobile/Pane'
], function(declare, kernel, lang, domAttr, domClass, domConstruct, domStyle, has, on, router, topic, swipe, Pane) {

	// module:
	//     dojo-mama/layout/responsiveTwoColumn/SubNav

	return declare([Pane], {
		// summary:
		//     The sub navigation module

		// backButtonNode: [private] Object
		//     The node containing the mobile view's back button
		backButtonNode: null,
		baseClass: 'dmSubNav',
		// config: [private] Object
		//     The dmConfig object
		config: null,
		// fullscreenButtonNode: [private] Object
		//     The node for the button to toggle fullscreen
		fullscreenButtonNode: null,
		// fullscreenClickHandle: [private] Object
		//     The dojo/on handle to the fullscreenButton's click handler
		fullscreenClickHandle: null,
		// swipeHandle: [private] Object
		//     The dojo/on handle to the swipe handler
		swipeHandle: null,
		// titleNode: [private] Object
		//     The module's title node
		titleNode: null,

		constructor: function() {
			this.config = kernel.global.dmConfig;
		},

		buildRendering: function() {
			// summary:
			//     Build out the sub navigation elements
			this.inherited(arguments);

			if (has('touch')) {
				this.swipeHandle = on(this.domNode, swipe.end, lang.hitch(this, function(e) {
					console.log('subnav swipe');
					console.log(e);
					if (e.dx >= 100) {
						router.go('/');
					}
				}));
			}

			/* back button */
			this.backButtonNode = domConstruct.create('a', {
				'class': 'dmSubNavBackButton',
				href: '#' + this.config.baseRoute,
				innerHTML: '<div></div>'
			}, this.domNode);
			domStyle.set(this.backButtonNode, 'text-decoration', 'none');
			/* title (desktop) */
			this.titleNode = domConstruct.create('span', {
				'class': 'dmSubNavTitle'
			}, this.domNode);

			this.fullscreenButtonNode = domConstruct.create('button', {
				'class': 'dmFullscreenButton hidden_phone',
				role: 'button',
				tabindex: 0,
				title: 'Toggle fullscreen'
			}, this.domNode);

			this.fullscreenClickHandle = on(this.fullscreenButtonNode, 'click', lang.hitch(this, function() {
				var html = document.getElementsByTagName('html')[0],
					view = this.config.activeModule && this.config.activeModule.currentView;
				domClass.toggle(html, 'fullscreen_mode');
				if (view) {
					view.resize();
				}
			}));

			// ARIA
			domAttr.set(this.titleNode, 'role', 'heading');
			domAttr.set(this.titleNode, 'aria-live', 'polite');
			domAttr.set(this.titleNode, 'tabindex', 0);
			domAttr.set(this.backButtonNode, 'role', 'button');
			domAttr.set(this.backButtonNode, 'tabindex', 0);
			domAttr.set(this.backButtonNode, 'title', 'Back');
		},

		startup: function() {
			this.inherited(arguments);
			/* subscribe to topics */
			topic.subscribe('/dojo-mama/updateSubNav', lang.hitch(this, this.updateSubNav));
		},

		destroy: function() {
			this.fullscreenClickHandle.remove();
			if (this.swipeHandle) {
				this.swipeHandle.remove();
			}
			this.inherited(arguments);
		},

		updateSubNav: function(args) {
			// summary:
			//    Updates the sub nav functionality
			// description:
			//    Updates the sub nav
			// args: Object
			//    Args is an object containing parameters for the sub nav:
			//
			//    - back: a string containing the back button route
			//    - title: a string containing the title of the current view
			//
			//    Each key is optional.

			var back = args.back,
				title = args.title;

			// update subnav title
			if (title !== undefined && title !== null) {
				this.titleNode.innerHTML = title;
			}
			// update back button route
			if (back) {
				this.backButtonNode.href = '#' + back;
			}

		}

	});
});
