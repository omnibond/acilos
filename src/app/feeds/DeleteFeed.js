define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/dom-class',
		
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
	domClass,
	
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
						icon: "app/resources/img/minus_icon_small.png",
						clickable: true,
						onClick: lang.hitch(this, function(obj, x){
							this.deleteFeedList(obj[x].name).then(lang.hitch(this, function(){
								this.router.go("/");
							}))
						}, obj, x)
					});	
					//var divDelete = domConstruct.create("span", {innerHTML: "<img src=app/resources/img/minus_icon_small.png>", title: "Delete a Feed"});
					//var divLabel = domConstruct.create("span", {innerHTML: obj[x].name,});
					
					//item.domNode.appendChild(divDelete);
					//item.domNode.appendChild(divLabel);
					//domClass.add(divDelete, "selectorButton");
					this.mainList.addChild(item);	
				}
			}
			this.addChild(this.mainList);
			
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: "Select a feed to delete"} );
				
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.getFeedList().then(lang.hitch(this, this.buildMainList));
			}else{
				this.getFeedList().then(lang.hitch(this, this.buildMainList));
			}
			
		}
		
	})
});