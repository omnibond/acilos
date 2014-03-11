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

