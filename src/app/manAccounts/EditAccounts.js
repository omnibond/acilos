/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the editAccounts for the manAccounts module
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
		"dojox/mobile/RoundRectList",
		"dojox/mobile/EdgeToEdgeList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",
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
		GridLayout,
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
						style: "height:auto;border-left:none;right:none"
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
					
					var key = new TextBox({
						value: obj[param][w]['key'],
						disabled: true
					})
					var secret = new TextBox({
						value: obj[param][w]['secret'],
						disabled: true
					})
					var redirect = new TextBox({
						value: obj[param][w]['redir'],
						disabled: true
					})
					
					var textBoxDiv = domConstruct.create("span", {style:"float:left"});
					var holderDiv = domConstruct.create("div", {});
					holderDiv.appendChild(key.domNode);
					textBoxDiv.appendChild(holderDiv);
						
					obj[param][w].param = param;
					var Delete = new Button({
						label: "Delete",
						onClick: lang.hitch(this, function(item, obj, param, w){
	
							this.deleteServiceCred(obj[param][w]);
							item.destroyRecursive();
						}, item, obj, param, w)
					})
					holderDiv.appendChild(Delete.domNode);
						
					holderDiv = domConstruct.create("div", {});
					holderDiv.appendChild(secret.domNode);
					textBoxDiv.appendChild(holderDiv);
					var colorPicker = new ColorPicker({});
					var y = "";
					var color = new Button({
						label: "Color",
						style: "background:" + obj[param][w]['color']
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
									whiteoutDiv = null;
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
					var save = new Button({
						label: "Save",
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
								
								this.editServiceCreds(appKey, appSecret, appRedir, colors, param).then(lang.hitch(this, function(obj){
									console.log(obj);
									if(obj['error']){
										this.errorItem.set("label", obj['error']);
									}else{
										this.errorItem.set("label", obj['success']);
									}
								}));
								
							}
						},key, secret, redirect, colorPicker, param, color)
					})
					holderDiv.appendChild(save.domNode);
					
					item.domNode.appendChild(logoDiv);
					item.domNode.appendChild(textBoxDiv);
					
					this.mainList.addChild(item);
				}
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
