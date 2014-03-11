define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/dom-geometry',
		"dojo/on",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		'app/TitleBar',
		"app/SelectorBar",
		
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
	domGeom,
	on,
	kernel, 
	
	xhrManager, 
	TitleBar, 
	SelectorBar,
	
	ScrollableView,
	RoundRectList, 
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton,
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		
		constructor: function(){
			this.fromVar = 0;
		},
		
		buildFeedList: function(feedObj){
			kernel.global.feedCount[this.id] = {};
			kernel.global.feedCount[this.id].count = 0;
			kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
				
			console.log(feedObj);
			
			if(feedObj['error']){
				console.log(feedObj['error']);
				return;
			}
			
			if(this.list){
				this.list.destroyRecursive();
			}
			
			this.list = new SearchScroller({
				feedName: feedObj,
				getFeedData: lang.hitch(this, this.checkSpecificFeedList),
				getNextGroup: lang.hitch(this, this.getNextGroup),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				fromVar: this.fromVar,
				FeedViewID: this.id,
				view: this
			});			
			this.addChild(this.list);
			this.resize();

			this.scrollButton = new Button({
				"name": "scrollButton",
				onClick: lang.hitch(this, function(){
					var scroller = lang.hitch(this, function(){
						if(this.domNode.scrollTop <= 0){
							this.domNode.scrollTop = 0;
						}else{
							this.domNode.scrollTop = this.domNode.scrollTop - (this.domNode.scrollTop*.08);
							if(this.domNode.scrollTop != 0){
								setTimeout(scroller, 20);
							}
						}
					});
					setTimeout(scroller, 20);
				})
			});

			this.selectorItem = new SelectorBar({
				buttons: [this.scrollButton]
			})				
			this.selectorItem.placeAt(this.domNode.parentNode);
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);

			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			this.list.postAddToList(this.fromVar+=20);
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: e.params.feedName} );
			
			this.getSpecificFeedList(e.params.feedName).then(lang.hitch(this, this.buildFeedList));
			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
			
		},

		deactivate: function(){
			this.selectorItem.destroyRecursive();
			this.selectorItem = null;
		}
		
	})
});