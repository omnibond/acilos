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
				topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Manage Your Accounts"} );

				this.mainList = new EdgeToEdgeList({
					style: "border: none"
				});

				this.authAccounts = new ListItem({
					label: "Authenticate Accounts",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/AuthAccounts");
					})
				});
				
				this.addAccounts = new ListItem({
					label: "Add Accounts",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/AddAccounts");
					})
				});
				
				this.editAccounts = new ListItem({
					label: "Edit Accounts",
					"class": "helpListItemClass",
					clickable: true,
					noArrow: true,
					onClick: lang.hitch(this, function(){
						this.router.go("/EditAccounts");
					})
				});

				this.mainList.addChild(this.authAccounts);
				this.mainList.addChild(this.addAccounts);
				this.mainList.addChild(this.editAccounts);
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
