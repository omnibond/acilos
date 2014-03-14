/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mergeView for the manContacts module
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
		"dojo/on",
		"dojo/dom-style",
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/SelectorBar',
		'app/TitleBar',
		
		"dojox/mobile/ScrollableView",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/RadioButton"
], function(
	declare,
	ModuleScrollableView,
	domConstruct,
	topic,
	lang,
	on,
	domStyle,
	domGeom,
	
	xhrManager,
	SelectorBar,
	TitleBar,
	
	ScrollableView,
	RoundRectList,
	ListItem,
	Button,
	ToolBarButton,
	EdgeToEdgeCategory,
	RadioButton
) {
	return declare([ModuleScrollableView], {	
		style: "overflow:scroll",
		
		buildView: function(obj){
			console.log(obj);
			this.objects = obj;
			this.list = new RoundRectList({
				
			});
			this.addChild(this.list);
			
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				if(k[i] != ""){
					this.addDelButtons(k[i]);
				}
			}
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);
			
			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			this.getContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddDelButtons));
		},
		
		postAddDelButtons: function(obj){
			this.objects = obj;
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addDelButtons(k[i]);
			}
		},
		
		buildView: function(obj){
			console.log(obj);
			this.objects = obj;
			this.list = new RoundRectList({
				select: "multiple",
				style: "margin-top:45px"
			});
			this.addChild(this.list);
			
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				if(k[i] != "" && this.objects[k[i]].data.id != this.currentUser){
					this.addDelButtons(k[i]);
				}
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
				clickable: true,
				label: name,
				"class": "contactsManItemClass",
				objID: this.objects[name].data.id
			});*/

			var item = domConstruct.create("div", {innerHTML: name, "class": "divListItemExtraPadding"});
			
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
		
		buildSelectorBar: function(){
			this.goButton = new Button({
				"name": "mergeButton",
				onClick: lang.hitch(this, function(){
					var mergeArr = [];
					mergeArr.push(this.currentUser);
					var kids = this.list.domNode.children;
					for(var g = 0; g < kids.length; g++){
						if(kids[g].checked == true){
							mergeArr.push(kids[g].objID);
						}
					}
					this.mergeFriends(mergeArr).then(lang.hitch(this, function(obj){
						this.contactView.users = [];
						this.contactView.users.push(this.currentUser);
						this.router.go("/ContactView");
					}))
				})
			});

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
			
			this.selectorBar = new SelectorBar({
				buttons: [this.scrollButton, this.goButton]
			})
			this.selectorBar.placeAt(this.domNode.parentNode);
			
		},
		
		deactivate: function(){
			//get rid of anything on transition out
			this.selectorBar.destroyRecursive();
			this.removeChild(this.list);
			this.list.destroyRecursive();
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/manContacts', title: "Manage your contacts"} );
			
			this.fromVar = 0;
			
			this.currentUser = e.params.id;
			
			if(this.selectorBar){
				this.selectorBar.destroyRecursive();
				this.buildSelectorBar();
			}else{
				this.buildSelectorBar();
			}
			
			if(this.list){
				console.log("BOOM: made new list");
				this.list.destroyRecursive();
				this.getContacts(this.fromVar).then(lang.hitch(this,this.buildView));
			}else{
				console.log("No list made, making one now");
				
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
				console.log("made new list");
				this.getContacts(this.fromVar).then(lang.hitch(this,this.buildView));
			}
			
		}
		
	})
});
		