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
		
		postCreate: function(){
			this.buildMainList();
		},
		
		buildMainList: function(){
			this.mainList = new EdgeToEdgeList({ });
			var responseList = new EdgeToEdgeList({ });
			var responseItem = new ListItem({
				style: "border: none"
			});
			responseList.addChild(responseItem);
			
			var item = new ListItem({
				label: "Restart the amazon instance",
				clickable:true,
				onClick: lang.hitch(this, function(responseItem){
					this.restartAmazon.response = responseItem;
					this.router.go("/RestartAmazon");
				}, responseItem)
			});
			this.mainList.addChild(item);
			var item = new ListItem({
				label: "Restore previous saves",
				clickable:true,
				onClick: lang.hitch(this, function(responseItem){
					this.restoreDB.response = responseItem;
					this.router.go("/RestoreDB");
				}, responseItem)
			});
			this.mainList.addChild(item);

			this.mainList.addChild(responseList);
			this.addChild(this.mainList);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Restore previous saves"} );
			
		}
	})
});