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
        'dojo/sniff',
        'dojox/mobile/Container',
        'dojox/mobile/ScrollableView'],
function(declare, has, Container, ScrollableView) {

	// module:
	//     dojo-mama/views/ScrollableView

	var dependency, style='';

	// use ScrollableView for iPhone
	if (has('iphone')) {
		dependency = ScrollableView;
	} else {
	// otherwise use native scrolling and overflow-y auto
		dependency = Container;
		style = 'overflow-y: auto';
	}
	return declare([dependency], {
		// summary:
		//     A scrollable view. On iPhone, returns a 
		//     dojox/mobile/ScrollableView. Otherwise, returns a
		//     dojox/mobile/Container with overflow-y auto.
		style: style
	});
});

