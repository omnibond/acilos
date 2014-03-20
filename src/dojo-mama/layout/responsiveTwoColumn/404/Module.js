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
		'dojo/_base/lang',
		'dojo/dom-construct',
		'dojo-mama/Module',
		'dojo-mama/views/ModuleView'
], function(declare, lang, domConstruct, Module, ModuleView) {
	return declare([Module], {
		'class': '404Module',
		postCreate: function() {
			// summary:
			//     Create the module views
			this.inherited(arguments);

			this.rootView = new ModuleView({
				route: '/',
				title: '404'
			});
			this.registerView(this.rootView);

			domConstruct.create('h1', {
				innerHTML: 'Page does not exist'
			}, this.rootView.domNode);

		},

		// Override handle route to prevent this module's router from changing the URL, since
		// we want the bad URL to be associated with the error message.
		handleRoute: function() {
			// route to 404 with an empty router event
			this.routeView(this.rootView, lang.hitch(this.rootView, this.rootView.activate), {});
		}
	});
});
