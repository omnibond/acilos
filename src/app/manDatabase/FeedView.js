define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/_base/kernel',
		'dojo/dom-construct',
		'dojo/dom-class',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/dom-geometry',
		"dojo/on",
		
		'app/util/xhrManager',
		'app/TitleBar',
		'app/ServiceSelector',
		'app/PruneScroller',
		
		"dojox/mobile/ScrollableView",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/EdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/TextBox",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/ValuePickerDatePicker",
		"dijit/Calendar",
		"dijit/_FocusMixin"
		//"dojox/mobile/deviceTheme"
], function(
	declare, 
	ModuleScrollableView, 
	kernel,
	domConstruct, 
	domClass, 
	topic, 
	lang,
	domGeom,
	on,
	
	xhrManager, 
	TitleBar, 
	ServiceSelector,
	PruneScroller,
	
	ScrollableView,
	RoundRectList, 
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	TextBox, 
	ToolBarButton,
	EdgeToEdgeCategory,
	DatePicker,
	Calendar,
	FocusMixin
	//deviceTheme
) {
	return declare([ModuleScrollableView], {				
		constructor: function(){
			this.fromVar = 0;
		},
		
		buildExampleFeed: function(feedObj){
			console.log(feedObj);
			
			if(this.list){
				this.list.destroyRecursive();
			}
			
			this.list = new PruneScroller({
				"class": "feedScrollerRoundRectClassNoMarg",
				feedName: feedObj,
				getFeedData: lang.hitch(this, this.checkSpecificFeedList),
				getNextGroup: lang.hitch(this, this.getNextGroup),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				deleteItem: lang.hitch(this, this.deleteItem),
				deleteAll: lang.hitch(this, this.deleteAll),
				fromVar: this.fromVar,
				FeedViewID: this.id,
				view: this
			});			
			this.addChild(this.list);
			this.resize();
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
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Delete app items"} );
			
			kernel.global.feedCount[this.id] = {};
			kernel.global.feedCount[this.id].count = 0;
			kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};

			this.buildExampleFeed(this.object);
			
			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
			
		}	
	})
});
