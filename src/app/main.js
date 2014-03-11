/**
 * This file is the application's main JavaScript file. It is listed as a dependency in run.js and will automatically
 * load when run.js loads.
 *
 * Because this file has the special filename `main.js`, and because we've registered the `app` package in run.js,
 * whatever object this module returns can be loaded by other files simply by requiring `app` (instead of `app/main`).
 *
 */
/*global AndroidWrapper*/
define(['require'], function (require) {
	require([
		'dojo-mama/layout/responsiveTwoColumn/Layout',
		'app/dmConfig',
		'dojo/dom-class',
		'dojo/_base/kernel',
		'dojo/has',
		'dojo/ready',
		'dojox/mobile/ProgressIndicator',
		"dojo/dom-construct",
	
		'app/util/credentialUtil',
		'app/util/notificationUtil',
		'app/util/cookieChecker'
	
	
	],
	function (
		Layout,
		dmConfig,
		domClass,
		kernel,
		has,
		ready,
		ProgressIndicator,
		domConstruct,
		
		credentialUtil,
		notificationUtil,
		cookieChecker
	) {
		ready(function() {

			if (!has('touch')) {
				domClass.add(document.getElementsByTagName('html')[0], 'no_touch');
			}

			var layout = new Layout({config: dmConfig}),
				layoutReady = layout.startup(),
				pi = new ProgressIndicator();

			pi.placeAt(document.body);
			pi.start();
			
			layoutReady.then(function() {
				// render cufon fonts for Winblows Mobile
				//domUtils.cufonify();

				// stop the progress indicator
				pi.stop();

				var wrapperDiv = domConstruct.create("div", {});
				document.body.appendChild(wrapperDiv);
				domConstruct.place(document.getElementById('adSlot'), wrapperDiv);
				domClass.add(wrapperDiv, "adPositionClass");
				domClass.add(adSlot, "adDivClass");
				console.log("adSlot is: ", adSlot);
				
				kernel.global.notifications = {};
				credentialUtil.makeItHappen();
				notificationUtil.makeItHappen();
				cookieChecker.makeItHappen();
			});
		});
	});
});
