/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines mainView for the findContacts module
** This Module is DEPRECATED
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
		"dojo/store/Memory",
		
		"dojox/mobile/ComboBox",
		
		'app/util/xhrManager',
		'app/TitleBar',
		
		"app/SelRoundRectList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
], function(declare, ModuleScrollableView, domConstruct, topic, lang, Memory, ComboBox, xhrManager, TitleBar, RoundRectList, Button, ListItem, ToolBarButton, EdgeToEdgeCategory) {
	return declare([ModuleScrollableView], {		
		
		buildView: function(){
			this.searchList = new RoundRectList({
				
			});
			this.item = new ListItem({
				variableHeight: true
			})
			
			this.contacts = new Memory({
				data: []
			});
			this.searchButton = new Button({
				label: "Search",
				style: "height: 20px; line-height: 20px",
				onClick: lang.hitch(this, function(){
					this.getSuggestionsButton(this.comboBox.get("value")).then(lang.hitch(this, function(obj){
						this.buildList(obj);
					}));
				})
			});
			
			this.comboBox = new ComboBox({
				store: this.contacts,
				placeHolder: "search here",
				intermediateChanges: true,
				style: "width: 150px;",
				onChange: lang.hitch(this, function(){
					this.getSuggestions(this.comboBox.get("value")).then(lang.hitch(this, function(obj){
						var dataList = [];
						var k = Object.keys(obj);
						console.log("obj", obj);
						console.log("k", k);
						for(var i=0; i<k.length; i++){
							dataList[i] = {"name" : k[i]};
						}
						console.log(dataList);
						this.comboBox.store = new Memory({data:dataList});
					}));
				})
			});
			
			this.item.addChild(this.comboBox);
			this.item.addChild(this.searchButton);
			this.searchList.addChild(this.item);
			this.addChild(this.searchList);
		},
		
		buildList: function(obj){
			console.log(obj);
			this.objects = obj;
			if(this.list){
				this.list.destroyRecursive();
			}
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
				objID: this.objects[name].data.id,
				onClick: lang.hitch(this, function(){
					this.contactView.users = [];
					this.contactView.users.push(this.objects[name].data.id);
					this.router.go("/ContactView");
				})
			});*/

			var item = domConstruct.create("div", {innerHTML: name, "class": "divListItem"});

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

			item.onclick = lang.hitch(this, function(){
				this.contactView.users = [];
				this.contactView.users.push(item.objID);
				this.router.go("/ContactView");
			});
		},
		
		deactivate: function(){
			if(this.searchList){
				this.searchList.destroyRecursive();
			}
			if(this.list){
				this.list.destroyRecursive();
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Find a contact"} );
			
			if(this.searchList){
				console.log("BOOM: made new list");
				this.searchList.destroyRecursive();
				this.buildView();
			}else{
				console.log("made new list");
				this.buildView();
			}
			
		}
		
	})
});