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

		,"app/SelRoundRectList"
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
			
			parseSpecialChars: function(str) {
				//var stringArr = str.split(" ");
				var regex = /([ \n])/;
				var stringArr = str.split(regex);
				var finalStr = '';

				var patternURL = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
				var patternHashTag = new RegExp(/\B#\w*[a-zA-Z]+\w*/);
				var patternAt = new RegExp(/\B@\w*[a-zA-Z]+\w*/);

				for(var u = 0; u < stringArr.length; u++){
					if(patternURL.test(stringArr[u])) {
						if(str.indexOf('...') === -1 && str.indexOf('..') === -1){
							finalStr += '<a href="'+stringArr[u]+'" target="_blank">'+stringArr[u]+'</a>' + " ";
						}else{
							finalStr += stringArr[u] + " ";
						}
					}else if(patternHashTag.test(stringArr[u])){
						//#HASTAGS
						var pre = '';
						var post = '';
						var word = stringArr[u];
						//pre - if the word begins with " ' (
						for(var e = 0; e < stringArr[u].length; e++){
							if(stringArr[u].charAt(e) == ":" || 
							stringArr[u].charAt(e) == "?" || 
							stringArr[u].charAt(e) == '"' || 
							stringArr[u].charAt(e) == "'" ||
							stringArr[u].charAt(e) == "." || 
							stringArr[u].charAt(e) == "," || 
							stringArr[u].charAt(e) == ")" || 
							stringArr[u].charAt(e) == "!" || 
							stringArr[u].charAt(e) == "(" || 
							stringArr[u].charAt(e) == ";"){
								pre = stringArr[u].slice(0, e + 1);
								word = stringArr[u].slice(e + 1, stringArr[u].length);
							}else{
								break;
							}
						}
						//post - if the word ends with : " ' ? ; , . )
						for(var e = 0; e < word.length; e++){
							if(word.charAt(word.length - 1) == ":" || 
							word.charAt(word.length - 1) == "?" || 
							word.charAt(word.length - 1) == '"' || 
							word.charAt(word.length - 1) == "'" ||
							word.charAt(word.length - 1) == "." || 
							word.charAt(word.length - 1) == "," || 
							word.charAt(word.length - 1) == ")" || 
							word.charAt(word.length - 1) == "!" || 
							word.charAt(word.length - 1) == ";"){
								post += word.slice(-1);
								word = word.slice(0, word.length - 1);
							}else{
								post = post.split("").reverse().join("");
								break;
							}
						}

						finalStr += pre + '<a style="color:#048bf4">'+word+'</a>' + post + " ";
					}else if(patternAt.test(stringArr[u])){						
						//@PEOPLE
						var pre = '';
						var post = '';
						var word = stringArr[u];
						//console.log("before@: " + word);
						//pre - if the word begins with " ' (
						for(var e = 0; e < stringArr[u].length; e++){
							if(stringArr[u].charAt(e) == ":" || 
							stringArr[u].charAt(e) == "?" || 
							stringArr[u].charAt(e) == '"' || 
							stringArr[u].charAt(e) == "'" ||
							stringArr[u].charAt(e) == "." || 
							stringArr[u].charAt(e) == "," || 
							stringArr[u].charAt(e) == "&" || 
							stringArr[u].charAt(e) == ")" || 
							stringArr[u].charAt(e) == "!" || 
							stringArr[u].charAt(e) == "(" || 
							stringArr[u].charAt(e) == ";"){
								pre = stringArr[u].slice(0, e + 1);
								word = stringArr[u].slice(e + 1, stringArr[u].length);
							}else{
								break;
							}
						}
						//console.log("middle@: " + word);	
						//post - if the word ends with : " ' ? ; , . ) !
						for(var e = 0; e < word.length; e++){
							if(word.charAt(word.length - 1) == ":" || 
							word.charAt(word.length - 1) == "?" || 
							word.charAt(word.length - 1) == '"' || 
							word.charAt(word.length - 1) == "'" ||
							word.charAt(word.length - 1) == "." || 
							word.charAt(word.length - 1) == "," || 
							word.charAt(word.length - 1) == "&" || 
							word.charAt(word.length - 1) == ")" || 
							word.charAt(word.length - 1) == "!" || 
							word.charAt(word.length - 1) == ";"){
								post += word.slice(-1);
								word = word.slice(0, word.length - 1);
							}else{
								post = post.split("").reverse().join("");
								break;
							}
						}
						//console.log("after@: " + word);
						finalStr += pre + '<a style="color:#ee4115">'+word+'</a>' + post + " ";
					}else{
						finalStr += stringArr[u] + " ";
					}
				}

				return finalStr;
			},
			
			buildView: function(color){		
				var obj = this.data.hits.hits[this.counter]._source;
				
				if(obj.content.connection){
					if(obj.content.connection.length == 0){
						return;
					}
				}

				if(!obj.content || obj.actor.length == 0 || obj.actor.displayName == "private private" || obj.actor.searchable == "private"){
					return;
				}

				if(obj.content){
					if(obj.content.networkObjectType == "N/A" || obj.content.networkObjectType == null || obj.content.networkObjectType == "undefined"){
						return;
					}
				}

				console.log("OBJ IS: ", obj);

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
				
				if(this.authObj['linkedin'].length > 0){
					var acctArr = this.authObj['linkedin'][0]['accounts'];
					for(var g = 0; g < acctArr.length; g++){
						if(acctArr[g]['user'] == obj.mainAccountID){
							this.domNode.style.borderLeft = "5px solid " + acctArr[g]['color'];
							this.domNode.style.marginBottom = "10px";
							break;
						}else{
							this.domNode.style.borderLeft = "5px solid " + obj.mainAccountColor;
							this.domNode.style.marginBottom = "10px";
						}
					}
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
				if(obj.starred == "true"){
					this.star = new domConstruct.create("div", {
						"class": "starButtonClassChecked",
						checked: true
					});
				}else{
					this.star = new domConstruct.create("div", {
						"class": "starButtonClass",
						checked: false
					});
				}
				this.starClient = new domConstruct.create("div", {
					"class": "starClientButtonClass",
					checked: false
				});
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
				
				if(!this.showFavs || this.showFavs == "true"){
					this.starItem.domNode.appendChild(this.star);
					this.starItem.domNode.appendChild(this.starClient);
				}
				this.roundLeft.addChild(this.picItem);
				this.roundLeft.addChild(this.starItem);
			//LeftPane/RoundRect
				
			//RightPane/RoundRect
				this.userItem = new ListItem({
					variableHeight: true,
					"class": "feedPicDateItemClass"
				});
					
				if(obj.dataLocation == "local"){
					var locale = "locally";
				}else{
					var locale = "publicly";
				}
				var dateTime = this.getDate((obj.published).toString());
				if(type == "DISCUSS"){
					this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + locale + " via " + obj.service + " posted a discussion in the group: " + '<span><a href=http://www.linkedin.com/groups?gid='+Math.floor(obj.content.discussion.groupId)+' target="_blank">'+obj.content.discussion.groupName+'</a></span>' + " - " + dateTime, "class": "feedServiceDivItemClass"});
				}else{
					this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + locale + " via " + '<span><a href="http://www.linkedin.com" target="_blank">'+obj.service+'</a></span>' + " - " + dateTime, "class": "feedServiceDivItemClass"});
				}
				
				this.userItem.domNode.appendChild(this.servPub);
				
				this.roundRight.addChild(this.userItem);
				
				//CONTENT ITEM THREE-----------------------
				switch (type){
					case "CONN":
						if(obj.content.connection.length > 0){
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
						}
						
					break;
					case "CMPY":
						if(obj.content){
							if(obj.content.job){
								if(obj.content.job.jobDescription){
									if(obj.content.job.jobDescription != null && obj.content.job.jobDescription != "N/A" && obj.content.job.jobDescription != "undefined"){
										var jobDescription = this.parseSpecialChars(obj.content.job.jobDescription.text);
										if(obj.content.job.jobURL){
											if(obj.content.job.jobURL != "" && obj.content.job.jobURL != "undefined" && obj.content.job.jobURL != null){
												jobURL = this.parseSpecialChars(obj.content.job.jobURL);
											}else{
												jobURL = "";
											}
										}
										if(obj.content.job.jobPosition != null){
											var jobPosition = this.parseSpecialChars(obj.content.job.jobPosition);

											this.jobItem = new ListItem({
												variableHeight: true,
												label: "Job Update: " + jobPosition + " " + jobURL + "<br /> " + "<br /> " + jobPosition,
												"class": "feedTextContentItemClass"
											});
											this.roundRight.addChild(this.jobItem);
										}else{
											this.jobItem = new ListItem({
												variableHeight: true,
												label: "Job Update: " + jobURL + " " + jobDescription,
												"class": "feedTextContentItemClass"
											});
											this.roundRight.addChild(this.jobItem);
										}									

										if(obj.content.imageUrl && obj.content.imageUrl != "N/A" && obj.content.imageUrl != null && obj.content.imageUrl != "undefined"){
											this.pictureItem = new ListItem({
												variableHeight: true,
												"class": "feedPicDateItemClass"
											});

											div = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="max-width:90%;max-height:90%;" />', style: "float:left"});

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

												var dialogDiv = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="" />'});

												var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

												dialog.set("content", dialogDiv);
												dialog.show();

												document.body.appendChild(blackoutDiv);
											});

											this.pictureItem.domNode.appendChild(div);
											this.roundRight.addChild(this.pictureItem);
										}
									}
								}else if(obj.content.description && obj.content.comment){
									if(obj.content.description.text && obj.content.comment.text){
										if(obj.content.description.text != "" && obj.content.description.text != null && obj.content.description.text != "undefined" && obj.content.comment != null && obj.content.comment != "undefined" && obj.content.comment != ""){
											var comment = this.parseSpecialChars(obj.content.comment.text);

											this.commentItem = new ListItem({
												variableHeight: true,
												label: comment,
												"class": "feedTextContentItemClass"
											});
											this.roundRight.addChild(this.commentItem);

											if(obj.content.imageUrl && obj.content.imageUrl != "N/A" && obj.content.imageUrl != null && obj.content.imageUrl != "undefined"){
												this.pictureItem = new ListItem({
													variableHeight: true,
													"class": "feedPicDateItemClass"
												});

												div = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="max-width:90%;max-height:90%;" />', style: "float:left"});

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

													var dialogDiv = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="" />'});

													var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

													dialog.set("content", dialogDiv);
													dialog.show();

													document.body.appendChild(blackoutDiv);
												});

												this.pictureItem.domNode.appendChild(div);
												this.roundRight.addChild(this.pictureItem);
											}

											var description = this.parseSpecialChars(obj.content.description.text);
											
											this.descriptionItem = new ListItem({
												variableHeight: true,
												label: description,
												"class": "feedTextContentItemClass"
											});
											this.roundRight.addChild(this.descriptionItem);
										}
									}else if(obj.content.comment){
										if(obj.content.comment.text){
											var comment = this.parseSpecialChars(obj.content.comment.text);
											this.commentItem = new ListItem({
												variableHeight: true,
												label: comment,
												"class": "feedTextContentItemClass"
											});
											this.roundRight.addChild(this.commentItem);

											if(obj.content.imageUrl && obj.content.imageUrl != "N/A" && obj.content.imageUrl != null && obj.content.imageUrl != "undefined"){
												this.pictureItem = new ListItem({
													variableHeight: true,
													"class": "feedPicDateItemClass"
												});

												div = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="max-width:90%;max-height:90%;" />', style: "float:left"});

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

													var dialogDiv = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="" />'});

													var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

													dialog.set("content", dialogDiv);
													dialog.show();

													document.body.appendChild(blackoutDiv);
												});

												this.pictureItem.domNode.appendChild(div);
												this.roundRight.addChild(this.pictureItem);
											}
										}else if(obj.content.description.text){
											var description = this.parseSpecialChars(obj.content.description.text);

											this.descriptionItem = new ListItem({
												variableHeight: true,
												label: description,
												"class": "feedTextContentItemClass"
											});
											this.roundRight.addChild(this.descriptionItem);

											if(obj.content.imageUrl && obj.content.imageUrl != "N/A" && obj.content.imageUrl != null && obj.content.imageUrl != "undefined"){
												this.pictureItem = new ListItem({
													variableHeight: true,
													"class": "feedPicDateItemClass"
												});

												div = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="max-width:90%;max-height:90%;" />', style: "float:left"});

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

													var dialogDiv = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.imageUrl+'"style="" />'});

													var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

													dialog.set("content", dialogDiv);
													dialog.show();

													document.body.appendChild(blackoutDiv);
												});

												this.pictureItem.domNode.appendChild(div);
												this.roundRight.addChild(this.pictureItem);
											}
										}
									}
								}
							}
						}
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
								label: obj.content.person.firstName + " is now following: " + obj.content.companyName,
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
					var id = this.data.hits.hits[this.counter]._source.id.split("-----");
					id = id[1];
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
						for(var key in this.authObj){
							if(key !== "login"){
								if(this.authObj[key].length > 0){
									var accountArr = this.authObj[key][0]['accounts'];
									for(var d = 0; d < accountArr.length; d++){
										if(accountArr[d].accessToken != undefined){
											if(source.mainAccountID == accountArr[d].user){

												var accessToken = accountArr[d].accessToken;

												if(domClass.contains(likeDiv, "twitterOrangeDiv")){					
													this.sendLinkedLike(id, accessToken).then(lang.hitch(this, function(obj){
														if(obj['Failure']){
															if(this.errorDialog){
																this.errorDialog.destroyRecursive();
																this.errorDialog = null;
															}
															
															var div = domConstruct.create("div", {innerHTML: obj['Failure']});

															this.errorDialog = new Dialog({
																title: "Error",
																"class": "errorDijitDialog",
																style: "top: 105px !important; width: 520px !important; padding: 10px !important; background-color: #FFE6E6",
																draggable: false
															});

															for(var g = 0; g < this.errorDialog.domNode.children.length; g++){
																if(domClass.contains(this.errorDialog.domNode.children[g], "dijitDialogPaneContent")){
																	domStyle.set(this.errorDialog.domNode.children[g], "padding", "0px");
																	domStyle.set(this.errorDialog.domNode.children[g], "background-color", "inherit");
																}
															}

															this.errorDialog.set("content", div);
															this.errorDialog.show();
														}else{
															this.likeNum++;
															domClass.remove(likeDiv, "twitterOrangeDiv");
															domClass.add(likeDiv, "twitterBlueDiv");
															likeDiv.innerHTML = "Liked(" + (this.likeNum) + ")";
															this.setIsLiked(source.id, "true");
														}
													}));
												}else{													
													this.sendLinkedUnLike(id, accessToken).then(lang.hitch(this, function(obj){
														if(obj['Failure']){
															if(this.errorDialog){
																this.errorDialog.destroyRecursive();
																this.errorDialog = null;
															}
															
															var div = domConstruct.create("div", {innerHTML: obj['Failure']});

															this.errorDialog = new Dialog({
																title: "Error",
																"class": "errorDijitDialog",
																style: "top: 105px !important; width: 520px !important; padding: 10px !important; background-color: #FFE6E6",
																draggable: false
															});

															for(var g = 0; g < this.errorDialog.domNode.children.length; g++){
																if(domClass.contains(this.errorDialog.domNode.children[g], "dijitDialogPaneContent")){
																	domStyle.set(this.errorDialog.domNode.children[g], "padding", "0px");
																	domStyle.set(this.errorDialog.domNode.children[g], "background-color", "inherit");
																}
															}

															this.errorDialog.set("content", div);
															this.errorDialog.show();
														}else{
															this.likeNum--;
															domClass.remove(likeDiv, "twitterBlueDiv");
															domClass.add(likeDiv, "twitterOrangeDiv");
															likeDiv.innerHTML = "Like(" + (this.likeNum) + ")";
															this.setIsLiked(source.id, "false");
														}
													}));
												}
											}
										}
									}
								}
							}
						}
						this.likeCounter++;
					}, likeDiv, source);
					
					blastDiv.onclick = lang.hitch(this, function(blastDiv, source){
						this.blastView.blastObj = {};

						this.blastView.blastObj.imgName = source.content.id;
						this.blastView.blastObj.postLink = source.postLink;
						this.blastView.blastObj.service = source.service;
						this.blastView.blastObj.poster = source.actor.displayName;

						if(source.content.picture == undefined ||
							source.content.picture == null || source.content.picture == ""){
							this.blastView.blastObj.url = "";
							this.blastView.blastObj.finalUrl = "";
						}else{
							this.blastView.blastObj.url = source.content.picture;
							this.blastView.blastObj.finalUrl = "app/post/tmpUpload/" + this.blastView.blastObj.imgName;
						}

						if(source.title == "DISCUSS"){
							if(source.content.discussion.summary.text){
								this.blastView.blastObj.msg = source.content.discussion.summary.text;
							}
						}else{
							if(!source.content.text){
								this.blastView.blastObj.msg = source.content.status.text;
							}else{
								this.blastView.blastObj.msg = source.content.text.text;
							}
						}
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
