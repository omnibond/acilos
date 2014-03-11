define([
		"dojo/_base/declare",
		"dijit/registry",
		'dojo/_base/kernel',
		"dojo/dom",
		'dojo/topic',
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
		"dojo/_base/array",
		"dojo/mouse",
		'dojo/dom-geometry',
		
		'dojo-mama/views/ModuleScrollableView',
		'dojo-mama/views/ModuleView',
		
		"app/mainFeed/facebookFeedItem",
		"app/mainFeed/twitterFeedItem",
		"app/mainFeed/linkedinFeedItem",
		"app/mainFeed/instagramFeedItem",
		"app/mainFeed/FeedScroller",
		"app/SearchScroller",
		"app/TitleBar",
		"app/SelectorBar",
		
		"dojox/mobile/sniff",
		"dojox/mobile/_css3",
		"dojox/mobile/ScrollableView",
		"dojox/mobile/Heading",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/RoundRectList",	
		"dojox/mobile/ListItem",
		"dojox/mobile/Accordion",
		"dojox/mobile/ContentPane",		
		"dojox/mobile/Button",	
		"dojox/mobile/TextBox",	
		"dijit/Dialog",
		
		"dojo/ready"

	], function(
		declare,
		registry,
		kernel,
		dom,
		topic,
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
		array,
		mouse,
		domGeom,
		
		ModuleScrollableView,
		ModuleView,
		
		facebookFeedItem,
		twitterFeedItem,
		linkedinFeedItem,
		instagramFeedItem,
		FeedScroller,
		SearchScroller,
		TitleBar,
		SelectorBar,

		has,
		css3,
		ScrollableView,
		Heading,
		ToolBarButton,
		RoundRectList,
		ListItem,
		Accordion,
		Pane,
		Button,
		TextBox,
		Dialog,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			style: "overflow:scroll",

			constructor: function(args){
				this.fromVar = 0;
				this.buttonExists = "false";
				this.postAddArray = [];				
			},
			
			startup: function(){
				this.inherited(arguments);
				
				kernel.global.feedCount[this.id] = {};
				kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			},
			
			activate: function() {
				kernel.global.feedCount[this.id].count = 0;

				this.scrollButton = new Button({
					"name": "scrollButton",
					"right": "true",
					onClick: lang.hitch(this, function(){
						var scroller = lang.hitch(this, function(){
							if(this.domNode.scrollTop <= 0){
								this.domNode.scrollTop = 0;
							}else{
								this.domNode.scrollTop = this.domNode.scrollTop - (this.domNode.scrollTop*0.08);
								if(this.domNode.scrollTop !== 0){
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
								//stuff here
						}));
						if(this.list){
							this.list.destroyRecursive();
							this.postAddArray = [];
							this.buildFeedList();
						}
					})
				});
				this.searchBox = new TextBox({
					placeHolder: "Enter a term to search",
					style: "height:19px; vertical-align: top; margin-right: 5px"
				});
				this.searchButton = new Button({
					"name": "searchButton",
					onClick: lang.hitch(this, function(){
						var searchString = this.searchBox.get("value");						
						if(searchString === ""){
							console.log("You must enter a term to search");
						}else{
							searchString = searchString.replace(/ /gi, "+");

							this.searchView.queryObj = searchString;
							this.router.go("/searchView");
						}
					})
				});

				this.helpButton = new Button({
					"name": "helpButton",
					onClick: lang.hitch(this, function(){
						this.dialog = new Dialog({
							title: "Help",
							draggable: false,
							"class": "helpDijitDialog",
							onHide: lang.hitch(this, function(){
								if(this.whiteoutDiv){
									document.body.removeChild(this.whiteoutDiv);
									this.whiteoutDiv = null;
								}
							})
						});

						var dialogDiv = domConstruct.create("div", {innerHTML: "<span class='helpTitle'>User Search</span><br>Bob Dole: your text here<br><br><span class='helpTitle'>Service Search</span><br>Facebook: your text here<br><br><span class='helpTitle'>Exact Search</span><br>Put \"quotes\" around what you would like to search for"});

						this.whiteoutDiv = domConstruct.create("div", {"class": "whiteoutDiv"});

						this.dialog.set("content", dialogDiv);
						this.dialog.show();

						document.body.appendChild(this.whiteoutDiv);
					})
				});

				this.selectorItem = new SelectorBar({
					textBoxes: [this.searchBox],
					buttons: [this.manualRefreshBut, this.searchButton, this.scrollButton],
					toolTips: [this.helpButton],
					style: "text-align: center"
				});
				this.selectorItem.placeAt(this.domNode.parentNode);

				if(this.list){
					console.log("List exists, transitioning to last place now");
					
					var kids = this.list.getChildren();
					if(kids.length > 0){
						if(domClass.contains(kids[0].id, "feedSearchErrorClass")){
							this.list.destroyRecursive();
							this.buildFeedList();
							this.loading = false;
						}
					}
				}else{
					console.log("No list made, making one now");
					
					window.setInterval(lang.hitch(this, function(){
						this.checkForNewItems(this.feedName).then(lang.hitch(this, this.setFeedCounter));
					//twenty seconds
					}), 20000);	
					
					on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
					
					this.buildFeedList();
					this.loading = false;
				}

				document.body.onkeydown = lang.hitch(this, function(event){
					switch(event.keyCode){
						case 13: 
							this.searchButton.onClick();
						break;
					}
				});
			},

			deactivate: function(){
				document.body.onkeydown = '';
				if(this.selectorItem){
					this.selectorItem.destroyRecursive();
					this.selectorItem = null;
				}

				if(this.dialog){
					this.dialog.destroy();
					this.dialog = null;
				}

				if(this.whiteoutDiv){
					document.body.removeChild(this.whiteoutDiv);
					this.whiteoutDiv = null;
				}
			},
			
			dataPoints: function(){
				var pos= domGeom.position(this.list.domNode,true);

				if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
					if(this.loading === false){
						this.getNextGroup();
					}
				}
			},

			showResponse: function(searchString){						
				//this.searchTerm is now passed to the scroller class but it still takes in the same arguments from that class
				//so terms is passed into feedName and this.from is passed to from. so the new
				//function gets the new variables but in the same manner the old one did so the
				//class still works
				this.list = new SearchScroller({
					feedName: searchString,
					getFeedData: lang.hitch(this, this.sendSearchString),
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
			
			postCreate: function(){
				this.inherited(arguments);

				if(this.dataObj === undefined){
					console.log("Data for FeedListView is undefined"); 
					return;
				}
			},
			
			getNextGroup: function(){
				if(this.list.ListEnded === false){
					this.loading = true;
					this.list.postAddToList(this.list.fromVar+=20);
					this.loading = false;
				}
			},
			
			buildFeedList: function(){				
				this.list = new FeedScroller({
					feedName: this.feedName,
					postAddArray: this.postAddArray,
					getNextGroup: lang.hitch(this, this.getNextGroup),
					getFeedData: lang.hitch(this, this.getFeedData),
					setStarred: lang.hitch(this, this.setStarred),
					setStarredClient: lang.hitch(this, this.setStarredClient),
					fromVar: this.fromVar,
					FeedViewID: this.id,
					view: this
				});
				this.addChild(this.list);				
				this.resize();
			},
			
			setFeedCounter: function(obj){
				this.tempCount = obj.count;
				if(kernel.global.feedCount[this.id].count){
					if(parseInt(kernel.global.feedCount[this.id].count) < (parseInt(obj.count))){
						var numero = (parseInt(obj.count) - parseInt(kernel.global.feedCount[this.id].count));
						console.log("new items: " + this.number);
						if(this.number < 0){
							this.number =0;
						}
						kernel.global.feedCount[this.id].count = parseInt(obj.count);
						this.addNewItems(numero);
					}
				}else{
					console.log("count is set to: " + this.tempCount);
					kernel.global.feedCount[this.id].count = obj.count;
				}
			},
			
			addNewItems: function(size){				
				if(this.list){
					if(size > 0){
						console.log("adding new items: " + size);
						this.addToList(size);
					}
				}else{
					console.log("no list making one");
					this.buildFeedList();
				}
			},
			
			addToList: function(size){
				var pos= domGeom.position(this.list.domNode,true);
				var currentH = pos.h;
				this.updateFeedData(this.feedName, size).then(lang.hitch(this, function(data){
					console.log(data);
					var feedListArray = {};
					feedListArray.current = '';	
					//invisible list item so that the scroll into view (0) will always scroll to the top
					//some items are so big it will only scroll into them halfway
					for(var j=data.hits.hits.length - 1; j>=0; j--){
						if(this.postAddArray[data.hits.hits[j]._source.id]){
							console.log("skipping: " + data.hits.hits[j]._source);
						}else{
							var pane = new Pane({	});
							switch(data.hits.hits[j]._source.service){
								case "Twitter":
									var item = new twitterFeedItem({
										data: data,
										counter: j,
										getDate: this.list.getDate,
										parseSpecialChars: this.list.parseSpecialChars,
										isURL: this.list.isURL,
										setStarred: this.setStarred
									});
									pane.addChild(item);
								break;
								case "Instagram":								
									var item = new instagramFeedItem({
										data: data,
										counter: j,
										getDate: this.list.getDate,
										parseSpecialChars: this.list.parseSpecialChars,
										isURL: this.list.isURL,
										setStarred: this.setStarred
									});
									pane.addChild(item);
								break;
								case "Facebook":
									var item = new facebookFeedItem({
										data: data,
										counter: j,
										getDate: this.list.getDate,
										parseSpecialChars: this.list.parseSpecialChars,
										isURL: this.list.isURL,
										setStarred: this.setStarred
									});
									pane.addChild(item);
								break;
								case "Linkedin":
									var item = new linkedinFeedItem({
										data: data,
										counter: j,
										getDate: this.list.getDate,
										parseSpecialChars: this.list.parseSpecialChars,
										isURL: this.list.isURL,
										setStarred: this.setStarred
									});
									pane.addChild(item);								
								break;
								default:
									console.log("Default list item");
								break;
							}

							pane.placeAt(this.list, 1);
							var postID = data.hits.hits[j]._source.id;
							this.postAddArray[postID] = postID;
						}
					}
					this.list.resize();	
				}));
				
				var pos= domGeom.position(this.list.domNode,true);
				var newH = pos.h;
				//get the new difference in height and add that to offsetTop
				this.domNode.scrollTop += newH - currentH;
			}
		});
	}
);
