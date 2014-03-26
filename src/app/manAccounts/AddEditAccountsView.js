/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the add/editAccounts for the manAccounts module
** 
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/
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
		"dojo-mama/util/RoundRectList",
		"dojo-mama/util/EdgeToEdgeList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",
		"dojox/mobile/ContentPane",
		
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
		Pane,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/manAccounts', title: "Edit Accounts"} );

				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}

				this.getServiceCreds().then(lang.hitch(this, function(obj){
					this.buildList(obj);
				}));
			},
			
			buildList: function(obj){
				console.log(obj);
				this.mainList = new EdgeToEdgeList({

				});
				
				var item = new ListItem({
					label: "Edit or delete your current accounts",
					style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(item);
				this.errorItem = new ListItem({
					label: "",
					style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(this.errorItem);				
				
				for(var key in obj){
					this.authButtonsNitems(key, obj);
				}
				
				this.addChild(this.mainList);
			},
			
			authButtonsNitems: function(param, obj){	
				if(param == "login"){
					return;
				}
				for(w = 0; w < obj[param].length; w++){
					var item = new ListItem({
						style: "height:auto;border-left:5px solid " +obj[param][w].color+ ";right:none"
					});
					
					if(param == "instagram"){
						var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/instagramLogin.png>"});
					}
					if(param == "facebook"){
						var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/facebookLogin.png>"});
					}
					if(param == "twitter"){
						var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/twitterLogin.png>"});
					}
					if(param == "linkedin"){
						var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/linkedinLogin.png>"});
					}
					
					var holderDiv = domConstruct.create("div", {style: "margin-top:15px"});
					
					var nameDiv = domConstruct.create("div", {});
					if(obj[param][w].name != null || obj[param][w].name != undefined){
						nameDiv.innerHTML = obj[param][w].name;
					}else{
						var authURL = obj[param][w].auth;
						var auth = new Button({
							label: "Authenticate",
							onClick: lang.hitch(this, function(authURL){
								window.location = authURL;
							}, authURL)
						})
						nameDiv.appendChild(auth.domNode);
						var msgDiv = domConstruct.create("div", {style:"overflow:visible;", innerHTML: "Make sure the correct account is logged in on this browser before authenticating."});
						nameDiv.appendChild(msgDiv);
					}
					
					obj[param][w].param = param;
					var Delete = new Button({
						label: "Delete",
						onClick: lang.hitch(this, function(item, obj, param, w){
	
							this.deleteServiceCred(obj[param][w]);
							item.destroyRecursive();
						}, item, obj, param, w)
					})
					
					var colorPicker = new ColorPicker({});
					var y = "";
					var color = new Button({
						label: "Color"
					})
					whiteoutDiv = domConstruct.create("div", {"class": "whiteoutDiv"});
					color.onClick = lang.hitch(this, function(item){
						var dialog = new Dialog({
							title: "Choose a color",
							draggable: false,
							"class": "helpDijitDialog",
							onHide: function(){
								domStyle.set(item.domNode, "border-left", "5px solid" + colorPicker.get('value'));
								if(whiteoutDiv){
									document.body.removeChild(whiteoutDiv);
									whiteoutDiv = null;
								}
							}
						});
						
						dialog.set("content", colorPicker);
						dialog.show();					
						document.body.appendChild(whiteoutDiv);
						
					}, item)		
					
					var key = obj[param][w].key
					var save = new Button({
						label: "Save",
						onClick: lang.hitch(this, function(){
							this.errorItem.set("label", "Saving...");
							
							if(colorPicker.get("value")== ""){
								console.log("Please choose color");
							}else{
								var colors = colorPicker.get("value");
								
								this.editServiceCreds(key, colors, param).then(lang.hitch(this, function(obj){
									console.log(obj);
									if(obj['error']){
										this.errorItem.set("label", obj['error']);
									}else{
										this.errorItem.set("label", obj['success']);
									}
								}));
								
							}
						}, key, colorPicker, param, color)
					})
					
					var actionDiv = domConstruct.create("div", { });
					actionDiv.appendChild(Delete.domNode);
					actionDiv.appendChild(color.domNode);
					actionDiv.appendChild(save.domNode);
					
					holderDiv.appendChild(nameDiv);
					holderDiv.appendChild(actionDiv);
					
					item.domNode.appendChild(logoDiv);
					item.domNode.appendChild(holderDiv);
					
					this.mainList.addChild(item);
				}
				
				var addAccount = new ListItem({
					variableHeight:true
				})
				var add = domConstruct.create("div", {innerHTML: "Add a new " + param + " account", "class": "twitterOrangeDiv"});
				add.onclick = lang.hitch(this, function(){
					this.getDomain().then(lang.hitch(this, function(obj){
						this.domain = obj['domain'];
					
						var list = new EdgeToEdgeList({style:"margin-top:30px;border:none"})			
						
						this.makeAccountPane(param, list);
							
						addAccount.domNode.appendChild(list.domNode);	
					}))
				}, param, addAccount)
				addAccount.domNode.appendChild(add);
				
				this.mainList.addChild(addAccount);
			},
			
			makeAccountPane: function(param, list){
				var item = new ListItem({
					style: "height:auto;border:none"
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
				color.onClick = lang.hitch(this, function(item){
					var dialog = new Dialog({
						title: "Choose a color",
						draggable: false,
						"class": "helpDijitDialog",
						onHide: function(){
							domStyle.set(item.domNode, "border-left", "5px solid " +colorPicker.get('value'));
							if(whiteoutDiv){
								document.body.removeChild(whiteoutDiv);
								this.whiteoutDiv = null;
							}
						}
					});
					
					dialog.set("content", colorPicker);
					dialog.show();					
					document.body.appendChild(whiteoutDiv);
					
				}, item);	
				holderDiv.appendChild(color.domNode);
				colorDiv = domConstruct.create("span", {style: "height:20px;width:20px", id:"picker"});
				holderDiv.appendChild(colorDiv);				
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(redirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				var add = new Button({
					label: "Add",
					onClick: lang.hitch(this, function(key, secret, redirect, colorPicker, param, color){
						
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
								this.activate();
							}));
							
							/*key.set("value", "");
							secret.set("value", "");
							domStyle.set(color.domNode, "background-image", "linear-gradient(to bottom, #ffffff 0%, #e2e2e2 100%)");*/
						}
					},key, secret, redirect, colorPicker, param, color)
				})
				holderDiv.appendChild(add.domNode);
				
				item.domNode.appendChild(logoDiv);
				item.domNode.appendChild(textBoxDiv);
				
				list.addChild(item);
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
