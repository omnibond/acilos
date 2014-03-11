define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		'dojo/_base/kernel',
		"dojo/_base/lang",
		"dojo/DeferredList",
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
		
		'app/util/xhrManager'
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		topic, 
		kernel, 
		lang, 
		DeferredList, 
		
		RoundRectList, 
		ListItem, 
		Button, 
		
		xhrManager
) {
	return declare([ModuleScrollableView], {	
		
		activate: function(){
			window.location = "login.php?logout=true";
		}
	})
});