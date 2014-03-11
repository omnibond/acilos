define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/on',
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/TitleBar',
		
		"dojox/mobile/EdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/Heading"
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		topic, 
		lang, 
		on,
		domGeom,
		
		xhrManager, 
		TitleBar, 
		
		EdgeToEdgeList, 
		Button, 
		ListItem, 
		ToolBarButton, 
		EdgeToEdgeCategory,
		Heading
) {
	return declare([ModuleScrollableView], {
		
		buildList: function(){
			if(this.list){
				this.list.destroyRecursive();
				this.list = null;
			}
			
			this.list = new EdgeToEdgeList({
				style: "border:none"
			})
			var item = new ListItem({
				variableHeight: true,
				style: "border:none"
			});
			
			var resetButton = new Button({
				label: "Nuke From Orbit!",
				onClick: lang.hitch(this, function(){
					this.appFactoryReset().then(function(){
						window.location = "login.php?logout=true";
					})
				})
			});
			item.addChild(resetButton);
			
			this.list.addChild(item);
			this.addChild(this.list);
		},
		
		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/help', title: "Reset the app to factory defaults"} );	
			
			this.buildList();
		}
	})
});
