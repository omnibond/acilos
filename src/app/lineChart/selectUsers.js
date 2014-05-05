/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the selectUsersView for the lineChart module
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
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		"dojo/_base/connect",
		"dojo/on",
		"dojo/_base/event",
		"dojo/mouse",
		'dojo/_base/kernel',
		'dojo/dom-geometry',
		'dojo/dom-class',
		
		'dojo-mama/views/ModuleScrollableView',
		
		'app/util/xhrManager',
		'app/SelectorBar',
		'app/TitleBar',
		
		"dojox/mobile/sniff",
		"app/SelRoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
	], function(	
		declare, 
		domConstruct, 
		topic, 
		lang, 
		connect,
		on,
		event,
		mouse,
		kernel,
		domGeom,
		domClass,
		
		ModuleScrollableView,
		
		xhrManager, 
		SelectorBar,
		TitleBar,
			
		has,
		RoundRectList, 
		ListItem, 
		Button, 
		ToolBarButton, 
		EdgeToEdgeCategory
		) {
			
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		currentSelector: "chatty",
		
		deactivate: function(){
			if(this.selectorBar){
				this.selectorBar.destroyRecursive();
				this.selectorBar = null;
			}

			this.list.destroyRecursive();
			this.list = null;

			document.body.onkeydown = '';
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/lineChart', title: "Select Users"} );
			this.fromVar = 0;

			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));

			this.buildTopList();
			
			//this.getChattyContacts(this.fromVar).then(lang.hitch(this,this.buildList));

			document.body.onkeydown = lang.hitch(this, function(event){
				switch(event.keyCode){
					case 13: 
						this.goBut.onClick();
					break;
					default: 
				}
			});
		},
		
		buildList: function(data){
			console.log(data);
			this.counter = 0;
			this.objects = data;
			
			this.scrollBut = new Button({
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

			this.alphaButton = new Button({
				"name": "alphaButton",
				"left": "true",
				onClick: lang.hitch(this, function(){
					this.list.destroyRecursive();
					this.list = null;
					this.selectorBar.destroyRecursive();
					this.selectorBar = null;
					this.fromVar = 0;
					this.currentSelector = "alpha",
					this.getContacts(this.fromVar).then(lang.hitch(this,this.buildList));
				})
			});

			this.chattyButton = new Button({
				"name": "chattyButton",
				"left": "true",
				onClick: lang.hitch(this, function(){
					this.list.destroyRecursive();
					this.list = null;
					this.selectorBar.destroyRecursive();
					this.selectorBar = null;
					this.fromVar = 0;
					this.currentSelector = "chatty",
					this.getChattyContacts(this.fromVar).then(lang.hitch(this,this.buildList));
				})
			});

			this.topContactsButton = new Button({
				"name": "topContactsButton",
				"left": "true",
				onClick: lang.hitch(this, function(){
					this.list.destroyRecursive();
					this.list = null;
					this.selectorBar.destroyRecursive();
					this.selectorBar = null;
					this.fromVar = 0;
					this.currentSelector = "top",
					this.buildTopList();
				})
			});
			
			this.goBut = new Button({
				"name": "goButton",
				onClick: lang.hitch(this, function(){
					this.userLineChartView.users = [];
					var kids = this.list.domNode.children;
				
					for(var g = 0; g < kids.length; g++){
						if(kids[g].checked == true){
							this.userLineChartView.users.push(kids[g].objID);
						}				
					}

					if(this.userLineChartView.users.length > 0){
						this.router.go("/userLineChartView");
					}else{
						console.log("Must have at least one user selected to view");
					}
				})
			});
			
			this.selectorBar = new SelectorBar({
				buttons: [this.chattyButton, this.alphaButton, this.topContactsButton, this.scrollBut, this.goBut]
			})
			this.selectorBar.placeAt(this.domNode.parentNode);
				
			
			this.list = new RoundRectList({
				select: "multiple",
				style: "margin-top:40px",
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
			})
			this.addChild(this.list);
			
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addListItems(k[i]);
			}
		
		},

		buildTopList: function(data){
			console.log("OUR DATA IS: ", data);
			
			this.scrollBut = new Button({
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

			this.alphaButton = new Button({
				"name": "alphaButton",
				"left": "true",
				onClick: lang.hitch(this, function(){
					this.list.destroyRecursive();
					this.list = null;
					this.selectorBar.destroyRecursive();
					this.selectorBar = null;
					this.fromVar = 0;
					this.currentSelector = "alpha",
					this.getContacts(this.fromVar).then(lang.hitch(this,this.buildList));
				})
			});

			this.chattyButton = new Button({
				"name": "chattyButton",
				"left": "true",
				onClick: lang.hitch(this, function(){
					this.list.destroyRecursive();
					this.list = null;
					this.selectorBar.destroyRecursive();
					this.selectorBar = null;
					this.fromVar = 0;
					this.currentSelector = "chatty",
					this.getChattyContacts(this.fromVar).then(lang.hitch(this,this.buildList));
				})
			});

			this.topContactsButton = new Button({
				"name": "topContactsButton",
				"left": "true",
				onClick: lang.hitch(this, function(){
					this.list.destroyRecursive();
					this.list = null;
					this.selectorBar.destroyRecursive();
					this.selectorBar = null;
					this.fromVar = 0;
					this.currentSelector = "top",
					this.buildTopList();
				})
			});
			
			this.goBut = new Button({
				"name": "goButton",
				onClick: lang.hitch(this, function(){
					this.userLineChartView.users = [];
					var kids = this.list.domNode.children;
				
					for(var g = 0; g < kids.length; g++){
						if(kids[g].checked == true){
							this.userLineChartView.users.push(kids[g].objID);
						}				
					}

					if(this.userLineChartView.users.length > 0){
						this.router.go("/userLineChartView");
					}else{
						console.log("Must have at least one user selected to view");
					}
				})
			});
			
			this.selectorBar = new SelectorBar({
				buttons: [this.chattyButton, this.alphaButton, this.topContactsButton, this.scrollBut, this.goBut]
			});
			this.selectorBar.placeAt(this.domNode.parentNode);
				
			this.list = new RoundRectList({
				style: "margin-top:40px"
			});
			this.addChild(this.list);

			var item = domConstruct.create("div", {innerHTML: "Top 20 Posters", "class": "divListItemExtraPadding"});
			this.list.domNode.appendChild(item);
			item.onclick = lang.hitch(this, function(){
				this.getTopContacts(20).then(lang.hitch(this, function(obj){
					this.userLineChartView.users = obj;
					this.userLineChartView.names = "false";
					if(this.userLineChartView.users.length > 0){
						this.router.go("/userLineChartView");
					}else{
						console.log("Must have at least one user selected to view");
					}
				}));
			});

			var item = domConstruct.create("div", {innerHTML: "Top 15 Posters", "class": "divListItemExtraPadding"});
			this.list.domNode.appendChild(item);
			item.onclick = lang.hitch(this, function(){
				this.getTopContacts(15).then(lang.hitch(this, function(obj){
					this.userLineChartView.users = obj;
					this.userLineChartView.names = "false";
					if(this.userLineChartView.users.length > 0){
						this.router.go("/userLineChartView");
					}else{
						console.log("Must have at least one user selected to view");
					}
				}));
			});

			var item = domConstruct.create("div", {innerHTML: "Top 10 Posters", "class": "divListItemExtraPadding"});
			this.list.domNode.appendChild(item);
			item.onclick = lang.hitch(this, function(){
				this.getTopContacts(10).then(lang.hitch(this, function(obj){
					this.userLineChartView.users = obj;
					this.userLineChartView.names = "true";
					if(this.userLineChartView.users.length > 0){
						this.router.go("/userLineChartView");
					}else{
						console.log("Must have at least one user selected to view");
					}
				}));
			});

			var item = domConstruct.create("div", {innerHTML: "Top 5 Posters", "class": "divListItemExtraPadding"});
			this.list.domNode.appendChild(item);
			item.onclick = lang.hitch(this, function(){
				this.getTopContacts(5).then(lang.hitch(this, function(obj){
					this.userLineChartView.users = obj;
					this.userLineChartView.names = "true";
					if(this.userLineChartView.users.length > 0){
						this.router.go("/userLineChartView");
					}else{
						console.log("Must have at least one user selected to view");
					}
				}));
			});
		},
		
		postAddListItems: function(obj){
			this.objects = obj;
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addListItems(k[i]);
			}
		},
		
		addListItems: function(name){
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
				this.getContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddListItems));
			}
			if(this.currentSelector == "chatty"){
				this.getChattyContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddListItems));
			}
		}
	})
});
