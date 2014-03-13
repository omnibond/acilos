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
		
		"dojox/widget/ColorPicker",
		"dijit/Dialog",
		
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/TextBox",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/EdgeToEdgeList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",	
		"dijit/Dialog",
		"dojox/mobile/GridLayout",
		"dojox/mobile/Pane",
		
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
		
		ColorPicker,
		Dialog,
		
		ToolBarButton,
		TextBox,
		RoundRectList,
		EdgeToEdgeList,
		ListItem,
		Button,
		Dialog,
		GridLayout,
		Pane,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/appHelp', title: "Adding Accounts Help"} );

				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
				
				this.getDomain().then(lang.hitch(this, function(obj){
					this.domain = obj['domain'];
					this.buildList();
				}))
			},
			
			buildList: function(){
				this.mainList = new EdgeToEdgeList({

				});
				
				var item = new ListItem({
					label: "Please enter social media app accounts",
					style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(item);
				this.errorItem = new ListItem({
					label: "",
					style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(this.errorItem);
				
				this.authPart();				
			
				this.addChild(this.mainList);
			},
			
			authButtonsNitems: function(param, div, list){
				var item = new ListItem({
					style: "height:auto;border-left:none;right:none"
				});
				
				if(param == "instagram"){
					var authFile = "/oAuth/instaAccess.php"
					var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/instagramLogin.png>"});
				}
				if(param == "facebook"){
					var authFile = "/oAuth/facebookAccess.php"
					var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/facebookLogin.png>"});
				}
				if(param == "twitter"){
					var authFile = "/oAuth/twitterAccess.php"
					var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/twitterLogin.png>"});
				}
				if(param == "linkedin"){
					var authFile = "/oAuth/linkedinAccess.php"
					var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/linkedinLogin.png>"});
				}
				
				var key = new TextBox({
					placeHolder: "App Id/Key"
				})
				var secret = new TextBox({
					placeHolder: "App Secret"
				})
				var redirect = new TextBox({
					value: "http://"+ this.domain + authFile,
					disabled: true
				})
				var textBoxDiv = domConstruct.create("span", {style:"float:left"});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(key.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(secret.domNode);
				textBoxDiv.appendChild(holderDiv);
				var colorPicker = new ColorPicker({});
				var y = "";
				var color = new Button({
					label: "Color"
				})
				whiteoutDiv = domConstruct.create("div", {"class": "whiteoutDiv"});
				color.onClick = function(){
					var dialog = new Dialog({
						title: "Choose a color",
						draggable: false,
						"class": "helpDijitDialog",
						onHide: function(){
							domStyle.set(color.domNode, "background", colorPicker.get('value'));
							if(whiteoutDiv){
								document.body.removeChild(whiteoutDiv);
								this.whiteoutDiv = null;
							}
						}
					});
					
					dialog.set("content", colorPicker);
					dialog.show();					
					document.body.appendChild(whiteoutDiv);
					
				}				
				holderDiv.appendChild(color.domNode);
				colorDiv = domConstruct.create("span", {style: "height:20px;width:20px", id:"picker"});
				holderDiv.appendChild(colorDiv);				
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(redirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				var add = new Button({
					label: "Add",
					onClick: lang.hitch(this, function(){
						this.errorItem.set("label", "Saving...");
						
						if(	key.get("value") == "" ||
							secret.get("value")== "" ||
							redirect.get("value")== "" ||
							redirect.get("value")== "" ||
							colorPicker.get("value")== ""){
							console.log("Please enter a value for all fields");
						}else{
						
							var appKey = key.get("value");
							var appSecret = secret.get("value");
							var appRedir = redirect.get("value");
							var appRedir = redirect.get("value");
							var colors = colorPicker.get("value");
							
							this.saveServiceCreds(appKey, appSecret, appRedir, colors, param).then(lang.hitch(this, function(obj){
								console.log(obj);
								if(obj['error']){
									this.errorItem.set("label", obj['error']);
								}else{
									this.errorItem.set("label", obj['success']);
								}
							}));
							
							key.set("value", "");
							secret.set("value", "");
							domStyle.set(color.domNode, "background-image", "linear-gradient(to bottom, #ffffff 0%, #e2e2e2 100%)");
						}
					},key, secret, redirect, colorPicker, param, color)
				})
				holderDiv.appendChild(add.domNode);
				
				item.domNode.appendChild(logoDiv);
				item.domNode.appendChild(textBoxDiv);
				
				this.mainList.addChild(item);
			},
			
			authPart: function(leftPane){				
				var list = new RoundRectList({
					style: "border:none"
				});
				
				var div1 = domConstruct.create("div", {});
				this.authButtonsNitems("facebook", div1, list);
				var div2 = domConstruct.create("div", {});
				this.authButtonsNitems("twitter", div2, list);
				var div3 = domConstruct.create("div", {});
				this.authButtonsNitems("instagram", div3, list);
				var div4 = domConstruct.create("div", {});
				this.authButtonsNitems("linkedin", div4, list);
				
				this.addChild(list);
			},
			
			deactivate: function(){
				if(this.mainList)	{
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
			}
		});
	}
);
