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
		'app/SelectorBar',
		'app/ServiceSelector',
		
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
	SelectorBar, 
	ServiceSelector,
	
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
		
		buildMainList: function(obj){
			console.log("buildMainList: ", obj);
			
			this.mainList = new EdgeToEdgeList({
				
			});
			
			this.holderNameLabel = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0;margin-top:50px",
				label: "Enter the name of this feed"
			});
			this.holderName = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0"
			});
			
			this.holderUsersLabel = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0",
				label: "Enter users separated by spaces"
			});
			this.holderUsers = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0"
			});	
			
			this.holderKeysLabel = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0",
				label: "Enter keywords separated by spaces"
			});
			this.holderKeys = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0"
			});	

			this.holderDates = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0"
			});
			this.holderDatesButtons = new ListItem({
				variableHeight: true,
				style: "border:none;padding:5px 0 5px 0"
			});	
			
			this.setDatesLabel = new ListItem({
				variableHeight: true,
				style: "border:none;padding:5px 0 0 0",
				label: "Set Date Range"
			});
			
			/*this.favorites = new ListItem({
				label: "Show only favorites",
				clickable: true,
				style: "width: 180px",
				noArrow: true,
				checked: false,
				"class": "itemLightClass",
				onClick: lang.hitch(this, function(){
					if(this.favorites.checked == false){
						domClass.replace(this.favorites.domNode, "itemDarkClass", "itemLightClass");
						this.favorites.checked = true;
					}else{
						domClass.replace(this.favorites.domNode, "itemLightClass", "itemDarkClass");
						this.favorites.checked = false;
					}
				})
			});*/

			this.buttonListItem = new ListItem({
				variableHeight: true,
				style: "border: none"
			});

			this.flag = false;

			this.favorites = new Button({
				label: "Show only favorites",
				style: "float: left; margin-left: -7px; margin-top: -5px; margin-bottom: -11px; height: 21px; line-height: 21px",
				onClick: lang.hitch(this, function(){
					if(this.flag == false){
						domClass.add(this.favorites.domNode, "darkButton");
						this.flag = true;
					}else{
						this.flag = false;
						domClass.remove(this.favorites.domNode, "darkButton");
					}
				})
			});

			this.buttonListItem.addChild(this.favorites);

			var date;

			if(obj['start'] == ""){
				date = "";
			}else{
				date = this.formatDate(obj['start']);
			}

			this.startDate = new TextBox({
				"class": "roundTextBoxClass",
				placeHolder: "mm/dd/yyyy",
				value: date,
				style: "width:80px; margin-right: 10px"
			})

			this.startDate.on("click", lang.hitch(this, function(){
				console.log("you clicked the start date text box");

				if(this.endDatePicker){
					this.endDate.set("value", this.endDatePicker.get("value"));
					this.endDatePicker.destroyRecursive();
					this.endDatePicker = null;
				}

				if(this.enterDateMsg){
					this.enterDateMsg.destroyRecursive();
					this.enterDateMsg = null;
				}

				if(!this.startDatePicker){
					this.startDatePicker = new Calendar({

					});
					this.addChild(this.startDatePicker);
					this.startDatePicker.startup();
					domConstruct.place(this.startDatePicker.domNode, this.goBut.domNode, "before");

					this.startDatePicker.dateRowsNode.onclick = lang.hitch(this, function(){
						console.log("startDatePicker's value is: ", this.startDatePicker.get("value"));

						var formatStartDate = this.formatDate(this.startDatePicker.get("value"));

						this.startDate.set("value", formatStartDate);

						this.startDatePicker.destroyRecursive();
						this.startDatePicker = null;

						if(this.enterDateMsg){
							this.enterDateMsg.destroyRecursive();
							this.enterDateMsg = null;
						}
					});
				}
			}));
			
			var def = {"Instagram": false, "Facebook" : false, "Twitter" : false, "Linkedin": false};
			
			var servArr = obj['services'].split("+");
			for(var g = 0; g < servArr.length; g++){
				if(servArr[g] != ''){
					def[servArr[g]] = true;
				}
			}

			var listItem = new ListItem({
				variableHeight: true,
				style: "border:none; margin-bottom: -13px"
			});
			
			this.services = new ServiceSelector({
				checkBoxes: def,
				//vertical: "true",
				style: "margin-top: -6px; margin-left: -11px; margin-bottom: 6px"
				
				//checkBoxes: {"Instagram": false, "Facebook" : false, "Linkedin": false, "Twitter" : false}
				//radioButtons: {"Instagram": false, "Facebook" : false, "Linkedin": false, "Twitter" : false}
			})

			listItem.addChild(this.services);
				
			if(obj['start'] == ""){
				date = "";
			}else{
				date = this.formatDate(obj['start']);
			}	
			
			this.endDate = new TextBox({
				"class": "roundTextBoxClass",
				placeHolder: "mm/dd/yyyy",
				value: date,
				style: "width:80px"
			})

			this.endDate.on("click", lang.hitch(this, function(){
				console.log("you clicked the end date textbox");

				if(this.startDatePicker){
					this.startDate.set("value", this.startDatePicker.get("value"));
					this.startDatePicker.destroyRecursive();
					this.startDatePicker = null;
				}

				if(this.enterDateMsg){
					this.enterDateMsg.destroyRecursive();
					this.enterDateMsg = null;
				}

				if(!this.endDatePicker){
					this.endDatePicker = new Calendar({
				
					});
					this.addChild(this.endDatePicker);
					this.endDatePicker.startup();
					domConstruct.place(this.endDatePicker.domNode, this.goBut.domNode, "before");
				}

				this.endDatePicker.dateRowsNode.onclick = lang.hitch(this, function(){
					var formatEndDate = this.formatDate(this.endDatePicker.get("value"));

					this.endDate.set("value", formatEndDate);

					this.endDatePicker.destroyRecursive();
					this.endDatePicker = null;

					if(this.enterDateMsg){
						this.enterDateMsg.destroyRecursive();
						this.enterDateMsg = null;
					}
				});
			}));
			
			this.nameBox = new TextBox({
				"class": "disabledTextBoxClass",
				placeHolder: "Feed Name",
				value: obj['name'],
				disabled: true
			})
			
			this.userBox = new TextBox({
				"class": "roundTextBoxClass",
				placeHolder: "Users",
				value: obj['users'].replace(/\+/gi," ")
			})
			
			this.keyBox = new TextBox({
				"class": "roundTextBoxClass",
				placeHolder: "Keywords",
				value: obj['keys'].replace(/\+/gi,' ')
			})
			
			this.holderName.addChild(this.nameBox);
			this.holderUsers.addChild(this.userBox);
			this.holderKeys.addChild(this.keyBox);

			this.holderDates.addChild(this.startDate);
			this.holderDates.addChild(this.endDate);
	
			this.mainList.addChild(this.holderNameLabel);	
			this.mainList.addChild(this.holderName);	
			this.mainList.addChild(this.holderUsersLabel);	
			this.mainList.addChild(this.holderUsers);	
			this.mainList.addChild(this.holderKeysLabel);	
			this.mainList.addChild(this.holderKeys);	
			this.mainList.addChild(listItem);
			this.mainList.addChild(this.buttonListItem);
			
			this.mainList.addChild(this.setDatesLabel);
			
			this.mainList.addChild(this.holderDates);	
			this.mainList.addChild(this.holderDatesButtons);	
			
			this.goBut = new Button({
				label: "Test!",
				style: "margin-top: 10px; height: 21px; line-height: 21px; margin-top: 0px; margin-left: 0px",
				onClick: lang.hitch(this, function(){
					//May have to remove this line
					this.fromVar = 0;
					if(this.startDate.get("value") == "" && this.endDate.get("value") == ""){
						var selected = this.services.get("checkBoxes");  //assumes this returns ['facebook','twitter','linkedin'] or some similar array
						for(var i = 0, str = '';i<selected.length;i++){
							str += selected[i];
							if(i != selected.length -1){
								str += " ";
							}
						}
						
						if(this.startDatePicker){
							var formatStartDate = this.formatDate(this.startDatePicker.get("value"));

							this.startDate.set("value", formatStartDate);
							this.startDatePicker.destroyRecursive();
							this.startDatePicker = null;
						}
						if(this.endDatePicker){
							var formatEndDate = this.formatDate(this.endDatePicker.get("value"));

							this.endDate.set("value", formatEndDate);
							this.endDatePicker.destroyRecursive();
							this.endDatePicker = null;
						}
						if(this.enterDateMsg){
							this.enterDateMsg.destroyRecursive();
							this.enterDateMsg = null;
						}
						
						var name = this.nameBox.get("value");
						var user = this.userBox.get("value").replace(/ /gi,'+');
						var key = this.keyBox.get("value").replace(/ /gi,'+');
						var service = str.replace(/ /gi,'+');
						var startDate = '';
						var endDate = '';
						var favorite = this.favorites.checked;
						var feedObj = {name: name, users: user, keys: key, services: service, start: startDate, end: endDate, fav: favorite};
						
						this.buildExampleFeed(feedObj);
					}else{
						if(this.startDate.get("value") == "" || this.endDate.get("value") == ""){
							
							if(this.enterDateMsg){
								this.enterDateMsg.set('label', "Must have a start and an end date");
							}else{
								this.enterDateMsg = new ListItem({
									label: "Must have a start and an end date"
								})
								this.mainList.addChild(this.enterDateMsg);
								domConstruct.place(this.enterDateMsg.domNode, this.goBut.domNode, "before");
							}
							
							if(this.startDatePicker){				//These two blocks may get removed
								//this.startDate.set("value", this.startDatePicker.get("value"));
								this.startDatePicker.destroyRecursive();
								this.startDatePicker = null;
							}
							if(this.endDatePicker){
								//this.endDate.set("value", this.endDatePicker.get("value"));
								this.endDatePicker.destroyRecursive();
								this.endDatePicker = null;
							}
						}else{
							var selected = this.services.get("checkBoxes");  //assumes this returns ['facebook','twitter','linkedin'] or some similar array
							for(var i = 0, str = '';i<selected.length;i++){
								str += selected[i];
								if(i != selected.length -1){
									str += " ";
								}
							}
							
							if(this.startDatePicker){
								var formatStartDate = this.formatDate(this.startDatePicker.get("value"));

								this.startDate.set("value", formatStartDate);
								this.startDatePicker.destroyRecursive();
								this.startDatePicker = null;
							}
							if(this.endDatePicker){
								var formatEndDate = this.formatDate(this.endDatePicker.get("value"));

								this.endDate.set("value", formatEndDate);
								this.endDatePicker.destroyRecursive();
								this.endDatePicker = null;
							}
							if(this.enterDateMsg){
								this.enterDateMsg.destroyRecursive();
								this.enterDateMsg = null;
							}

							var formatStartDate = new Date(this.startDate.get("value"));
							formatStartDate = formatStartDate.getFullYear() + "-" + (formatStartDate.getMonth()+1) + "-" + formatStartDate.getDate();

							var formatEndDate = new Date(this.endDate.get("value"));
							formatEndDate = formatEndDate.getFullYear() + "-" + (formatEndDate.getMonth()+1) + "-" + formatEndDate.getDate();
							
							var name = this.nameBox.get("value");
							var user = this.userBox.get("value").replace(/ /gi,'+');
							var key = this.keyBox.get("value").replace(/ /gi,'+');
							var service = str.replace(/ /gi,'+');
							var startDate = formatStartDate;
							var endDate = formatEndDate;
							var favorite = this.favorites.checked;
							var feedObj = {name: name, users: user, keys: key, services: service, start: startDate, end: endDate, fav: favorite};
							
							this.buildExampleFeed(feedObj);
						}
					}
				})
			})
			this.mainList.addChild(this.goBut);	
			this.addChild(this.mainList);
			
			this.saveBut = new Button({
				"name": "saveButton",
				onClick: lang.hitch(this, function(){
					var name = this.nameBox.get("value");
					if(this.startDate.get("value") == '' && this.endDate.get("value") == ''){
						var selected = this.services.get("checkBoxes");  //assumes this returns ['facebook','twitter','linkedin'] or some similar array
						for(var i = 0, str = '';i<selected.length;i++){
							str += selected[i];
							if(i != selected.length -1){
								str += " ";
							}
						}
						
						if(this.startDatePicker){
							var formatStartDate = this.formatDate(this.startDatePicker.get("value"));

							this.startDate.set("value", formatStartDate);
							this.startDatePicker.destroyRecursive();
							this.startDatePicker = null;
						}
						if(this.endDatePicker){
							var formatEndDate = this.formatDate(this.endDatePicker.get("value"));

							this.endDate.set("value", formatEndDate);
							this.endDatePicker.destroyRecursive();
							this.endDatePicker = null;
						}
						if(this.enterDateMsg){
							this.enterDateMsg.destroyRecursive();
							this.enterDateMsg = null;
						}

						var formatStartDate = new Date(this.startDate.get("value"));
						formatStartDate = formatStartDate.getFullYear() + "-" + (formatStartDate.getMonth()+1) + "-" + formatStartDate.getDate();

						var formatEndDate = new Date(this.endDate.get("value"));
						formatEndDate = formatEndDate.getFullYear() + "-" + (formatEndDate.getMonth()+1) + "-" + formatEndDate.getDate();
				
						var user = this.userBox.get("value").replace(/ /gi,'+');
						var key = this.keyBox.get("value").replace(/ /gi,'+');
						var service = str.replace(/ /gi,'+');
						var startDate = formatStartDate;
						var endDate = formatEndDate;
						var favorite = this.favorites.checked;
						var feedObj = {name: name, users: user, keys: key, services: service, start: startDate, end: endDate, fav: favorite};
						
						this.overwriteFeedList(feedObj, name).then(lang.hitch(this, function(){
							this.router.go("/");
						}))
					}else{
						if(this.startDate.get("value") == '' || this.endDate.get("value") == ''){
							if(this.enterDateMsg){
								this.enterDateMsg.set('label', "Must have a start and an end date");
							}else{
								this.enterDateMsg = new ListItem({
									label: "Must have a start and an end date"
								})
								this.mainList.addChild(this.enterDateMsg);
								domConstruct.place(this.enterDateMsg.domNode, this.goBut.domNode, "before");
							}
							if(this.startDatePicker){				//These two blocks may get removed
								//this.startDate.set("value", this.startDatePicker.get("value"));
								this.startDatePicker.destroyRecursive();
								this.startDatePicker = null;
							}
							if(this.endDatePicker){
								//this.endDate.set("value", this.endDatePicker.get("value"));
								this.endDatePicker.destroyRecursive();
								this.endDatePicker = null;
							}
						}else{
							var selected = this.services.get("checkBoxes");  //assumes this returns ['facebook','twitter','linkedin'] or some similar array
							for(var i = 0, str = '';i<selected.length;i++){
								str += selected[i];
								if(i != selected.length -1){
									str += " ";
								}
							}
							
							if(this.startDatePicker){
								var formatStartDate = this.formatDate(this.startDatePicker.get("value"));

								this.startDate.set("value", formatStartDate);
								this.startDatePicker.destroyRecursive();
								this.startDatePicker = null;
							}
							if(this.endDatePicker){
								var formatEndDate = this.formatDate(this.endDatePicker.get("value"));

								this.endDate.set("value", formatEndDate);
								this.endDatePicker.destroyRecursive();
								this.endDatePicker = null;
							}
							if(this.enterDateMsg){
								this.enterDateMsg.destroyRecursive();
								this.enterDateMsg = null;
							}

							var formatStartDate = new Date(this.startDate.get("value"));
							formatStartDate = formatStartDate.getFullYear() + "-" + (formatStartDate.getMonth()+1) + "-" + formatStartDate.getDate();

							var formatEndDate = new Date(this.endDate.get("value"));
							formatEndDate = formatEndDate.getFullYear() + "-" + (formatEndDate.getMonth()+1) + "-" + formatEndDate.getDate();
						
							var user = this.userBox.get("value").replace(/ /gi,'+');
							var key = this.keyBox.get("value").replace(/ /gi,'+');
							var service = str.replace(/ /gi,'+');
							var startDate = formatStartDate;
							var endDate = formatEndDate;
							var favorite = this.favorites.checked;
							var feedObj = {name: name, users: user, keys: key, services: service, start: startDate, end: endDate, fav: favorite};
							
							this.overwriteFeedList(feedObj, name).then(lang.hitch(this, function(){
								this.router.go("/");
							}))
						}
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

			this.selectorItem = new SelectorBar({
				buttons: [this.scrollButton, this.saveBut]
			})
			this.selectorItem.placeAt(this.domNode.parentNode);
		},
		
		buildExampleFeed: function(feedObj){
			console.log(feedObj);
			
			if(this.list){
				this.list.destroyRecursive();
			}
			
			this.list = new SearchScroller({
				"class": "feedScrollerRoundRectClassNoMarg",
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
		},

		formatDate: function(date){
			var formatDate = new Date(date);

			formatDate = (formatDate.getMonth() + 1) + "/" + formatDate.getDate() + "/" + formatDate.getFullYear();

			return formatDate;
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
		
		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
			if(this.list){
				this.list.destroyRecursive();
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: "Edit feed: " + e.params.feedName} );
			
			kernel.global.feedCount[this.id] = {};
			kernel.global.feedCount[this.id].count = 0;
			kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.getSpecificFeedList(e.params.feedName).then(lang.hitch(this, this.buildMainList));
			}else{
				this.getSpecificFeedList(e.params.feedName).then(lang.hitch(this, this.buildMainList));
			}
			
			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));

		}
		
	})
});
