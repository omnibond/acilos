define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		"dojo/on",
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/SelectorBar',
		'app/TitleBar',
		
		"dojox/mobile/EdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
], function(
	declare, 
	ModuleScrollableView, 
	domConstruct, 
	topic, 
	lang,
	on,
	domGeom,

	xhrManager, 
	SelectorBar, 
	TitleBar, 
	
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton, 
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Restore previous saves"} );
			this.rebootAmazonInstance().then(lang.hitch(this, function(obj){
				console.log("getInstances returned: ", obj);
			}));
			
			var item = new ListItem({
				label: "Instance is currently restarting, give it just a moment"
			});
			this.addChild(item);
				
		}
	})
});