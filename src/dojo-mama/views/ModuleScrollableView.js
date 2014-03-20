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
		'dojo-mama/util/ScrollablePane',
		'dijit/_Container'
], function(declare, ModuleViewMixin, ScrollablePane, Container) {

	// module:
	//     dojo-mama/views/ModuleScrollableView

	return declare([ScrollablePane, Container, ModuleViewMixin], {
		// summary:
		//     A scrollable module view
	});

});
