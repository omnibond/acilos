/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the facebookFeedItem for many modules
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
		,"dojox/mobile/TextBox"

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
		,TextBox
		
		,DeferredExecuterMixin
		
		,DataObjItemBase
		,DataObjAccordion
		,DataObjPane
		
		,ready
		,xhrManager
	){
		return declare("FacebookFeedItem",[ListItem], {
			variableHeight: true,
			"class": "feedItemListItemClass",
			
			sendFaceLike: function(idFirstPart, idSecondPart, accessToken){
				var params = {idFirstPart: idFirstPart, idSecondPart: idSecondPart, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendFaceLike', params);
			},
			
			sendFaceUnLike: function(idFirstPart, idSecondPart, accessToken){
				var params = {idFirstPart: idFirstPart, idSecondPart: idSecondPart, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendFaceUnLike', params);
			},
			
			setIsLiked: function(id, liked){
				var params = {id: id, liked: liked};
				return xhrManager.send('POST', 'rest/v1.0/Favorites/setIsLiked', params);
			},
			
			postCreate: function(){
				this.buildView();
			},
			
			/*getObjects: function(){
				return app.send('getObjects', 'php/' + this.serviceURL,{})
					.then(lang.hitch(this,this.handleGetObjects));
			},*/
			
			handleGetObjects: function(obj){
				console.log("handleGetObjects",arguments);
				this.objects = obj;
			},

			getServiceCreds: function(){
				params = {};
				return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
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

				for(var g = 0; g < this.authObj['facebook'].length; g++){
					if(this.authObj['facebook'][g]['user'] == obj.mainAccountID){
						this.domNode.style.borderLeft = "5px solid " + this.authObj['facebook'][g]['color'];
						this.domNode.style.marginBottom = "10px";
						break;
					}else{
						this.domNode.style.borderLeft = "5x solid " + obj.mainAccountColor;
						this.domNode.style.marginBottom = "10px";
					}
				}
				
				if(!obj.content){
					return;
				}
				var type = obj.content.objectType;
				var action = '';
				switch(type){
					case "link":
						action = " posted a link";
					break;
					case "status":
						action = " updated their status";
					break;
					case "photo":
						action = " added a new photo";
					break;
					default:
						//herpderp
					break;
				}
				
			//LeftPane/RoundRect
				this.picItem = new ListItem({
					variableHeight: true,
					"class": "picItemClass"
				});
				if(obj.actor.searchable != null){
					this.userPic = domConstruct.create("div", {innerHTML: '<img src="https://graph.facebook.com/'+obj.actor.id+'/picture" width="50px" height="50px" />', "class": "feedPicDivItemClass"});
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
				this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + action + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>', "class": "feedServiceDivItemClass"});
				this.dataPub = domConstruct.create("div", {innerHTML: this.getDate((obj.published).toString()), "class": "feedDateDivItemClass"});
								
				this.dateServItem = new ListItem({
					variableHeight: true,
					"class": "feedPicDateItemClass"
				});
				
				this.dateServItem.domNode.appendChild(this.servPub);
				this.dateServItem.domNode.appendChild(this.dataPub);
				
				this.roundRight.addChild(this.dateServItem);
				
				//PIC ITEM ----------------------
				if(obj.content.picture != null && obj.content.url != null){
					this.picContent = new ListItem({
						variableHeight: true,
						"class": "feedPicContentItemClass"
					});

					if(obj.content.objectType == "photo"){
						var div = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.picture+'" style="max-width:90%;max-height:90%;" /></a></span>'});
					}else{
						var div = domConstruct.create("div", {innerHTML: '<span><a href="'+obj.content.url+'" target="_blank"><img src="'+obj.content.picture+'" style="max-width:90%;max-height:90%;" /></a></span>'});
					}

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

						if(obj.content.objectType == "photo"){
							var dialogDiv = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.picture+'" style="" /></a></span>'});

							var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

							dialog.set("content", dialogDiv);
							dialog.show();

							document.body.appendChild(blackoutDiv);
						}
					});

					this.picContent.domNode.appendChild(div);
					this.roundRight.addChild(this.picContent);
				}else{
					if((obj.content.objectType == "photo") && (obj.content.picture == null) && (obj.content.url != null)){

						this.picContent = new ListItem({
							variableHeight: true,
							"class": "feedPicContentItemClass"
						});

						var div = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.url+'" style="max-width:90%;max-height:90%;" /></a></span>'});

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

							var dialogDiv = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.url+'" style="" /></a></span>'});

							var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

							dialog.set("content", dialogDiv);
							dialog.show();

							document.body.appendChild(blackoutDiv);
						});

						this.picContent.domNode.appendChild(div);
						this.roundRight.addChild(this.picContent);
					}
				}				
				
				//TEXT ITEM FOUR-------------------------
				if(obj.content.text.text != null){
					/*
					if(obj.content.to.length > 0){
						var string =  this.parseSpecialChars(obj.content.text.text);
						this.textContent = new ListItem({
							variableHeight: true,
							"class": "feedTextContentItemClass",
							label: string + " to " + obj.content.to[0].name
						});
					}else{
						var string = this.parseSpecialChars(obj.content.text.text);
						this.textContent = new ListItem({
							variableHeight: true,
							"class": "feedTextContentItemClass",
							label: string
						});
					}
					*/

					if(obj.content.to.length > 0){
						var toLinkURL = obj.id;
						
						toLinkURL = toLinkURL.split("-----");
						toLinkURL = toLinkURL[1].split("_");
						toLinkURL = toLinkURL[0];

						toLinkURL = "https://www.facebook.com/" + toLinkURL;

						this.servPub.innerHTML = '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + "posted to " + '<span><a href="' + toLinkURL +'" target="_blank">'+obj.content.to[0].name+'</a></span>' + "'s wall " + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>';

						var string =  this.parseSpecialChars(obj.content.text.text);
						this.textContent = new ListItem({
							variableHeight: true,
							"class": "feedTextContentItemClass",
							label: string
						});
					}else{
						var string = this.parseSpecialChars(obj.content.text.text);
						this.textContent = new ListItem({
							variableHeight: true,
							"class": "feedTextContentItemClass",
							label: string
						});
					}
					this.roundRight.addChild(this.textContent);
				}else if(obj.content.story.text != null){
					var string =  this.parseSpecialChars(obj.content.story.text);
					this.textContent = new ListItem({
						variableHeight: true,
						"class": "feedTextContentItemClass",
						label: string
					});
					this.roundRight.addChild(this.textContent);
				}
				if(type == "link" && !(obj.content.to.length > 0)){
					this.link = new ListItem({
						variableHeight: true,
						"class": "feedTextContentItemClass"
					});
					var div = domConstruct.create("div", {innerHTML: '<span><a href="'+obj.content.url+'" target="_blank">'+obj.content.url+'</a></span>'});
					this.link.domNode.appendChild(div);
					this.roundRight.addChild(this.link);
				}
				
				this.commentHolder = new ListItem({
					variableHeight: true,
					"class": "feedCommentItemClass"
				});
				
				var source = this.data.hits.hits[this.counter]._source;
				var content = this.data.hits.hits[this.counter]._source.content;
				var x = this.data.hits.hits[this.counter]._source.content.likes;
				var comments = this.data.hits.hits[this.counter]._source.content.comments;
				var id = this.data.hits.hits[this.counter]._source.content.id;
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
							type: 'faceComment',
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
								type: 'faceComment',
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

				likeDiv.onclick = lang.hitch(this, function(likeDiv, content, id){
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
										this.setIsLiked("facebook-----"+id, "true");		

										var id = content.id.split("_");
										idFirstPart = id[0];
										idSecondPart = id[1];
										
										this.sendFaceLike(idFirstPart, idSecondPart, accessToken).then(lang.hitch(this, function(obj){
											console.log("obj is: ", obj);
										}));
									}else{
										this.likeNum--;
										domClass.remove(likeDiv, "twitterBlueDiv");
										domClass.add(likeDiv, "twitterOrangeDiv");
										likeDiv.innerHTML = "Like(" + (this.likeNum) + ")";
										this.setIsLiked("facebook-----"+id, "false");
										
										var id = content.id.split("_");
										idFirstPart = id[0];
										idSecondPart = id[1];
										
										this.sendFaceUnLike(idFirstPart, idSecondPart, accessToken).then(lang.hitch(this, function(obj){
											console.log("obj is: ", obj);
										}));
									}
								}
							}
						}
					}
				},likeDiv, content, id);
				
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
					this.blastView.blastObj.poster = source.actor.displayName;
					this.blastView.blastObj.msg = source.content.text.text;
					this.downloadImage(this.blastView.blastObj.url, this.blastView.blastObj.imgName).then(lang.hitch(this, function(){
						window.location = "#/"+this.blastView.mod+this.blastView.route;
					}))
				}, blastDiv, source);
				
				this.commentHolder.domNode.appendChild(commentDiv);
				this.commentHolder.domNode.appendChild(likeDiv);
				this.commentHolder.domNode.appendChild(blastDiv);
				this.roundRight.addChild(this.commentHolder);
				
			//RightPane/RoundRect
			},
			
			downloadImage: function(url, imgName){
				var params = {url: url, imgName: imgName};
				return xhrManager.send('POST', 'rest/v1.0/Blast/downloadImage', params);
			}
			
		});
	}
);
