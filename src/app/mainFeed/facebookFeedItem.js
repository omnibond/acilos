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
		,'dojox/mobile/ProgressIndicator'

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
		,ProgressIndicator
		
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
			
			sendFaceLike: function(id, accessToken){
				var params = {id: id, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/sendFaceLike', params);
			},
			
			sendFaceUnLike: function(id, accessToken){
				var params = {id: id, accessToken: accessToken};
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

			mineFacebookCommentPics: function(databasePostId, facebookPostId, comments, accessToken){
				var params = {databasePostId: databasePostId, facebookPostId: facebookPostId, comments: comments, accessToken: accessToken};
				return xhrManager.send('POST', 'rest/v1.0/Post/mineFacebookCommentPics', params);
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
			
			getServiceCreds: function(){
				params = {};
				return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
			},
			
			buildView: function(color){	
				var obj = this.data.hits.hits[this.counter]._source;

				if(obj.title){
					if(obj.title.search("commented on a photo") != -1 || obj.title.search("commented on a post") != -1 || obj.title.search("likes a link") != -1 || obj.title.search("commented on a link") != -1 || obj.title.search("likes a photo") != -1 || obj.title.search("own photo") != -1 || obj.title.search("own link") != -1 || obj.title.search("own video") != -1 || obj.title.search("likes a post") != -1 || obj.title.search("commented on a status") != -1 || obj.title.search("likes a video") != -1 || obj.title.search("commented on a video") != -1 || obj.title.search("own status") != -1 || obj.title.search("likes a status") != -1 || obj.title.search("like a video") != -1 || obj.title.search("own post") != -1  || obj.title.search("commented on an album") != -1){
						return;
					}
				}

				if(obj.content){
					if(obj.content.queryString){
						if(obj.content.queryString.search("commented on a photo") != -1 || obj.content.queryString.search("commented on a post") != -1 || obj.content.queryString.search("likes a link") != -1 || obj.content.queryString.search("commented on a link") != -1 || obj.content.queryString.search("likes a photo") != -1 || obj.content.queryString.search("own photo") != -1 || obj.content.queryString.search("own link") != -1 || obj.content.queryString.search("own video") != -1 || obj.content.queryString.search("likes a post") != -1 || obj.content.queryString.search("commented on a status") != -1 || obj.content.queryString.search("likes a video") != -1 || obj.content.queryString.search("commented on a video") != -1 || obj.content.queryString.search("own status") != -1 || obj.content.queryString.search("likes a status") != -1 || obj.content.queryString.search("like a video") != -1 || obj.content.queryString.search("own post") != -1  || obj.content.queryString.search("commented on an album") != -1){
							return;
						}
					}

					if(obj.content.story){
						if(obj.content.story.text){
							if(obj.content.story.text.search("commented on a photo") != -1 || obj.content.story.text.search("commented on a post") != -1 || obj.content.story.text.search("likes a link") != -1 || obj.content.story.text.search("commented on a link") != -1 || obj.content.story.text.search("likes a photo") != -1 || obj.content.story.text.search("own photo") != -1 || obj.content.story.text.search("own link") != -1 || obj.content.story.text.search("own video") != -1 || obj.content.story.text.search("likes a post") != -1 || obj.content.story.text.search("commented on a status") != -1 || obj.content.story.text.search("likes a video") != -1 || obj.content.story.text.search("commented on a video") != -1 || obj.content.story.text.search("own status") != -1 || obj.content.story.text.search("likes a status") != -1 || obj.content.story.text.search("like a video") != -1 || obj.content.story.text.search("own post") != -1 || obj.content.story.text.search("commented on an album") != -1){
								return;
							}
						}
					}

					if(obj.content.text){
						if(obj.content.text.text){
							if(obj.content.text.text.search("commented on a photo") != -1 || obj.content.text.text.search("commented on a post") != -1 || obj.content.text.text.search("likes a link") != -1 || obj.content.text.text.search("commented on a link") != -1 || obj.content.text.text.search("likes a photo") != -1 || obj.content.text.text.search("own photo") != -1 || obj.content.text.text.search("own link") != -1 || obj.content.text.text.search("own video") != -1 || obj.content.text.text.search("likes a post") != -1 || obj.content.text.text.search("commented on a status") != -1 || obj.content.text.text.search("likes a video") != -1 || obj.content.text.text.search("commented on a video") != -1 || obj.content.text.text.search("own status") != -1 || obj.content.text.text.search("likes a status") != -1 || obj.content.text.text.search("like a video") != -1 || obj.content.text.text.search("own post") != -1 || obj.content.text.text.search("commented on an album") != -1){
								return;
							}
						}
					}
				}

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

				if(this.authObj['facebook'].length > 0){
					var acctArr = this.authObj['facebook'][0]['accounts'];
					for(var g = 0; g < acctArr.length; g++){
						if(acctArr[g]['user'] == obj.mainAccountID){
							this.domNode.style.borderLeft = "5px solid " + acctArr[g]['color'];
							this.domNode.style.marginBottom = "10px";
							break;
						}else{
							this.domNode.style.borderLeft = "5x solid " + obj.mainAccountColor;
							this.domNode.style.marginBottom = "10px";
						}
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
				if(obj.actor.searchable != null && obj.actor.searchable != "undefined" && obj.actor.searchable != "N/A" && obj.actor.searchable != ""){
					this.userPic = domConstruct.create("div", {innerHTML: '<img src="https://graph.facebook.com/'+obj.actor.id+'/picture" width="50px" height="50px" />', "class": "feedPicDivItemClass"});
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
				
				this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + action + " " + locale + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>' + " - " + dateTime, "class": "feedServiceDivItemClass"});
					
				this.dateServItem = new ListItem({
					variableHeight: true,
					"class": "feedPicDateItemClass"
				});
				
				this.dateServItem.domNode.appendChild(this.servPub);
				
				this.roundRight.addChild(this.dateServItem);
				
				//PIC OR VIDEO ITEM ----------------------
				if(obj.content.picture != null && obj.content.picture != "undefined" && obj.content.picture != "" && obj.content.picture != "N/A" && obj.content.url != null && obj.content.url != "" && obj.content.url!= "undefined" && obj.content.url != "N/A"){
					this.picContent = new ListItem({
						variableHeight: true,
						"class": "feedPicContentItemClass"
					});

					if(obj.content.url.indexOf("youtube") > -1){
						if(obj.content.url.indexOf("watch?v=") > -1){
							var result = obj.content.url.split("watch?v=");
							var normalVidStuff = result[0];
							var vidID = result[1];

							if(vidID.indexOf("&") > -1){
								vidID = vidID.split("&");
								vidID = vidID[0];
							}

							var whatWeWant = normalVidStuff + "embed/" + vidID;

							var div = domConstruct.create("div", {innerHTML: '<iframe src="'+whatWeWant+'"style="max-width:90%;height:200px;"></iframe>'});

							this.picContent.domNode.appendChild(div);
							this.roundRight.addChild(this.picContent);
						}
					}else if(obj.content.url.indexOf("youtu.be") > -1){
						var result = obj.content.url.split("/");
						result = result[result.length - 1];
						var whatWeWant = "https://youtube.com/embed/" + result;

						var div = domConstruct.create("div", {innerHTML: '<iframe src="'+whatWeWant+'"style="max-width:90%;height:200px;"></iframe>'});

						this.picContent.domNode.appendChild(div);
						this.roundRight.addChild(this.picContent);
					}else if(obj.content.objectType == "video"){
						var image = new Image();
						image.src = "";
						image.src = obj.content.picture;

						var holderPicDiv = domConstruct.create("div", {innerHTML: '<span><img src="'+image.src+'" style="max-width: 100% !important; max-height: 100% !important" /></span>', style: "text-align: center"});

						var picDiv = domConstruct.create("div", {innerHTML: '<span><a href="'+obj.content.url+'" target="_blank"><img src="/app/resources/img/playButton.png" style="opacity: 0.7; max-width: 90% !important; max-height: 90% !important; background-size: contain !important; background-position: center center !important" /></a></span>', style: "margin: auto; position: absolute; top: 6px; left: 0; bottom: 0; right: 0; height: 120px; width: 120px"});

						holderPicDiv.appendChild(picDiv);

						this.picContent.domNode.appendChild(holderPicDiv);
						this.roundRight.addChild(this.picContent);

						image.onload = function(){
							if(image.width <= 200){
								holderPicDiv.parentNode.style.width = image.width + "px";
								holderPicDiv.parentNode.style.paddingBottom = "13px";
								holderPicDiv.parentNode.style.paddingTop = "13px";
							}
						}
					}else{
						if(obj.content.objectType == "photo"){
							var div = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.picture+'" style="max-width:90%;max-height:90%" /></a></span>'});
						}else{
							var div = domConstruct.create("div", {innerHTML: '<span><a href="'+obj.content.url+'" target="_blank"><img src="'+obj.content.picture+'" style="max-width:90%;max-height:90%" /></a></span>'});
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
					}
				}else{
					if(obj.content.objectType == "photo" && (obj.content.picture == null || obj.content.picture == "" || obj.content.picture == "undefined" || obj.content.picture == "N/A") && obj.content.url != null && obj.content.url != "undefined" && obj.content.url != "" && obj.content.url != "N/A"){

						this.picContent = new ListItem({
							variableHeight: true,
							"class": "feedPicContentItemClass"
						});

						var div = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.url+'" style="max-width:90%;max-height:90%" /></a></span>'});

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
				if(obj.content.text.text != null && obj.content.text.text != "undefined" && obj.content.text.text != "N/A" && obj.content.text.text != ""){
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

						this.servPub.innerHTML = '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + "posted to " + '<span><a href="' + toLinkURL +'" target="_blank">'+obj.content.to[0].name+'</a></span>' + "'s wall " + " " + locale + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>' + " - " + dateTime;

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
				}else if(obj.content.story.text != null && obj.content.story.text != "" && obj.content.story.text != "undefined" && obj.content.story.text != "N/A"){
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

				var commentPicsMined = "false";
				var commentArr = [];
				var facebookPostId = id;
				var databasePostId = this.data.hits.hits[this.counter]._source.id;

				for(var x = 0; x < comments.length; x++){
					commentArr.push(comments[x].commentId);
				}
				
				commentDiv.onclick = lang.hitch(this, function(){
					if(!this.pane){
						if(content.commentsMined && content.commentsMined === "true"){
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
							this.pi = new ProgressIndicator();
							this.pi.placeAt(document.body);
							this.pi.start();

							for(var key in this.authObj){
								if(key !== "login"){
									if(this.authObj[key].length > 0){
										var accountArr = this.authObj[key][0]['accounts'];
										for(var d = 0; d < accountArr.length; d++){
											if(accountArr[d].accessToken != undefined){
												if(source.mainAccountID == accountArr[d].user){

													var accessToken = accountArr[d].accessToken;

													this.mineFacebookCommentPics(databasePostId, facebookPostId, commentArr, accessToken).then(lang.hitch(this, function(obj){
														console.log("the returned obj is: ", obj);

														if(this.pi){
															this.pi.stop();
														}

														if(obj && obj['success']){
															this.data.hits.hits[this.counter]._source = obj['success'];

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
															this.pane = new DataObjPane({
																data: this.data,
																authObj: this.authObj,
																type: 'faceComment',
																counter: this.counter,
																parseSpecialChars: this.parseSpecialChars,
																isURL: this.isURL
															});
															this.addChild(this.pane);
														}
													}));
												}
											}
										}
									}
								}
							}
						}
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
						if(key !== "login"){
							if(this.authObj[key].length > 0){
								var accountArr = this.authObj[key][0]['accounts'];
								for(var d = 0; d < accountArr.length; d++){
									if(accountArr[d].accessToken != undefined){
										if(source.mainAccountID == accountArr[d].user){

											var accessToken = accountArr[d].accessToken;

											if(domClass.contains(likeDiv, "twitterOrangeDiv")){
												var likeId = id;

												var id = content.id;
												
												this.sendFaceLike(id, accessToken).then(lang.hitch(this, function(obj){
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
														this.setIsLiked("facebook-----"+likeId, "true");
													}
												}));
											}else{	
												var likeId = id;
																						
												var id = content.id;
												
												this.sendFaceUnLike(id, accessToken).then(lang.hitch(this, function(obj){
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
														this.setIsLiked("facebook-----"+likeId, "false");
													}
												}));
											}
										}
									}
								}
							}
						}
					}
				},likeDiv, content, id);
				
				blastDiv.onclick = lang.hitch(this, function(blastDiv, source){
					this.blastView.blastObj = {};

					this.blastView.blastObj.imgName = source.content.id;
					this.blastView.blastObj.postLink = source.postLink;
					this.blastView.blastObj.service = source.service;
					this.blastView.blastObj.poster = source.actor.displayName;
					this.blastView.blastObj.msg = source.content.text.text;

					if(source.content.picture == undefined ||
						source.content.picture == null || source.content.picture == ""){
						this.blastView.blastObj.url = "";
						this.blastView.blastObj.finalUrl = "";
					}else{
						this.blastView.blastObj.url = source.content.picture;
						this.blastView.blastObj.finalUrl = "app/post/tmpUpload/" + this.blastView.blastObj.imgName;
					}

					if(this.blastView.blastObj.finalUrl == "" || this.blastView.blastObj.finalUrl == undefined || this.blastView.blastObj.finalUrl == null){
						console.log("this.blastObj.finalUrl in facebookFeedItem is not valid");
						this.blastView.blastObj.url = "?";
						this.blastView.blastObj.imgName = "?";
					}

					console.log("this.blastObj.finalUrl in facebookFeedItem is: ", this.blastView.blastObj.finalUrl);
					
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
