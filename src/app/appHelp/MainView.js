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
		"dojox/mobile/EdgeToEdgeList",	
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
		EdgeToEdgeList,
		ListItem,
		Button,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/help', title: "App Help"} );

				this.mainList = new EdgeToEdgeList({
					style: "border: none"
				});

				this.manageAccountsListItem = new ListItem({
					label: "Manage Accounts Help",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/ManAccountsHelpView");
					})
				});
				
				this.addAccountsListItem = new ListItem({
					label: "Adding Accounts Help",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/AddAccountsHelpView");
					})
				});
				
				this.editAccountsListItem = new ListItem({
					label: "Editing Accounts Help",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/EditAccountsHelpView");
					})
				});
				
				this.aboutListItem = new ListItem({
					label: "About Acilos",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/AboutView");
					})
				});

				this.mainList.addChild(this.manageAccountsListItem);
				this.mainList.addChild(this.addAccountsListItem);
				this.mainList.addChild(this.editAccountsListItem);
				this.mainList.addChild(this.aboutListItem);
				this.addChild(this.mainList);
			},
			
			deactivate: function(){
				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
			}
		});
	}
);
