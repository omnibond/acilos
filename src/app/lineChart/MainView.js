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
				label: "Generate a Line Chart with User Data",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/selectUsersView");
				})	
			})

			this.serviceItem = new ListItem({
				label: "Generate a Line Chart with Service Data",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/serviceLineChartView");
				})	
			})

			this.addChild(this.userItem);
			this.addChild(this.serviceItem);
		},

		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/analytics', title: "Generate a Line Chart"} );	

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
