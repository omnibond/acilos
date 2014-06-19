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
		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",	
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
			
			capitalizeFirstLetter: function(string){
				return string.charAt(0).toUpperCase() + string.slice(1);
			},
			
			buildList: function(obj){
				console.log(obj);
				this.mainList = new EdgeToEdgeList({
					style: "border:none"
				});
				
				var item = new ListItem({
					variableHeight: true,
					label: "Edit or delete your app keys and accounts",
					style: "border:none;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(item);
				var item = new ListItem({
					variableHeight: true,
					label: "First add an app key for any service and then you can create different accounts for that service",
					style: "border:none;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(item);
				this.errorItem = new ListItem({
					label: "",
					variableHeight:true,
					style: "border:none;font-size;font-family:arial;font-size:20px"
				})
				this.mainList.addChild(this.errorItem);				
				
				for(var key in obj){
					this.authButtonsNitems(key, obj);
				}
				
				this.addChild(this.mainList);
			},
			
			getRandomColor: function(){ 
				var letters = '0123456789ABCDEF'.split(''); 
				var color = '#'; 
				for (var i = 0; i < 6; i++ ) { 
					color += letters[Math.floor(Math.random() * 16)]; 
				} 
				return color; 
			},
			
			authButtonsNitems: function(param, obj){	
				if(param == "login"){
					return;
				}
				var paramName = new ListItem({
					label: this.capitalizeFirstLetter(param),
					style: "background-color: #eeeeee;border:none"
				});
				this.mainList.addChild(paramName);
				if(obj[param].length > 0){
					obj = obj[param][0];
					
					if(obj['accounts'].length == 0){						
						var color = this.getRandomColor();
						var loginDisallow = "false";
						var authenticated = "false";
						this.saveNewAccount(color, loginDisallow, authenticated, param).then(lang.hitch(this, function(obj){
							if(obj['error']){
								this.errorItem.set("label", obj['error']);
							}else{
								this.errorItem.set("label", obj['success']);
							}
							this.activate();
						}));
					}
					
					if(obj['accounts'].length == 1 && obj['accounts'][0]['authenticated'] == "false"){
						var deleteAuther = new ListItem({
							style: "border: none",
							variableHeight:true
						})
						var del = domConstruct.create("div", {innerHTML: "Remove " + param + " app key", "class": "twitterOrangeDiv"});
						del.onclick = lang.hitch(this, function(){						
								var list = new EdgeToEdgeList({style:"margin-top:30px;border:none"})			
								obj.param = param;
								this.deleteServiceCred(obj);
									
								deleteAuther.domNode.appendChild(list.domNode);
								this.activate();
						}, obj,  param, deleteAuther)
						deleteAuther.domNode.appendChild(del);
						this.mainList.addChild(deleteAuther);
					}
					
					if(obj['accounts'].length == 1 && obj['accounts'][0]['authenticated'] == "true"){						
						var addAccount = new ListItem({
							style: "border:none",
							variableHeight:true
						})
						var add = domConstruct.create("div", {innerHTML: "Add a new " + param + " account", "class": "twitterOrangeDiv"});
						add.onclick = lang.hitch(this, function(){						
								var list = new EdgeToEdgeList({style:"margin-top:30px;border:none"})			
								
								this.makeAccountPane(obj, param, list);
									
								addAccount.domNode.appendChild(list.domNode);	
						}, obj,  param, addAccount)
						addAccount.domNode.appendChild(add);
						this.mainList.addChild(addAccount);
					}
				
					for(w = 0; w < obj['accounts'].length; w++){
						var item = new ListItem({
							style: "height:auto;border-top:none;border-bottom:none;border-left:5px solid " +obj['accounts'][w].color+ ";right:none"
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
						if(param == "google"){
							var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/googlePlusLogin.png>"});
						}
						
						var holderDiv = domConstruct.create("div", {style: "margin-top:15px"});
						
						var nameDiv = domConstruct.create("div", {});
						if(obj['accounts'][w].name != null || obj['accounts'][w].name != undefined){
							nameDiv.innerHTML = obj['accounts'][w].name;
						}else{
							var authURL = obj.auth;
							var auth = new Button({
								label: "Authenticate",
								onClick: lang.hitch(this, function(authURL){
									window.location = authURL+"&state=inside";
								}, authURL)
							})
							nameDiv.appendChild(auth.domNode);
							var msgDiv = domConstruct.create("div", {style:"overflow:visible;", innerHTML: "Make sure the correct account is logged in on this browser before authenticating."});
							nameDiv.appendChild(msgDiv);
						}
						
						obj['accounts'][w].param = param;
						if(obj['accounts'].length == 1 && obj['accounts'][0].authenticated == "false"){
							var delLabel = "Change Color";
						}else{
							var delLabel = "Delete";
						}
						var Delete = new Button({
							label: delLabel,
							onClick: lang.hitch(this, function(item, obj, param, w){
		
								this.deleteAccountCred(obj['accounts'][w]).then(lang.hitch(this, function(obj){
									if(obj['success']){
										item.destroyRecursive();
										this.activate();
									}else{
										if(obj['error']){
											this.errorItem.set("label", obj['error']);
										}else{
											this.errorItem.set("label", "An error has occurred trying to modfiy this account");
										}
									}
								}))
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
						
						var uuid = obj['accounts'][w].uuid
						var save = new Button({
							label: "Save",
							onClick: lang.hitch(this, function(){
								this.errorItem.set("label", "Saving...");
								
								if(colorPicker.get("value")== ""){
									console.log("Please choose color");
								}else{
									var colors = colorPicker.get("value");
									
									this.editServiceCreds(uuid, colors, param).then(lang.hitch(this, function(obj){
										console.log(obj);
										if(obj['error']){
											this.errorItem.set("label", obj['error']);
										}else{
											this.errorItem.set("label", obj['success']);
										}
									}));
									
								}
							}, uuid, colorPicker, param, color)
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
				}else{
					var addAccount = new ListItem({
						style: "border:none",
						variableHeight:true
					})
					var add = domConstruct.create("div", {innerHTML: "Add a new " + param + " app key", "class": "twitterOrangeDiv"});
					add.onclick = lang.hitch(this, function(){
						this.getDomain().then(lang.hitch(this, function(obj){
							this.domain = obj['domain'];
						
							var list = new EdgeToEdgeList({style:"margin-top:30px;border:none"})			
							
							this.makeAppPane(param, list);
								
							addAccount.domNode.appendChild(list.domNode);	
						}))
					}, param, addAccount)
					addAccount.domNode.appendChild(add);
					this.mainList.addChild(addAccount);
				}	
			},
			
			makeAccountPane: function(obj, param, list){
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
				if(param == "google"){
					var authFile = "/oAuth/googleAccess.php"
					var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/googlePlusLogin.png>"});
				}
				
				var textBoxDiv = domConstruct.create("span", {style:"float:left"});
				var holderDiv = domConstruct.create("div", {});
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
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				var save = new Button({
					label: "Save",
					onClick: lang.hitch(this, function(colorPicker, param){
						var color = colorPicker.get("value");
						var loginDisallow = "false";
						var authenticated = "false";
						this.saveNewAccount(color, loginDisallow, authenticated, param).then(lang.hitch(this, function(obj){
							console.log(obj);
							if(obj['error']){
								this.errorItem.set("label", obj['error']);
							}else{
								this.errorItem.set("label", obj['success']);
							}
							this.activate();
						}, colorPicker, param));
					}, colorPicker, param)
				})
				holderDiv.appendChild(save.domNode);	
				textBoxDiv.appendChild(holderDiv);
				
				item.domNode.appendChild(logoDiv);
				item.domNode.appendChild(textBoxDiv);
				
				list.addChild(item);
			},
			
			makeAppPane: function(param, list){
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
				if(param == "google"){
					var authFile = "/oAuth/googleAccess.php"
					var logoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/googlePlusLogin.png>"});
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
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(redirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				var add = new Button({
					label: "Add key",
					onClick: lang.hitch(this, function(key, secret, redirect, param){
						if(	key.get("value") == "" ||
							secret.get("value")== "" ||
							redirect.get("value")== "")
						{
							this.errorItem.set("label", "Please enter a value for all fields");
						}else{
							
							var appKey = key.get("value");
							var appSecret = secret.get("value");
							var appRedir = redirect.get("value");
							
							this.errorItem.set("label", "Saving...");						
							this.saveServiceCreds(appKey, appSecret, appRedir, param).then(lang.hitch(this, function(obj){
								console.log(obj);
								if(obj['error']){
									this.errorItem.set("label", obj['error']);
								}else{
									this.errorItem.set("label", obj['success']);
								}
								this.activate();
							}));
						}
					},key, secret, redirect, param)
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
