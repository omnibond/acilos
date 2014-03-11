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
		"app/ServiceSelector",
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
		ServiceSelector,
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
				this.selectorItem2 = new ListItem({
					style: "background:#e7e7de;border:none;padding:0 0 0 0;margin-top:40px;text-align:center",
					fixed: "top",
					variableHeight: true
				})
				
				this.services = new ServiceSelector({
					style:"text-align: center; float: left; margin-top: 0px; margin-left: 0px; height: 21px",
					checkBoxes: {"Instagram": false, "Facebook" : false, "Linkedin": false, "Twitter" : false},
					vertical: "false"
				})
				//this.selectorItem2.addChild(this.services);

				this.button = new Button({
					"name": "searchButton",
					 onClick: lang.hitch(this, function(){
						var service = [];
						for(x = 0; x < this.services['currentCheckBoxes'].length; x++){
							if(this.services['currentCheckBoxes'][x]['checked'] == true){
								service.push(this.services['currentCheckBoxes'][x]['label']);
							}
						}
						var finalService = "";
						for(y = 0; y < service.length; y++){
							finalService += service[y] + " ";
						}

						if(this.list){
							this.list.destroyRecursive();
						}
						if(service == ""){
							service = "all";
						}else{
							service = finalService.replace(/ /gi, "+");
						}
						
						kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
						
						this.showResponse(service);
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
					style: "position: absolute; height: 21px"
				})
				this.services.placeAt(this.selectorItem.domNode);
				this.selectorItem2.placeAt(this.domNode.parentNode);
				this.selectorItem.placeAt(this.domNode.parentNode);	
			},
			
			showResponse: function(service){		
				//this.searchTerm is now passed to the scroller class but it still takes in the same arguments from that class
				//so terms is passed into feedName and this.from is passed to from. so the new
				//function gets the new variables but in the same manner the old one did so the
				//class still works
				this.list = new SearchScroller({
					feedName: service,
					getFeedData: lang.hitch(this, this.searchService),
					getNextGroup: lang.hitch(this, this.getNextGroup),
					setStarred: lang.hitch(this, this.setStarred),
					setStarredClient: lang.hitch(this, this.setStarredClient),
					fromVar: this.fromVar,
					FeedViewID: this.id,
					view: this
				});			
				this.addChild(this.list);
			},
			
			activate: function() {
				topic.publish("/dojo-mama/updateSubNav", {back: '/search', title: "Search for items by service"} );
				kernel.global.feedCount[this.id].count = 0;
				
				this.buildBar();	
				
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
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
				if(this.selectorItem2){
					this.selectorItem2.destroyRecursive();
					this.selectorItem2 = null;
				}
			}
		});
	}
);
