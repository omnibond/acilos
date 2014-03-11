define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/topic'
], function(declare, kernel, topic) {
	return declare([], {
		startup: function() {
			if (kernel.global.ga) {
				var track = this.track;
				console.log('Google Analytics enabled');
				track('send', 'pageview');
				topic.subscribe('/dojo-mama/analytics', track);
				topic.subscribe('/dojo-mama/activateModule', function(module) {
					track('send', 'event', 'activateModule', module.name);
				});
			}
		},
		track: function() {
			var ga = kernel.global.ga;
			if (ga) {
				console.log('Analytics:', arguments);
				ga.apply(this, arguments);
			} else {
				console.warn('Google Analytics object is undefined.');
			}
		}
	});
});
