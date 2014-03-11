define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		
		'app/util/xhrManager',
		'app/TitleBar',
		'app/SearchScroller',
		
		"dojox/mobile/ScrollableView",
		"dojox/mobile/RoundRectList",
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
	
	xhrManager, 
	TitleBar, 
	SearchScroller,
	
	ScrollableView,
	RoundRectList, 
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton,
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		
		buildMainList: function(obj){
			console.log("buildMainList: ", obj);
			
			this.mainList = new EdgeToEdgeList({
				
			});
			if(obj == null || obj.length == 0){
				var item = new ListItem({
					label: "No feeds have been saved yet"
				});	
				this.mainList.addChild(item);	
			}else{
				for(var x = 0; x < obj.length; x++){
					var item = new ListItem({
						label: obj[x].name,
						icon: "app/resources/img/edit_icon_small.png",
						clickable: true,
						onClick: lang.hitch(this, function(obj, x){
							console.log("console: ", obj);
							this.router.go("/EditFeedView/" + obj[x].name);		
						}, obj, x)
					});	

					this.mainList.addChild(item);	
				}
			}
			this.addChild(this.mainList);
			
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: "Select a feed to edit"} );
				
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.getFeedList().then(lang.hitch(this, this.buildMainList));
			}else{
				this.getFeedList().then(lang.hitch(this, this.buildMainList));
			}
			
		}
		
	})
});
