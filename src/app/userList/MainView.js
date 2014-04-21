/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainList of the userList module
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
		"dojo/dom-class",
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		"dojo/on",
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/SelectorBar',
		
		"app/SelRoundRectList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
], function(
	declare, 
	ModuleScrollableView, 
	domClass,
	domConstruct, 
	topic, 
	lang,
	on,
	domGeom,

	xhrManager, 
	SelectorBar,
	
	RoundRectList, 
	Button, 
	ListItem, 
	ToolBarButton, 
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		currentSelector: "recent",
		
		buildList: function(obj){
			console.log(obj);
			this.counter = 0;
			this.objects = obj;
			
			this.selectorList = new RoundRectList({
				style: "margin-top:50px; border:none"
			})
			this.addChild(this.selectorList);
			
			if(!this.selectorItem){
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

				this.selectButton = new Button({
					"name": "goButton",
					onClick: lang.hitch(this, function(selectorItem){
						this.UserView.users = [];
						var kids = this.list.domNode.children;
					
						for(var g = 0; g < kids.length; g++){
							if(kids[g].checked == true){
								this.UserView.users.push(kids[g].objID);
							}				
						}

						if(this.UserView.users.length > 0){
							this.selectorItem.destroyRecursive();
							this.selectorItem = null;
							this.router.go("/UserView");
						}else{
							console.log("Must have at least one user selected to view");
						}
					})
				});

				this.alphaButton = new Button({
					"name": "alphaButton",
					"left": "true",
					onClick: lang.hitch(this, function(){
						this.list.destroyRecursive();
						this.fromVar = 0;
						this.currentSelector = "alpha",
						this.getAlphaContacts(this.fromVar).then(lang.hitch(this,this.buildList));
					})
				});

				this.chattyButton = new Button({
					"name": "chattyButton",
					"left": "true",
					onClick: lang.hitch(this, function(){
						this.list.destroyRecursive();
						this.fromVar = 0;
						this.currentSelector = "chatty",
						this.getChattyContacts(this.fromVar).then(lang.hitch(this,this.buildList));
					})
				});

				this.secondButton = new Button({
					"name": "secondButton",
					"left": "true",
					onClick: lang.hitch(this, function(){
						this.list.destroyRecursive();
						this.fromVar = 0;
						this.currentSelector = "second",
						this.getSecondFriendContacts(this.fromVar).then(lang.hitch(this, this.buildList));
					})
				});

				this.recentButton = new Button({
					"name": "recentButton",
					"left": "true",
					onClick: lang.hitch(this, function(){
						this.list.destroyRecursive();
						this.fromVar = 0;
						this.currentSelector = "recent",
						this.getRecentContacts(this.fromVar).then(lang.hitch(this, this.buildList));
					})
				});

				this.selectorItem = new SelectorBar({
					buttons: [this.chattyButton, this.alphaButton, this.recentButton, this.secondButton, this.scrollButton, this.selectButton]
				});
				this.selectorItem.placeAt(this.domNode.parentNode);
			}
			
			this.list = new RoundRectList({
				select: "multiple",
				onCheckStateChanged: lang.hitch(this, function(){
					this.counter = 0;
					if(arguments[1] == true){
						this.counter++;
					}else{
						this.counter--;
					}
					var kids = this.list.getChildren();
					for(var g = 0; g < kids.length; g++){
						if(kids[g].checked == true){
							this.counter++;
						}
					}
				})
			});
			this.addChild(this.list);
			
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addDelButtons(k[i]);
			}
			
			this.getNextGroup();
		},
		
		postAddDelButtons: function(obj){
			this.objects = obj;
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addDelButtons(k[i]);
			}
		},
		
		addDelButtons: function(name){
			var serviceStr = '';
			var services = {};
			var serviceObj = {};
				
			var mainID = this.objects[name].data.id.split("-----");
			services[mainID[0]] = 1;
				
			if(this.objects[name].data.owns.length > 0){
				for(var t = 0; t < this.objects[name].data.owns.length; t++){
					var tempArr = this.objects[name].data.owns[t].split("-----");
					services[tempArr[0]] = 1;
				}
			}
			
			var k = Object.keys(services);
			for(var f = 0; f < k.length; f++){
				serviceObj[k[f]] = ""; 
			}
			
			/*var item = new ListItem({
				variableHeight: true,
				label: name,
				"class": "contactsManItemClass",
				objID: this.objects[name].data.id
			});*/
			
			if(this.objects[name]['data']['post']['totalPosts'] > 1 || this.objects[name]['data']['post']['totalPosts'] == 0){
				var item = domConstruct.create("div", {innerHTML: name + " (" + this.objects[name]['data']['post']['totalPosts'] + " posts)", "class": "divListItemExtraPadding"});
			}else{
				var item = domConstruct.create("div", {innerHTML: name + " (" + this.objects[name]['data']['post']['totalPosts'] + " post)", "class": "divListItemExtraPadding"});
			}
			item.objID = this.objects[name].data.id;

			this.list.domNode.appendChild(item);

			var iconDiv = domConstruct.create("div", {style: "float:right", "class": "serviceIcon2"});
			
			if('Facebook' in serviceObj){
				var divFacebook = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Facebook_logo.png>"});
				iconDiv.appendChild(divFacebook);
			}
			if('Twitter' in serviceObj){
				var divTwitter = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Twitter_logo_blue_small.png>"});
				iconDiv.appendChild(divTwitter);
			}
			if('Instagram' in serviceObj){
				var divInstagram = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Instagram_logo.png>"});
				iconDiv.appendChild(divInstagram);
			}
			if('Linkedin' in serviceObj){
				var divLinkedIn = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/LinkedIn_logo.png>"});
				iconDiv.appendChild(divLinkedIn);
			}
			if('Google' in serviceObj){
				var divGoogle = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/googlePlus_icon.png>"});
				iconDiv.appendChild(divGoogle);
			}

			item.appendChild(iconDiv);

			item.checked = false;

			item.onclick = lang.hitch(item, function(){
				if(item.checked == false){
					this.divCheck = domConstruct.create("div", {"class": "checkIcon", innerHTML: "<img src=app/resources/img/checkmark_small.png>"});

					item.appendChild(this.divCheck);

					item.checked = true;
				}else{
					item.removeChild(this.divCheck);

					item.checked = false;
				}
			});
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);
			
			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			if(this.currentSelector == "alpha"){
				this.getAlphaContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddDelButtons));
			}
			if(this.currentSelector == "chatty"){
				this.getChattyContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddDelButtons));
			}
			if(this.currentSelector == "recent"){
				this.getRecentContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddDelButtons));
			}
			if(this.currentSelector == "second"){
				this.getSecondFriendContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddDelButtons));
			}
		},
		
		deactivate: function(){
			//get rid of anything on transition out
			if(this.list){
				this.removeChild(this.list);
				this.list.destroyRecursive();	
			}
			
			document.body.onkeydown = "";
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/', title: "Select users to view posts"} );
			
			this.fromVar = 0;
			if(this.list){
				console.log("List exists, transitioning to last place now");
				
				this.list.destroyRecursive();
				this.selectorList.destroyRecursive();
				console.log("BOOM: made new list");
				this.getRecentContacts(this.fromVar).then(lang.hitch(this,this.buildList));
			}else{
				console.log("No list made, making one now");
				
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
				console.log("made new list");
				this.getRecentContacts(this.fromVar).then(lang.hitch(this,this.buildList));
			}

			document.body.onkeydown = lang.hitch(this, function(event){
				switch(event.keyCode){
					case 13: 
						this.selectButton.onClick();			
					break;
					default: 
					break;
				}
			});
		}
	})
});