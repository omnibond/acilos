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
		'dojo-mama/views/_ModuleViewMixin',
		'dojox/mobile/Pane',
		'dijit/_Container'
], function(declare, ModuleViewMixin, Pane, Container) {

	// module:
	//     dojo-mama/views/ModuleView

	return declare([Pane, Container, ModuleViewMixin], {
		// summary:
		//     A base module view
		baseClass: ''
	});
});
