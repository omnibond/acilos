define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/_base/kernel',
		"dojo/on",
		"dojo/dom-style",
		"dojo/dom-geometry",
		
		'app/util/xhrManager',
		"app/SearchScroller",
		"app/SelectorBar",
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/RadioButton",
		"dojox/mobile/Button"
], function(
	declare,
	ModuleScrollableView,
	domConstruct,
	topic,
	lang,
	kernel,
	on,
	domStyle,
	domGeom,
	
	xhrManager,
	SearchScroller,
	SelectorBar,
	
	RoundRectList,
	ListItem,
	ToolBarButton,
	EdgeToEdgeCategory,
	RadioButton,
	Button
) {
	return declare([ModuleScrollableView], {		
		postCreate: function(){
			
		},
		
		buildList: function(idArray){
			this.myColorClass = "dmNavBackgroundColor_people";

			console.log("idArray", idArray);
			
			
			this.scrollButton = new Button({
				label: "Top",
				"class": this.myColorClass,
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
			this.manualRefreshBut = new Button({
				label: "Refresh",
				"class": this.myColorClass,
				onClick: lang.hitch(this, function(){
					this.manualRefresh(kernel.global.feedCount[this.id].services).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);

						if(this.list && obj){
							this.list.destroyRecursive();
							this.buildFeedList();
							this.loading = false;
						}
					}))
				})
			});

			this.selectorItem = new SelectorBar({
				buttons: [this.scrollButton, this.manualRefreshBut]
			})
			this.selectorItem.placeAt(this.domNode.parentNode);
			
			var searchStr = '';
			for(y = 0; y < idArray.length; y++){
				if(y == idArray.length -1){
					searchStr += idArray[y];
				}else{
					searchStr += idArray[y] + "+";
				}
			}
			this.list = new SearchScroller({
				feedName: searchStr,
				getFeedData: lang.hitch(this, this.searchUser),
				getNextGroup: lang.hitch(this, this.getNextGroup),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				fromVar: this.fromVar,
				FeedViewID: this.id,
				view: this
			});			
			this.addChild(this.list);
			this.resize();
		},
		
		dataPoints: function(){
			if(this.list){
				var pos= domGeom.position(this.list.domNode,true);
			       
				if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
					this.getNextGroup();
				}
			}
		},
		
		getNextGroup: function(){
			this.list.postAddToList(this.list.fromVar+=20);
		},
		
		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/userFeeds', title: "User Feeds"} );
			console.log("console: userFeeds/FeedView.js: this.users is ", this.users);
			
			kernel.global.feedCount[this.id] = {};
			kernel.global.feedCount[this.id].count = 0;
			kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			
			this.getSpecificClients(this.users).then(lang.hitch(this, function(obj){
				var idArray = [];
				console.log("CAPPY CAPPY CAPSLOCK: ", obj);
				for(y = 0; y < obj.length; y++){
						var tempArray = obj[y].data.id.split("-----");
						idArray.push(tempArray[1]);
					for(var x = 0; x < obj[y].data.owns.length; x++){
						var tempArr = obj[y].data.owns[x].split("-----");
						idArray.push(tempArr[1]);
					}
				}
				if(this.list){
					this.list.destroyRecursive();
					this.buildList(idArray);
				}else{
					this.buildList(idArray);
				}
			}))
			
			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
		}
	})
});