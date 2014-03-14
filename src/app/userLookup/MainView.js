/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the userLookup module
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
define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		
		'app/util/xhrManager',
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/RadioButton",
		"dojox/mobile/TextBox"
], function(declare, ModuleScrollableView, domConstruct, topic, lang, xhrManager, RoundRectList, ListItem, ToolBarButton, RadioButton, TextBox) {
	return declare([ModuleScrollableView], {		
		postCreate: function(){
			this.flushArray = [];
			this.listArray = [];	

			this.buildInitialPage();
			
			this.buildList();
			this.addChild(this.list);
		},
		
		buildInitialPage: function(){
			this.messageList = new RoundRectList({
				
			})
			this.messageItem = new ListItem({
				variableHeight: true,
				"class": "helpItemClass"
			})
			
			this.chooseList = new RoundRectList({
				
			})
			this.itemz = new ListItem({
				variableHeight: true,
				"class": "helpItemClass"
			})
			var radioTwitter = new RadioButton({
				checked: false,
				label: "Twitter",
				name: "service"
			})
			radioTwitter.on("click", lang.hitch(this, function(){ 
				this.messageItem.set("rightText", "Enter a username to search for a user");
			}))
			this.itemz.addChild(radioTwitter);
			this.flushArray.push(radioTwitter);
			var x = domConstruct.create("span", {innerHTML: "Twitter "});
			this.itemz.containerNode.appendChild(x);
			
			var radioInstagram = new RadioButton({
				checked: false,
				label: "Instagram",
				name: "service"
			})
			radioInstagram.on("click", lang.hitch(this, function(){ 
				this.messageItem.set("rightText", "Enter a username to search for a user");
			}))
			this.itemz.addChild(radioInstagram);
			this.flushArray.push(radioInstagram);
			x = domConstruct.create("span", {innerHTML: "Instagram "});
			this.itemz.containerNode.appendChild(x);
			
			var radioFace = new RadioButton({
				checked: false,
				label: "Facebook",
				name: "service"
			})
			radioFace.on("click", lang.hitch(this, function(){ 
				this.messageItem.set("rightText", "Enter the Facebook username you wish to look up");
			}))
			this.itemz.addChild(radioFace);
			this.flushArray.push(radioFace);
			x = domConstruct.create("span", {innerHTML: "Facebook "});
			this.itemz.containerNode.appendChild(x);
			
			//~ var radioLinked = new RadioButton({
				//~ checked: false,
				//~ label: "LinkedIn",
				//~ name: "service"
			//~ })
			//~ radioLinked.on("click", lang.hitch(this, function(){ 
				//~ this.messageItem.set("rightText", "Enter the last name of the user you wish to look up");
			//~ }))
			//~ this.itemz.addChild(radioLinked);
			//~ this.flushArray.push(radioLinked);
			//~ x = domConstruct.create("span", {innerHTML: "LinkedIn |"});
			//~ this.itemz.containerNode.appendChild(x);
			
			this.chooseList.addChild(this.itemz);
			this.addChild(this.chooseList);				
			
			this.messageList.addChild(this.messageItem);
			this.addChild(this.messageList);
		},
		
		buildList: function(){
			this.list = new RoundRectList({
				
			});
			this.item = new ListItem({
				variableHeight: true,
				"class": "helpItemClass"
			});
			this.contactBox = new TextBox({
				textbox: "yes",
				name: "contactBox",
				placeHolder: "Enter Facebook Username or ID"
			});
			this.item.addChild(this.contactBox);
			this.button = new ToolBarButton({
				label: "Get User",
				onClick: lang.hitch(this, function(){
					for(var p = 0; p < this.flushArray.length; p++){
						if(this.flushArray[p].checked == true){
							var service = this.flushArray[p].get("label");
						}
					}
					if(this.contactBox.get("value") != "" && service != undefined){
						var name = this.contactBox.get("value");
						
						this.getUser(name, service).then(lang.hitch(this, function(obj){
							while(this.listArray.length != 0){
								this.listArray.pop().destroyRecursive();
							}
							this.populateResponse(obj, service);
						}));
					}else{
						this.messageItem.set("label", "Enter a Username/ID and choose a service");
					}
				})
			})
			this.item.addChild(this.button);
			this.list.addChild(this.item);
		},
		
		populateResponse: function(obj, service){	
			this.messageItem.set("label", "");				
			this.messageItem.set("rightText", "");	
		
			if(service == "Facebook"){
				if(obj.Error){
					var holder = new RoundRectList({
					
					})
					this.listArray.push(holder);
					
					var item = new ListItem({
						variableHeight: true,
						label: obj.Error,
						"class": "helpItemClass"
					})
					holder.addChild(item);
					
					this.addChild(holder);
				}else{
					var friendInfo;
					var k = Object.keys(obj);
					var holder = new RoundRectList({
					
					})
					this.listArray.push(holder);
					for(i=0; i<k.length; i++){
						if(k[i] == "searchable"){
							continue;
						}else{
							var item = new ListItem({
								variableHeight: true,
								label: k[i] + " : " + obj[k[i]],
								"class": "helpItemClass"
							})
							holder.addChild(item);
						}
					}
					var item = new ListItem({
						variableHeight: true,
						"class": "helpItemClass"							
					})
					var button = new ToolBarButton({
						label: "Add " + ((obj['name'].length ==0)? "this person" : obj['name']) + " to your contacts",
						onClick: lang.hitch(this, this.saveAndCheck, obj, item, service)
					})
					item.addChild(button);
					holder.addChild(item);
					this.addChild(holder);
				}
			}else if(service == "Instagram"){
				if(!obj || obj.Error){
					var holder = new RoundRectList({
					
					})
					this.listArray.push(holder);
					
					var item = new ListItem({
						variableHeight: true,
						label: "No users were found with that name",
						"class": "helpItemClass"
					})
					holder.addChild(item);
					
					this.addChild(holder);
				}else{
					var friendInfo;
					for(var d = 0; d < obj.length; d++){
						var k = Object.keys(obj[d]);
						var holder = new RoundRectList({
						
						})
						this.listArray.push(holder);
						for(i=0; i<k.length; i++){
							if(k[i] == "searchable"){
								continue;
							}else{
								var item = new ListItem({
									variableHeight: true,
									label: k[i] + " : " + obj[d][k[i]],
									"class": "helpItemClass"
								})
								holder.addChild(item);
							}
						}
						var item = new ListItem({	
							variableHeight: true,
							"class": "helpItemClass"								
						})
						var button = new ToolBarButton({
							label: "Add " + ((obj[d]['name'].length ==0)? "this person" : obj[d]['name']) + " to your contacts",
							onClick: lang.hitch(this, this.saveAndCheck, obj[d], item, service)
						})
						item.addChild(button);
						holder.addChild(item);
						this.addChild(holder);
					}
				}
			}else if(service == "Twitter"){
				if(obj.Error){
					var holder = new RoundRectList({
					
					})
					this.listArray.push(holder);
					
					var item = new ListItem({
						variableHeight: true,
						label: obj.Error,
						"class": "helpItemClass"
					})
					holder.addChild(item);
					
					this.addChild(holder);
				}else{
					var friendInfo;
					for(var d = 0; d < obj.length; d++){
						var k = Object.keys(obj[d]);
						var holder = new RoundRectList({
						
						})
						this.listArray.push(holder);
						for(i=0; i<k.length; i++){
							if(k[i] == "searchable"){
								continue;
							}else{
								var item = new ListItem({
									variableHeight: true,
									label: k[i] + " : " + obj[d][k[i]],
									"class": "helpItemClass"
								})
								holder.addChild(item);
							}
						}
						var item = new ListItem({	
							variableHeight: true,
							"class": "helpItemClass"								
						})
						var button = new ToolBarButton({
							label: "Add " + ((obj[d]['name'].length ==0)? "this person" : obj[d]['name']) + " to your contacts",
							onClick: lang.hitch(this, this.saveAndCheck, obj[d], item, service)
						})
						item.addChild(button);
						holder.addChild(item);
						this.addChild(holder);
					}
				}
			}else if(service == "LinkedIn"){
				if(obj.Error){
					var holder = new RoundRectList({
					
					})
					this.listArray.push(holder);
					
					var item = new ListItem({
						variableHeight: true,
						label: obj.Error,
						"class": "helpItemClass"
					})
					holder.addChild(item);
					
					this.addChild(holder);
				}else{
					for(var d = 0; d < obj.length; d++){
						var k = Object.keys(obj[d]);
						var holder = new RoundRectList({
						
						})
						this.listArray.push(holder);
						for(i=0; i<k.length; i++){
							if(k[i] == "searchable"){
								continue;
							}else{
								var item = new ListItem({
									variableHeight: true,
									label: k[i] + " : " + obj[d][k[i]],
									"class": "helpItemClass"
								})
								holder.addChild(item);
							}
						}
						var item = new ListItem({
							variableHeight: true,
							"class": "helpItemClass"
						})
						var button = new ToolBarButton({
							label: "Add " + ((obj[d]['name'].length ==0)? "this person" : obj[d]['name']) + " to your contacts",
							onClick: lang.hitch(this, this.saveAndCheck, obj[d], item, service)
						})
						item.addChild(button);
						holder.addChild(item);
						this.addChild(holder);
					}
				}
			}
			this.resize();
		},
		
		//anything that gets put after the function in lang.hitch moves all args down one and puts itself at the begining.
		saveAndCheck: function(obj, item, service){
			
			var name = obj['name'];
			var friendInfo = obj['name'] + ":" + service + ":" + obj['searchable'];
			var taken = "false";
			
			console.log(friendInfo);
			
			var k = Object.keys(this.dataObj);
			for(var i=0; i<k.length; i++){
				if(name == k[i]){
					taken = "true";
				}else{
					continue;
				}
			}
			
			if(taken == "true"){
				item.set("rightText", "Contact already saved / Name taken");
			}else{							
				this.dataObj[name] = [];
				this.dataObj[name].push(friendInfo);
				
				this.onSave(this.dataObj);
				item.set("rightText", "Contact saved");
			}
		},
		
		flush: function(){
			for(var p = 0; p < this.flushArray.length; p++){
				if(this.flushArray[p].name){
					this.flushArray[p].set("checked", false);
				}
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Find a user"} );
			
			this.contactBox.set("value", "");
			this.flush();
			this.messageItem.set("rightText", "");
			this.messageItem.set("label", "");
			while(this.listArray.length != 0){
				this.listArray.pop().destroyRecursive();
			}
			
			
		}
		
	})
});