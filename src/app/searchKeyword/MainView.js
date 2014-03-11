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
			
			startup: function(){
				this.inherited(arguments);
				
				kernel.global.feedCount[this.id] = {};
				kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			},
			
			buildBar: function(){				
				this.searchBox = new TextBox({
					placeHolder: "Enter a term to search",
					style: "height:19px; vertical-align: top"
				})
				on(this.searchBox, "keydown", lang.hitch(this, function(event){
					switch(event.keyCode){
						case 13: 
							this.button.onClick();						
						break;
						default: 
						break;
					}
				}))
				this.button = new Button({
					"name": "searchButton",
					onClick: lang.hitch(this, function(){
						var term = this.searchBox.get("value");						
						if(term == ""){
							this.item.set("rightText", "You must enter a term to search");
						}else{
							if(this.list){
								this.list.destroyRecursive();
							}
							var terms = term.replace(/ /gi, "+");							
							kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
							
							this.showResponse(terms);
						}
					})
				})
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
					buttons: [this.button, this.scrollButton, this.manualRefreshBut],
					textBoxes: [this.searchBox]
				})
				this.selectorItem.placeAt(this.domNode.parentNode);
			},
			
			showResponse: function(terms){						
				//this.searchTerm is now passed to the scroller class but it still takes in the same arguments from that class
				//so terms is passed into feedName and this.from is passed to from. so the new
				//function gets the new variables but in the same manner the old one did so the
				//class still works
				this.list = new SearchScroller({
					feedName: terms,
					getFeedData: lang.hitch(this, this.searchTerm),
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
			
			activate: function() {
				topic.publish("/dojo-mama/updateSubNav", {back: '/search', title: "Search for items by keyword"} );
				
				kernel.global.feedCount[this.id].count = 0;
				
				this.buildBar();
				
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
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
