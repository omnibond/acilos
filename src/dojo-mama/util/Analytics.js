/*
dojo-mama: a JavaScript framework
Copyright (C) 2014 Clemson University

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/
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
