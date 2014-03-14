/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines contactView for the findContacts module
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
		"dojo/on",
		"dojo/dom-style",
		
		'app/util/xhrManager',
		"app/TitleBar",
		
		"dojox/mobile/ScrollableView",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
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
	Button,
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
		
		buildList: function(mainUser, ownedUsers){
			console.log("mainUser", mainUser);
			console.log("ownedUsers", ownedUsers);
			var listGroup = [];
		
			var noTabList = new RoundRectList({
				style: "margin: 0px 0px 0px 0px"
			});
			
			var serviceStr = '';
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
			
			var displayName = new ListItem({
				variableHeight: true,
				label: mainUser.data.displayName,
				rightText: serviceStr,
				style: "border-bottom:none;padding: 0px 5px"
			})
			noTabList.addChild(displayName);

			if('Facebook' in serviceObj){
				var divFacebook = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Facebook_logo.png>"});
				displayName.domNode.appendChild(divFacebook);
			}
			if('Twitter' in serviceObj){
				var divTwitter = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Twitter_logo_blue_small.png>"});
				displayName.domNode.appendChild(divTwitter);
			}
			if('Instagram' in serviceObj){
				var divInstagram = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Instagram_logo.png>"});
				displayName.domNode.appendChild(divInstagram);
			}
			if('Linkedin' in serviceObj){
				var divLinkedIn = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/LinkedIn_logo.png>"});
				displayName.domNode.appendChild(divLinkedIn);
			}

			if(mainUser.data.about.description != ""){
				var description = new ListItem({
					variableHeight: true,
					label: "Bio: " + mainUser.data.about.description,
					style: "border-bottom:none;padding: 0px 5px"				
				})
				noTabList.addChild(description);
			}
			if(mainUser.data.about.location != ""){
				var location = new ListItem({
					variableHeight: true,
					label: "Location: " + mainUser.data.about.location,
					style: "border-bottom:none;padding: 0px 5px"
				})
				noTabList.addChild(location);
			}
			var link = new ListItem({
				variableHeight: true,
				label: "Link: " + '<a href="' + mainUser.data.about.link +'" target="_blank">Website</a>',
				style: "border:none;padding: 0px 5px"
			})
			noTabList.addChild(link);
			
			/** UNMERGE ON THE MAIN PERSON
				OR UNMERGE ALL THE OWNED PEOPLE?
			var unMergeItem = new ListItem({
				variableHeight: true,
				style: "border:none;padding: 0px 0px"
			})
			var div = domConstruct.create("div", {style:"layout:left"});
			var unMergeButton = new Button({
				label: "UnMerge",
				style: "float:left;",
				onClick: lang.hitch(this, function(){
					console.log("UNMERGE");
				})
			});
			div.appendChild(unMergeButton.domNode);
			unMergeItem.domNode.appendChild(div);
			noTabList.addChild(unMergeItem);
			
			
			**/
			
			this.mainList.addChild(noTabList);
			
			for(var y = 0; y < ownedUsers.length; y++){
				var oneTabList = new RoundRectList({
					style: "margin: 0px 0px 0px 20px"
				});
				
				var serviceStr = '';
				var services = {};
				var serviceObj = {};
					
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

				var displayName = new ListItem({
					variableHeight: true,
					label: ownedUsers[y].data.displayName,
					rightText: serviceStr,
					style: "border-bottom:none;padding: 0px 5px"
				})

				oneTabList.addChild(displayName);

				if(ownedUsers[y].data.service == "Facebook"){
					var divFacebook = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Facebook_logo.png>"});
					displayName.domNode.appendChild(divFacebook);
				}
				if(ownedUsers[y].data.service == "Twitter"){
					var divTwitter = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Twitter_logo_blue_small.png>"});
					displayName.domNode.appendChild(divTwitter);
				}
				if(ownedUsers[y].data.service == "Instagram"){
					var divInstagram = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Instagram_logo.png>"});
					displayName.domNode.appendChild(divInstagram);
				}
				if(ownedUsers[y].data.service == "LinkedIn"){
					var divLinkedIn = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/LinkedIn_logo.png>"});
					displayName.domNode.appendChild(divLinkedIn);
				}

				if(ownedUsers[y].data.about.description != ""){
					var description = new ListItem({
						variableHeight: true,
						label: "Bio: " + ownedUsers[y].data.about.description,
						style: "border-bottom:none;padding: 0px 5px"				
					})
					oneTabList.addChild(description);
				}
				if(ownedUsers[y].data.about.location != ""){
					var location = new ListItem({
						variableHeight: true,
						label: "Location: " + ownedUsers[y].data.about.location,
						style: "border-bottom:none;padding: 0px 5px"
					})
					oneTabList.addChild(location);
				}
				var link = new ListItem({
					variableHeight: true,
					label: "Link: " + '<a href="' + ownedUsers[y].data.about.link +'" target="_blank">Website</a>',
					style: "padding: 0px 5px;border-bottom:none"
				})
				oneTabList.addChild(link);
				
				var unMergeItem = new ListItem({
					variableHeight: true,
					style: "border:none;padding: 0px 0px"
				})
				var div = domConstruct.create("div", {style:"layout:left"});
				var unMergeButton = new Button({
					label: "UnMerge",
					style: "float:left;",
					onClick: lang.hitch(this, function(ownedUsers, y){						
						this.unMergeFriends([mainUser.data.id, ownedUsers[y].data.id]).then(lang.hitch(this, this.activate));
					}, ownedUsers, y)
				});
				div.appendChild(unMergeButton.domNode);
				unMergeItem.domNode.appendChild(div);
				oneTabList.addChild(unMergeItem);
				
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
				label: "Merge with contacts",
				style: "border: 1px solid",
				onClick: lang.hitch(this, function(){
					this.router.go("/MergeView/" + this.users[0]);
				})
			})
			this.mainList.addChild(item);
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/findContact', title: "View contact data"} );
			
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.buildMainList();
			}else{
				this.buildMainList();
			}
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
	})
});