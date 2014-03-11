define([
		"dojo/_base/declare",
		'dojo/_base/kernel',
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-construct",
		"dojo/dom-geometry",
		"dojo/_base/window",
		"dojo/_base/connect",
		"dojo/dom-style",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/on",
		"dojo/_base/event",
		"dojo/mouse",
	        'dojo/dom-geometry',
		'dojo/topic',
		
		'dojo-mama/views/ModuleScrollableView',

		"app/SearchScroller",
		"app/SelectorBar",
		
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/TextBox",
		"dojox/mobile/RoundRectList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",	
		
		"dojo/ready"

	], function(
		declare,
		kernel,
		dom,
		domClass,
		domConstruct,
		domGeometry,
		domWindow,
		connect,
		domStyle,
		domAttr,
		lang,
		on,
		event,
		mouse,
		domGeom,
		topic,
		
		ModuleScrollableView,

		SearchScroller,
		SelectorBar,
		
		ToolBarButton,
		TextBox,
		RoundRectList,
		ListItem,
		Button,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			constructor: function(args){
				this.fromVar = 0;
			},
			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/favorites', title: "Favorite People"} );
				
				kernel.global.feedCount[this.id] = {};
				kernel.global.feedCount[this.id].count = 0;
				kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
				
				this.searchStarredClients().then(lang.hitch(this, function(obj){
					this.starClientObj = [];
					for(var t = 0; t < obj.hits.hits.length; t++){
						var tempArr = obj.hits.hits[t]._source.data.id.split("-----");
						this.starClientObj.push(tempArr[1]);
						for(var h = 0; h < obj.hits.hits[t]._source.data.owns.length; h++){
							var tempArray = obj.hits.hits[t]._source.data.owns[h].split("-----");
							this.starClientObj.push(tempArray[1]);
						}
					}
					
					if(this.list){
						this.list.destroyRecursive();
						this.buildFavList();
					}else{
						console.log("No list made, making one now");
						
						on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
						this.buildFavList();
					}
				}));
			},
			
			buildFavList: function(){
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
				this.manualRefreshBut = new Button({
					"name": "manualRefreshButton",
					"left": "true",
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
				
				var idStr = '';				
				for(var t = 0; t < this.starClientObj.length; t++){
					if(t == this.starClientObj.length - 1){
						idStr	+= this.starClientObj[t]
					}else{
						idStr += this.starClientObj[t] + "+";
					}
				}
				
				this.list = new SearchScroller({
					feedName: idStr,
					getNextGroup: lang.hitch(this, this.getNextGroup),
					getFeedData: lang.hitch(this, this.searchUser),
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
			}
		});
	}
);
