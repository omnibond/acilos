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
		
		buildMainList: function(){
			
			this.mainList = new EdgeToEdgeList({
				
			});
			
			this.holderNameLabel = new ListItem({
				variableHeight: true,
				style: "border:none;padding:0 0 0 0",
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
				label: "Enter keys separated by spaces"
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
			
			this.favorites = new ListItem({
				label: "Show only favorites",
				style: "width: 180px",
				noArrow: true,
				clickable: true,
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
			})
			
			this.startDate = new ToolBarButton({
				label: "StartDate",
				style: "width:100px",
				
				onClick: lang.hitch(this, function(){
					if(this.endDatePicker){
						this.endDate.set("label", this.endDatePicker.get("value"));
						this.endDatePicker.destroyRecursive();
						this.endDatePicker = null;
					}
					
					if(this.enterDateMsg){
						this.enterDateMsg.set('label', "Select start date");
					}else{
						this.enterDateMsg = new ListItem({
							label: "Select start date"
						})
						this.mainList.addChild(this.enterDateMsg);
						domConstruct.place(this.enterDateMsg.domNode, this.goBut.domNode, "before");
					}
					
					if(!this.startDatePicker){
						this.startDatePicker = new Calendar({
	
						});
						this.addChild(this.startDatePicker);
						this.startDatePicker.startup();
						domConstruct.place(this.startDatePicker.domNode, this.goBut.domNode, "before");
					}
				})
			})
		
			var listItem = new ListItem({
				variableHeight: true,
				style: "border:none"
			});

			this.services = new ServiceSelector({
				checkBoxes: {"Instagram": false, "Facebook" : false, "Linkedin": false, "Twitter" : false},
				vertical: "true"
			})
			
			listItem.addChild(this.services);
			
			this.endDate = new ToolBarButton({
				label: "EndDate",
				style: "width:100px",
				
				onClick: lang.hitch(this, function(){
					if(this.startDatePicker){
						this.startDate.set("label", this.startDatePicker.get("value"));
						this.startDatePicker.destroyRecursive();
						this.startDatePicker = null;
					}
					
					if(this.enterDateMsg){
						this.enterDateMsg.set('label', "Select end date");
					}else{
						this.enterDateMsg = new ListItem({
							label: "Select end date"
						})
						this.mainList.addChild(this.enterDateMsg);
						domConstruct.place(this.enterDateMsg.domNode, this.goBut.domNode, "before");
					}
					
					if(!this.endDatePicker){
						this.endDatePicker = new Calendar({
					
						});
						this.addChild(this.endDatePicker);
						this.endDatePicker.startup();
						domConstruct.place(this.endDatePicker.domNode, this.goBut.domNode, "before");
					}	
					
					console.log("endDatePicker value: ", this.endDatePicker.get("value"));
					this.endDate.set("label", this.endDatePicker.get("value"));
				})
			})
			
			this.nameBox = new TextBox({
				placeHolder: "Feed Name"
			})
			
			this.userBox = new TextBox({
				placeHolder: "Users"
			})
			
			this.keyBox = new TextBox({
				placeHolder: "Keywords"
			})
			
			this.closeDateButton = new Button({
				label: "Set Dates",
				
				onClick: lang.hitch(this, function(){
					if(this.startDate.get("label") == '' || this.endDate.get("label") == ''){
						if(this.enterDateMsg){
							this.enterDateMsg.set('label', "Must have a start and an end date");
						}else{
							this.enterDateMsg = new ListItem({
								label: "Must have a start and an end date"
							})
							this.mainList.addChild(this.enterDateMsg);
							domConstruct.place(this.enterDateMsg.domNode, this.goBut.domNode, "before");
						}
						if(this.startDatePicker){
							this.startDate.set("label", this.startDatePicker.get("value"));
							this.startDatePicker.destroyRecursive();
							this.startDatePicker = null;
						}
						if(this.endDatePicker){
							this.endDate.set("label", this.endDatePicker.get("value"));
							this.endDatePicker.destroyRecursive();
							this.endDatePicker = null;
						}
					}else{
						if(this.startDatePicker){
							this.startDate.set("label", this.startDatePicker.get("value"));
							this.startDatePicker.destroyRecursive();
							this.startDatePicker = null;
						}
						if(this.endDatePicker){
							this.endDate.set("label", this.endDatePicker.get("value"));
							this.endDatePicker.destroyRecursive();
							this.endDatePicker = null;
						}
						if(this.enterDateMsg){
							this.enterDateMsg.destroyRecursive();
							this.enterDateMsg = null;
						}
					}
					if(this.startDate.get("label") != "" && this.endDate.get("label") != ""){		//added this code Tuesday
						if(this.enterDateMsg){
							this.enterDateMsg.destroyRecursive();
							this.enterDateMsg = null;
						}
					}
				})
			})
			
			this.clearDatesButton = new Button({
				label: "Clear Dates",
				
				onClick: lang.hitch(this, function(){
					this.startDate.set("label", 'StartDate');
					this.endDate.set("label", 'EndDate');
					if(this.startDatePicker){
						this.startDatePicker.destroyRecursive();
						this.startDatePicker = null;
					}
					if(this.endDatePicker){
						this.endDatePicker.destroyRecursive();
						this.endDatePicker = null;
					}
					if(this.enterDateMsg){
						this.enterDateMsg.destroyRecursive();
						this.enterDateMsg = null;
					}
				})
			})
			
			this.holderName.addChild(this.nameBox);
			this.holderUsers.addChild(this.userBox);
			this.holderKeys.addChild(this.keyBox);

			this.holderDates.addChild(this.startDate);
			this.holderDates.addChild(this.endDate);
			this.holderDatesButtons.addChild(this.closeDateButton);
			this.holderDatesButtons.addChild(this.clearDatesButton);
	
			this.mainList.addChild(this.holderNameLabel);	
			this.mainList.addChild(this.holderName);	
			this.mainList.addChild(this.holderUsersLabel);	
			this.mainList.addChild(this.holderUsers);	
			this.mainList.addChild(this.holderKeysLabel);	
			this.mainList.addChild(this.holderKeys);	
			this.mainList.addChild(this.services);
			this.mainList.addChild(listItem);
			this.mainList.addChild(this.favorites);
			
			this.mainList.addChild(this.setDatesLabel);
			
			this.mainList.addChild(this.holderDates);	
			this.mainList.addChild(this.holderDatesButtons);	
		
			
			this.goBut = new ToolBarButton({
				label: "Start Pruning",
				onClick: lang.hitch(this, function(){
					this.fromVar = 0;
					if(this.startDate.get("label") == "StartDate" && this.endDate.get("label") == "EndDate"){
						var selected = this.services.get("checkBoxes");  //assumes this returns ['facebook','twitter','linkedin'] or some similar array
						for(var i = 0, str = '';i<selected.length;i++){
							str += selected[i];
							if(i != selected.length -1){
								str += " ";
							}
						}
						
						if(this.startDatePicker){
							this.startDate.set("label", this.startDatePicker.get("value"));
							this.startDatePicker.destroyRecursive();
							this.startDatePicker = null;
						}
						if(this.endDatePicker){
							this.endDate.set("label", this.endDatePicker.get("value"));
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
						
						this.feedView.object = feedObj;
						this.router.go("/feedView");
					}else{
						if(this.startDate.get("label") == "StartDate" || this.endDate.get("label") == "EndDate"){
							
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
								this.startDate.set("label", this.startDatePicker.get("value"));
								this.startDatePicker.destroyRecursive();
								this.startDatePicker = null;
							}
							if(this.endDatePicker){
								this.endDate.set("label", this.endDatePicker.get("value"));
								this.endDatePicker.destroyRecursive();
								this.endDatePicker = null;
							}
							if(this.enterDateMsg){
								this.enterDateMsg.destroyRecursive();
								this.enterDateMsg = null;
							}

							var formatStartDate = new Date(this.startDate.get("label"));
							formatStartDate = formatStartDate.getFullYear() + "-" + (formatStartDate.getMonth()+1) + "-" + formatStartDate.getDate();

							var formatEndDate = new Date(this.endDate.get("label"));
							formatEndDate = formatEndDate.getFullYear() + "-" + (formatEndDate.getMonth()+1) + "-" + formatEndDate.getDate();
							
							var name = this.nameBox.get("value");
							var user = this.userBox.get("value").replace(/ /gi,'+');
							var key = this.keyBox.get("value").replace(/ /gi,'+');
							var service = str.replace(/ /gi,'+');
							var startDate = formatStartDate;
							var endDate = formatEndDate;
							var favorite = this.favorites.checked;
							var feedObj = {name: name, users: user, keys: key, services: service, start: startDate, end: endDate, fav: favorite};
							
							this.feedView.object = feedObj;
							this.router.go("/feedView");
						}
					}
				})
			})
			this.mainList.addChild(this.goBut);	
			this.addChild(this.mainList);
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Filter feed items for deletion"} );

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.buildMainList();
			}else{
				this.buildMainList();
			}
		}	
	})
});
