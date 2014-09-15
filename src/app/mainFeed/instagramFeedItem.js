/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the instagramFeedItem for many modules
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
		return declare("instagramFeedItem",[ListItem], {
			variableHeight: true,
			"class": "feedItemListItemClass",
			
			sendInstaLike: function(id, accessToken){
				var params = {id: id, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendInstaLike', params);
			},
			
			sendInstaUnLike: function(id, accessToken){
				var params = {id: id, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendInstaUnLike', params);
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
						var nameArr = word.split("@");
						finalStr += pre + '<a style="color:#ee4115" href="https://instagram.com/'+nameArr[1]+'" target="_blank">'+word+'</a>' + post + " ";
					}else{
						finalStr += stringArr[u] + " ";
					}
				}

				return finalStr;
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
				
				if(this.authObj['instagram'].length > 0){
					var acctArr = this.authObj['instagram'][0]['accounts'];
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
				
				if(!obj.content){
					return;
				}
				var type = obj.content.objectType;
				
			//LeftPane/RoundRect
				this.picItem = new ListItem({
					variableHeight: true,
					"class": "picItemClass"
				});
				if(obj.actor.searchable != null && obj.actor.searchable != "" && obj.actor.searchable != "undefined" && obj.actor.searchable != "N/A"){
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
				if(obj.dataLocation == "local"){
					var locale = "locally";
				}else{
					var locale = "publicly";
				}
				var dateTime = this.getDate((obj.published).toString());
				
				this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="http://instagram.com/' + obj.actor.displayName +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + locale + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>' + " - " + dateTime, "class": "feedServiceDivItemClass"});
								
				this.dateServItem = new ListItem({
					variableHeight: true,
					"class": "feedPicDateItemClass"
				});
				
				this.dateServItem.domNode.appendChild(this.servPub);
				
				this.roundRight.addChild(this.dateServItem);
				
				//PIC ITEM THREE-----------------------
				this.picContent = new ListItem({
					variableHeight: true,
					"class": "feedPicContentItemClass"
				});
				if(obj.content.image != null && obj.content.image != "" && obj.content.image != "undefined" && obj.content.image != "N/A"){
					var div = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.image.lowRes+'"style="max-width:90%;max-height:90%;"></img>'});

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

						var dialogDiv = domConstruct.create("div", {innerHTML: '<img src="'+obj.content.image.highRes+'"style=""></img>'});

						var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

						dialog.set("content", dialogDiv);
						dialog.show();

						document.body.appendChild(blackoutDiv);
					});

					this.picContent.domNode.appendChild(div);
				}
				this.roundRight.addChild(this.picContent);
				
				//TEXT ITEM FOUR-------------------------
				if(obj.content.text.text != null && obj.content.text.text != "undefined" && obj.content.text.text != "" && obj.content.text.text != "N/A"){
					var string = this.parseSpecialChars(obj.content.text.text);
					//string = this.removeEmoji(string);
					this.textContent = new ListItem({
						variableHeight: true,
						"class": "feedTextContentItemClass",
						label: string
					});
					this.roundRight.addChild(this.textContent);
					
				}
				
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
							type: 'instaComments',
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
								type: 'instaComments',
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
				

				likeDiv.onclick = lang.hitch(this, function(likeDiv, id){
					for(var key in this.authObj){
						if(key !== "login"){
							if(this.authObj[key].length > 0){
								var accountArr = this.authObj[key][0]['accounts'];
								for(var d = 0; d < accountArr.length; d++){
									if(accountArr[d].accessToken != undefined){
										if(source.mainAccountID == accountArr[d].user){

											var accessToken = accountArr[d].accessToken;

											if(domClass.contains(likeDiv, "twitterOrangeDiv")){
												var likeId = id;
																								
												this.sendInstaLike(id, accessToken).then(lang.hitch(this, function(obj){
													console.log("obj is: ", obj);

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
														this.setIsLiked("instagram-----"+likeId, "true");
													}
												}));
											}else{
												var likeId = id;
												
												this.sendInstaUnLike(id, accessToken).then(lang.hitch(this, function(obj){
													console.log("obj is: ", obj);

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
														this.setIsLiked("instagram-----"+likeId, "false");
													}
												}));
											}
										}
									}
								}
							}
						}
					}
				}, likeDiv, id);
				
				blastDiv.onclick = lang.hitch(this, function(blastDiv, source){
					this.blastView.blastObj = {};

					this.blastView.blastObj.imgName = source.content.id;
					this.blastView.blastObj.postLink = source.postLink;
					this.blastView.blastObj.service = source.service;
					this.blastView.blastObj.poster = source.actor.displayName;
					this.blastView.blastObj.msg = source.content.text.text;

					if(source.content.image.lowRes == undefined ||
						source.content.image.lowRes == null || source.content.image.lowRes == ""){
						this.blastView.blastObj.url = "";
						this.blastView.blastObj.finalUrl = "";
					}else{
						this.blastView.blastObj.url = source.content.image.lowRes;
						this.blastView.blastObj.finalUrl = "app/post/tmpUpload/" + this.blastView.blastObj.imgName;
					}

					if(this.blastView.blastObj.finalUrl == "" || this.blastView.blastObj.finalUrl == undefined || this.blastView.blastObj.finalUrl == null){
						console.log("this.blastObj.finalUrl in instagramFeedItem is not valid");
						this.blastView.blastObj.url = "?";
						this.blastView.blastObj.imgName = "?";
					}

					console.log("this.blastObj.finalUrl in instagramFeedItem is: ", this.blastView.blastObj.finalUrl);
					
					this.downloadImage(this.blastView.blastObj.url, this.blastView.blastObj.imgName).then(lang.hitch(this, function(){
						window.location = "#/"+this.blastView.mod+this.blastView.route;
					}))
				}, blastDiv, source);
				
				this.commentHolder.domNode.appendChild(commentDiv);
				this.commentHolder.domNode.appendChild(likeDiv);
				this.commentHolder.domNode.appendChild(blastDiv);
				this.roundRight.addChild(this.commentHolder);
			},
			
			downloadImage: function(url, imgName){
				var params = {url: url, imgName: imgName};
				return xhrManager.send('POST', 'rest/v1.0/Blast/downloadImage', params);
			}
			
		});
	}
);
