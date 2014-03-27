/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the contactView for the manContacts module
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
		
		'app/util/xhrManager',
		"app/TitleBar",
		
		"dojox/mobile/ScrollableView",
		"app/SelRoundRectList",
		"dojox/mobile/ListItem",
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
	
	xhrManager,
	TitleBar,
	
	ScrollableView,
	RoundRectList,
	ListItem,
	ToolBarButton,
	EdgeToEdgeCategory,
	RadioButton
) {
	return declare([ModuleScrollableView], {		

		buildMainList: function(obj){
			this.mainList = new RoundRectList({
				style: "border: none"
			});
			this.addChild(this.mainList);
		},
		
		getSize: function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		},

		buildList: function(mainUser, ownedUsers){
			console.log("mainUser", mainUser);
			console.log("ownedUsers", ownedUsers);
			var listGroup = [];
		
			var services = {};
			var serviceObj = {};
				
			var mainID = mainUser.data.id.split("-----");
			services[mainID[0]] = 1;
				
			if(mainUser.data.owns.length > 0){
				for(var t = 0; t < mainUser.data.owns.length; t++){
					var tempArr = mainUser.data.owns[t].split("-----");
					services[tempArr[0]] = 1;
				}
			}
			
			var k = Object.keys(services);
			for(var f = 0; f < k.length; f++){
				serviceObj[k[f]] = "";
			}
			
			var item = domConstruct.create("div", {innerHTML: mainUser.data.displayName, "class": "divListItem"});

			this.mainList.domNode.appendChild(item);

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

			//OWNED PEOPLE NOW
			
			for(var y = 0; y < ownedUsers.length; y++){
				var oneTabList = new RoundRectList({
					style: "margin: 0px 0px 0px 20px"
				});

				var serviceObj = {};
				var services = {};
					
				var mainID = ownedUsers[y].data.id.split("-----");
				services[mainID[0]] = 1;
					
				if(ownedUsers[y].data.owns.length > 0){
					for(var t = 0; t < ownedUsers[y].data.owns.length; t++){
						var tempArr = ownedUsers[y].data.owns[t].split("-----");
						services[tempArr[0]] = 1;
					}
				}
				
				var k = Object.keys(services);
				for(var f = 0; f < k.length; f++){
					serviceObj[k[f]] = "";
				}
				
				var item = domConstruct.create("div", {innerHTML: ownedUsers[y].data.displayName, "class": "divListItem"});

				oneTabList.domNode.appendChild(item);

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
				
				var div = domConstruct.create("div", {style:"layout:left"});
				var unMergeButton = new ToolBarButton({
					label: "UnMerge",
					style: "float:left;",
					onClick: lang.hitch(this, function(ownedUsers, y){						
						this.unMergeFriends([mainUser.data.id, ownedUsers[y].data.id]).then(lang.hitch(this, this.activate));
					}, ownedUsers, y)
				});
				item.appendChild(unMergeButton.domNode);
				
				this.mainList.addChild(oneTabList);
			}
			
			var category = new EdgeToEdgeCategory({
				label: "Settings",
				"class": "contactsManCategoryClass"
			});
			this.mainList.addChild(category);
			var item = new ListItem({
				variableHeight: true,
				clickable: true,
				label: "Merge with other contacts",
				style: "border: 1px solid",
				onClick: lang.hitch(this, function(){
					this.router.go("/MergeView/" + this.users[0]);
				})
			})
			this.mainList.addChild(item);
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/manContacts', title: "View contact"} );
			
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.buildMainList();
			}else{
				this.buildMainList();
			}
			if(!this.users){
				window.location = "#/manContacts";
			}else{
				this.getSpecificClients(this.users).then(lang.hitch(this, function(obj){
					for(y = 0; y < obj.length; y++){
						//get each group of owned users
						var ownsArray = [];
						//set the main user from MainView
						for(var x = 0; x < obj[y].data.owns.length; x++){
							ownsArray.push(obj[y].data.owns[x]);
						}
						var mainUser = obj[y];
						this.getSpecificClients(ownsArray).then(lang.hitch(this, function(mainUser, obj){
							var mainUser = mainUser;
							//set the ownedUsers for each MainView user
							var ownedUsers = obj;
							//build and return a list for each user/ownedGroup
							var list = this.buildList(mainUser, ownedUsers);
						}, mainUser))
					}
				}))
			}
		}
	})
});