/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the linkedinFeedItem for many modules
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
		"dojo/_base/declare"
		,"dojo/dom"
		,"dojo/dom-class"
		,"dojo/dom-construct"
		,"dojo/_base/window"
		,"dojo/dom-style"
		,"dojo/dom-attr"
		,"dojo/_base/lang"
		,"dojo/_base/Deferred"
		,"dojo/DeferredList"
		,"dojo/on"
		
		,"dijit/registry"
		,"dijit/Dialog"

		,"dojox/mobile/RoundRectList"
		,"dojox/mobile/ListItem"
		,"dojox/mobile/ContentPane"
		,"dojox/mobile/ToolBarButton"

		,"app/DeferredExecuterMixin"
		
		,"app/mainFeed/FeedItemBase"
		,"app/mainFeed/FeedAccordion"
		,"app/mainFeed/CommentPane"
		
		,"dojo/ready"
		,'app/util/xhrManager'

	], function(
		declare
		,dom
		,domClass
		,domConstruct
		,domWindow
		,domStyle
		,domAttr
		,lang
		,Deferred
		,DeferredList
		,on
		
		,registry
		,Dialog
		
		,RoundRectList
		,ListItem
		,Pane
		,ToolBarButton
		
		,DeferredExecuterMixin
		
		,DataObjItemBase
		,DataObjAccordion
		,DataObjPane
		
		,ready
		,xhrManager
	){
		return declare("linkedinFeedItem",[ListItem], {
			variableHeight: true,
			"class": "feedItemListItemClass",
			
			sendLinkedLike: function(id, accessToken){
				var params = {id: id, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendLinkedLike', params);
			},
			
			sendLinkedUnLike: function(id, accessToken){
				var params = {id: id, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendLinkedUnLike', params);
			},
			
			setIsLiked: function(id, liked){
				var params = {id: id, liked: liked};
				return xhrManager.send('POST', 'rest/v1.0/Favorites/setIsLiked', params);
			},
			
			postCreate: function(){
				this.buildView();
			},

			getServiceCreds: function(){
				params = {};
				return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
			},
			
			/*getObjects: function(){
				return app.send('getObjects', 'php/' + this.serviceURL,{})
					.then(lang.hitch(this,this.handleGetObjects));
			},*/
			
			handleGetObjects: function(obj){
				console.log("handleGetObjects",arguments);
				this.objects = obj;
			},
			
			buildView: function(color){				
				this.paneLeft = new Pane({
					"class": "paneLeftClass"
				});
				this.paneRight = new Pane({
					"class": "paneRightClass"
				});
				this.roundLeft = new RoundRectList({
					"class": "roundRectLeftClass"
				});
				this.roundRight = new RoundRectList({
					"class": "roundRectRightClass"
				});
				this.paneLeft.addChild(this.roundLeft);
				this.paneRight.addChild(this.roundRight);
				this.addChild(this.paneLeft);
				this.addChild(this.paneRight);

				var obj = this.data.hits.hits[this.counter]._source;

				for(var g = 0; g < this.authObj['linkedin'].length; g++){
					if(this.authObj['linkedin'][g]['user'] == obj.mainAccountID){
						this.domNode.style.borderLeft = "5px solid " + this.authObj['linkedin'][g]['color'];
						this.domNode.style.marginBottom = "10px";
						break;
					}else{
						this.domNode.style.borderLeft = "5px solid " + obj.mainAccountColor;
						this.domNode.style.marginBottom = "10px";
					}
				}
				
				if(!obj.content){
					return;
				}
				var type = obj.content.networkObjectType;
				
			//LeftPane/RoundRect
				this.picItem = new ListItem({
					variableHeight: true,
					"class": "picItemClass"
				});
				if(obj.actor.searchable != null){
					this.userPic = domConstruct.create("div", {innerHTML: '<img src="'+obj.actor.image+'" width="50px" height="50px" />', "class": "feedPicDivItemClass"});
				}else{
					this.userPic = domConstruct.create("div", {innerHTML: '<img src="app/resources/img/blankPerson.jpg" width="50px" height="50px" />', "class": "feedPicDivItemClass"});
				}
				this.picItem.domNode.appendChild(this.userPic);
				
				this.starItem = new ListItem({
					variableHeight: true,
					"class": "starItemClass"
				});
				this.star = new domConstruct.create("div", {
					"class": "starButtonClass",
					checked: false
				});
				this.starClient = new domConstruct.create("div", {
					"class": "starClientButtonClass",
					checked: false
				});
				if(obj.starred == "true"){
					this.star = new domConstruct.create("div", {
						"class": "starButtonClassChecked",
						checked: true
					});
				}
				if(this.starClientObj){
					for(var x = 0; x < this.starClientObj.length; x++){
						if(obj.actor.id == this.starClientObj[x]){
							this.starClient = new domConstruct.create("div", {
								"class": "starClientButtonClassChecked",
								checked: true
							});
							break;
						}
					}
				}
				
				this.star.onclick = lang.hitch(this, function(obj){
					if(this.star.checked === true){
						var response = this.setStarred("false", obj.id);
						this.star.checked = false;
						domClass.remove(this.star, "starButtonClassChecked");
						domClass.add(this.star, "starButtonClass");
					}else if(this.star.checked === false){
						var response = this.setStarred("true", obj.id);
						this.star.checked = true;
						domClass.remove(this.star, "starButtonClass");
						domClass.add(this.star, "starButtonClassChecked");
					}else{
						console.log("we shouldn't have gotten here");
					}
				}, obj);
				this.starClient.onclick = lang.hitch(this, function(obj){
					if(this.starClient.checked === true){
						var response = this.setStarredClient("false", obj.service+"-----"+obj.actor.id);
						this.starClient.checked = false;
						domClass.remove(this.starClient, "starClientButtonClassChecked");
						domClass.add(this.starClient, "starClientButtonClass");
					}else if(this.starClient.checked === false){
						var response = this.setStarredClient("true", obj.service+"-----"+obj.actor.id);
						this.starClient.checked = true;
						domClass.remove(this.starClient, "starClientButtonClass");
						domClass.add(this.starClient, "starClientButtonClassChecked");
					}else{
						console.log("we shouldn't have gotten here");
					}
				}, obj);
				
				this.starItem.domNode.appendChild(this.star);
				this.starItem.domNode.appendChild(this.starClient);
				this.roundLeft.addChild(this.picItem);
				this.roundLeft.addChild(this.starItem);
			//LeftPane/RoundRect
				
			//RightPane/RoundRect
				this.userItem = new ListItem({
					variableHeight: true,
					"class": "feedPicDateItemClass"
				});
					
				if(type == "DISCUSS"){
					this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " via " + obj.service + " posted a discussion in the group: " + '<span><a href=http://www.linkedin.com/groups?gid='+Math.floor(obj.content.discussion.groupId)+' target="_blank">'+obj.content.discussion.groupName+'</a></span>', "class": "feedServiceDivItemClass"});
				}else{
					this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>', "class": "feedServiceDivItemClass"});
				}
				this.dataPub = domConstruct.create("div", {innerHTML: this.getDate((obj.published).toString()), "class": "feedDateDivItemClass"});
				
				this.userItem.domNode.appendChild(this.servPub);
				this.userItem.domNode.appendChild(this.dataPub);
				
				this.roundRight.addChild(this.userItem);
				
				//CONTENT ITEM THREE-----------------------
				switch (type){
					case "CONN":
						this.connItem = new ListItem({
							variableHeight: true,
							"class": "feedPicDateItemClass"
						});
						if(obj.content.actionString != null){
							this.stringItem = new ListItem({
								variableHeight: true,
								label: obj.content.person.firstName + " " + obj.content.person.lastName + " " + obj.content.actionString,
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.stringItem);
							for(var k = 0; k < obj.content.connection.length; k++){
								if(obj.content.connection[k].picture != null){
									this.userPic = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.connection[k].picture+'" max-width="50px" max-height="50px" />', style: "float:left"});
								}else{
									this.userPic = domConstruct.create("div", {innerHTML: '<img src="app/resources/img/blankPerson.jpg" max-width="50px" max-height="50px" />', style: "float:left"});
								}
								this.connPerson = domConstruct.create("div", {innerHTML: obj.content.connection[k].firstName + " " + obj.content.connection[k].lastName + "\n", style: "float:center;margin-top:10px;clear:both;margin-left:-1px"});
								this.connItem.domNode.appendChild(this.userPic);
								this.connItem.domNode.appendChild(this.connPerson);
							}
						}
						this.roundRight.addChild(this.connItem);
					break;
					case "PICU":
						if(obj.content.picture != null){
							this.picuItem = new ListItem({
								variableHeight: true,
								"class": "feedPicDateItemClass"
							});
							var div = domConstruct.create("div", {innerHTML: obj.content.firstName + " has updated thier profile picture", style: "float:left"});
							this.picuItem.domNode.appendChild(div);

							div = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.picture+'"style="max-width:90%;max-height:90%;" />', style: "float:left"});

							div.onclick = lang.hitch(this, function(){
								var dialog = new Dialog({
									title: "Click to close ->",
									"class": "blackBackDijitDialog",
									onHide: lang.hitch(this, function(){
										if(blackoutDiv){
											document.body.removeChild(blackoutDiv);
										}
									})
								});

								var dialogDiv = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.picture+'"style=""></img>'});

								var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

								dialog.set("content", dialogDiv);
								dialog.show();

								document.body.appendChild(blackoutDiv);
							});

							this.picuItem.domNode.appendChild(div);
							this.roundRight.addChild(this.picuItem);
						}
					break;
					case "STAT":
						if(obj.content.status.text != null){
							var string =  this.parseSpecialChars(obj.content.status.text);
							this.statItem = new ListItem({
								variableHeight: true,
								label: string,
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.statItem);
						}else{
							this.statItem = new ListItem({
								variableHeight: true,
								label: "This is supposed to be a status update",
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.statItem);
						}
					break;
					case "PROF":
						var skills = [];
						if(obj.content.updatedFields.length > 0){
							for(var h = 0; h < obj.content.updatedFields.length; h++){
								var skill = obj.content.updatedFields[h].updatedField.split("/");
								skills.push(skill[1]);
							}
						}
						if(skills.length !== 0){
							if(skills.length == 1){
								var skillStr = '';
								this.profItem = new ListItem({
									variableHeight: true,
									label: obj.content.firstName + " has updated their " + skills[0],
									"class": "feedTextContentItemClass"
								});
								
								this.roundRight.addChild(this.profItem);
								if(!obj.content[skills[0]]){
									skillStr += skills[0];
								}else{
									for(var y = 0; y < obj.content[skills[0]].length; y++){
										if(obj.content[skills[0]][y].name == null){
											continue;
										}else{
											if(skills[0] == "positions"){
												skillStr += obj.content[skills[0]][y].name + " at " + obj.content[skills[0]][y].companyName;
											}else{
												if(y == obj.content[skills[0]].length -1){
													skillStr += obj.content[skills[0]][y].name + " ";
												}else{
													skillStr += obj.content[skills[0]][y].name + ", ";
												}
											}
										}
									}
								}
								this.profItem = new ListItem({
									variableHeight: true,
									label: obj.content.firstName + " added " + skillStr,
									"class": "feedTextContentItemClass"
								});
								this.roundRight.addChild(this.profItem);
							}else if(skills.length > 1){
								var updated = '';
								for(var x = 0; x < skills.length; x++){
									if(x == skills.length - 1){
										updated += skills[x];
									}else{
										updated += skills[x] + " and ";
									}
								}
								this.profItem = new ListItem({
									variableHeight: true,
									label: obj.content.firstName + " has updated their " + updated,
									"class": "feedTextContentItemClass"
								});
								this.roundRight.addChild(this.profItem);
							}
						}else{
							this.profItem = new ListItem({
								variableHeight: true,
								label: "This person has no skills to update",
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.profItem);
						}
					break;
					case "JGRP":
						if(obj.content.groups != null){
							var string = obj.content.person.firstName + " has joined the following groups: ";
							for(var x = 0; x < obj.content.groups.length; x++){
								string += '<a href="'+obj.content.groups[x].groupURL+'" target="_blank">'+obj.content.groups[x].groupName+'</a>';
							}
							this.jgrpItem = new ListItem({
								variableHeight: true,
								label: string,
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.jgrpItem);
						}else{
							this.jgrpItem = new ListItem({
								variableHeight: true,
								label: "This person has not joined any new groups",
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.jgrpItem);
						}
					break;
					case "MSFC":
						if(obj.content.companyName != null){
							this.msfcItem = new ListItem({
								variableHeight: true,
								label: obj.content.person.firstName + " has started following: " + obj.content.companyName,
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.msfcItem);
						}else{
							this.msfcItem = new ListItem({
								variableHeight: true,
								label: "This person has not started following any new companies",
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.msfcItem);
						}
					break;
					case "PREC":
						if(obj.content.recommendations != null){
							for(var t = 0; t < obj.content.recommendations.length; t++){
								this.precItem = new ListItem({
									variableHeight: true,
									label: obj.actor.displayName + " has recommended " +obj.content.recommendations[t].reccommenderFirstName + " as a " +  obj.content.recommendations[t].recType  + " stating: " + obj.content.recommendations[t].recComment,
									"class": "feedTextContentItemClass"
								});
								this.roundRight.addChild(this.precItem);
							}
						}else{
							this.precItem = new ListItem({
								variableHeight: true,
								label: obj.actor.displayName + " has recommended a fellow colleague",
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.precItem);
						}
					break;
					case "DISCUSS":
						if(obj.content.discussion.title.text != null){
							var string =  this.parseSpecialChars(obj.content.discussion.title.text);
							this.discussItem = new ListItem({
								variableHeight: true,
								label: "Title: " + string + "<br/>",
								"class": "feedTextTitleItemClass"
							});
							this.roundRight.addChild(this.discussItem);
						}
						if(obj.content.discussion.summary.text != null){
							var string =  this.parseSpecialChars(obj.content.discussion.summary.text);
							this.discussItem = new ListItem({
								variableHeight: true,
								label: string,
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.discussItem);
						}
						if(obj.content.discussion.title.text == null && obj.content.discussion.summary.text == null){
							this.discussItem = new ListItem({
								variableHeight: true,
								label: "This person has not actually posted anything?",
								"class": "feedTextContentItemClass"
							});
							this.roundRight.addChild(this.discussItem);
						}
					break;
					default:
						console.log("Unknown type: " + type);
						console.log(obj);
					break;
				}
				
				
				//COMMENT/LIKE ITEM FIVE-------------------------
				var type = this.data.hits.hits[this.counter]._source.content.networkObjectType;
				if(type != "NCON" && type != "CCEM" && type != "CONN" && type != "MSFC"){
					this.commentHolder = new ListItem({
						variableHeight: true,
						"class": "feedCommentItemClass"
					});
					
					var x = this.data.hits.hits[this.counter]._source.content.likes;
					var id = this.data.hits.hits[this.counter]._source.content.id;
					var comments = this.data.hits.hits[this.counter]._source.content.comments;
					var source = this.data.hits.hits[this.counter]._source;
					this.likeNum = x.length;
					
					var commentDiv = domConstruct.create("div", {innerHTML: "Comment(" + comments.length + ")", "class": "twitterOrangeDiv", style: "margin-right: 5px"});
					if(source.isLiked == "true"){
						var likeDiv = domConstruct.create("div", {innerHTML: "Liked(" + this.likeNum + ")", "class": "twitterBlueDiv"});
					}else{
						var likeDiv = domConstruct.create("div", {innerHTML: "Like(" + this.likeNum + ")", "class": "twitterOrangeDiv"});
					}
					var blastDiv = domConstruct.create("div", {style: "margin-left:5px", innerHTML: "Blast", "class": "twitterBlueDiv"});
				
					this.commentCounter = 0;
					this.likeCounter = 0;
					
					commentDiv.onclick = lang.hitch(this, function(){	
						if(!this.pane){
							this.pane = new DataObjPane({
								data: this.data,
								authObj: this.authObj,
								type: 'linkedComments',
								counter: this.counter,
								parseSpecialChars: this.parseSpecialChars,
								isURL: this.isURL
							});
							this.addChild(this.pane);
						}else{
							if(this.commentCounter%2 === 0){
								this.pane.destroyRecursive();
								this.pane = null;
								this.pane = new DataObjPane({
									data: this.data,
									authObj: this.authObj,
									type: 'linkedComments',
									counter: this.counter,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL
								});
								this.addChild(this.pane);
								this.likeCounter = 0;
							}else{
								this.pane.destroyRecursive();
								this.pane = null;
							}
						}
						this.commentCounter++;
					});

					likeDiv.onclick = lang.hitch(this, function(likeDiv, source){
						this.getServiceCreds().then(lang.hitch(this, function(obj){
							this.authObj = obj;
						}));

						for(var key in this.authObj){
							for(var d = 0; d < this.authObj[key].length; d++){
								if(this.authObj[key][d].accessToken != undefined){
									if(source.mainAccountID == this.authObj[key][d].user){

										var accessToken = this.authObj[key][d].accessToken;

										if(domClass.contains(likeDiv, "twitterOrangeDiv")){
											this.likeNum++;
											domClass.remove(likeDiv, "twitterOrangeDiv");
											domClass.add(likeDiv, "twitterBlueDiv");
											likeDiv.innerHTML = "Liked(" + (this.likeNum) + ")";
											this.setIsLiked(source.id, "true");
											
											this.sendLinkedLike(id, accessToken).then(lang.hitch(this, function(obj){
												console.log("obj is: ", obj);
											}));
										}else{
											this.likeNum--;
											domClass.remove(likeDiv, "twitterBlueDiv");
											domClass.add(likeDiv, "twitterOrangeDiv");
											likeDiv.innerHTML = "Like(" + (this.likeNum) + ")";
											this.setIsLiked(source.id, "false");
											
											this.sendLinkedUnLike(id, accessToken).then(lang.hitch(this, function(obj){
												console.log("obj is: ", obj);
											}));
										}
									}
								}
							}
						}
						this.likeCounter++;
					}, likeDiv, source);
					
					blastDiv.onclick = lang.hitch(this, function(blastDiv, source){
						this.blastView.blastObj = {};
						if(source.content.picture == undefined ||
							source.content.picture == null){
							this.blastView.blastObj.url = "";
						}else{
							this.blastView.blastObj.url = source.content.picture;
						}
						this.blastView.blastObj.imgName = source.content.id;
						this.blastView.blastObj.postLink = source.postLink;
						this.blastView.blastObj.service = source.service;
						this.blastView.blastObj.msg = source.content.text.text;
						this.downloadImage(this.blastView.blastObj.url, this.blastView.blastObj.imgName).then(lang.hitch(this, function(){
							window.location = "#/"+this.blastView.mod+this.blastView.route;
						}))
					}, blastDiv, source);
					
					this.commentHolder.domNode.appendChild(commentDiv);
					this.commentHolder.domNode.appendChild(likeDiv);
					this.commentHolder.domNode.appendChild(blastDiv);
					this.roundRight.addChild(this.commentHolder);
				}
			},
			
			downloadImage: function(url, imgName){
				var params = {url: url, imgName: imgName};
				return xhrManager.send('POST', 'rest/v1.0/Blast/downloadImage', params);
			}
			
		});
	}
);
