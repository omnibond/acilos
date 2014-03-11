define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/on',
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/TitleBar',
		
		"dojox/mobile/RoundRectList",
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
		
		RoundRectList, 
		Button, 
		ListItem, 
		ToolBarButton, 
		EdgeToEdgeCategory,
		Heading
) {
	return declare([ModuleScrollableView], {				
		buildList: function(){

			this.userItem = new ListItem({
				label: "Graph by User",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/userList");
				})	
			})

			this.serviceItem = new ListItem({
				label: "Graph by Service",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/serviceGraph");
				})	
			})

			this.addChild(this.userItem);
			this.addChild(this.serviceItem);
		},

		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/analytics', title: "Generate a Bar Graph"} );	

			if(this.userItem){
				this.userItem.destroyRecursive();
				this.userItem = null;
			}
			if(this.serviceItem){
				this.serviceItem.destroyRecursive();
				this.serviceItem = null;
			}

			this.buildList();
		}
	})
});
