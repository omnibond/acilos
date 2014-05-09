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
			
			postCreate: function(){
				this.buildView();
			},
			
			handleGetObjects: function(obj){
				console.log("handleGetObjects",arguments);
				this.objects = obj;
			},

			getServiceCreds: function(){
				params = {};
				return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
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

				if(this.authObj['google'].length > 0){
					var acctArr = this.authObj['google'][0]['accounts'];
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
				if(obj.dataLocation == "local"){
					var locale = "locally";
				}else{
					var locale = "publicly";
				}
				var dateTime = this.getDate((obj.published).toString());
				this.servPub = domConstruct.create("div", {innerHTML: '<span><a href="' + obj.actor.url +'" target="_blank">'+obj.actor.displayName+'</a></span>' + " " + locale + " via " + '<span><a href="' + obj.postLink +'" target="_blank">'+obj.service+'</a></span>' + " - " + dateTime, "class": "feedServiceDivItemClass"});
								
				this.dateServItem = new ListItem({
					variableHeight: true,
					"class": "feedPicDateItemClass"
				});
				
				this.dateServItem.domNode.appendChild(this.servPub);
				
				this.roundRight.addChild(this.dateServItem);
			
				//TEXT ITEM -------------------------
				if(obj.content.header != "" && obj.content.header != null){
					var string = this.parseSpecialChars(obj.content.header);
					this.textContent = new ListItem({
						variableHeight: true,
						"class": "feedTextContentItemClass",
						label: string
					});
					this.roundRight.addChild(this.textContent);
				}
			//	if(obj.title != "" && obj.title != null){
			//		var string = this.parseSpecialChars(obj.title);
			//		this.textContent = new ListItem({
			//			variableHeight: true,
			//			"class": "feedTextContentItemClass",
			//			label: string
			//		});
			//		this.roundRight.addChild(this.textContent);
			//	}
				if(obj.content.text.text != "" && obj.content.text.text != null && obj.content.text.text != obj.content.header){					
					var string = this.parseSpecialChars(obj.content.text.text);
					this.textContent = new ListItem({
						variableHeight: true,
						"class": "feedTextContentItemClass",
						label: string
					});
					this.roundRight.addChild(this.textContent);				
				}				
				
				//PIC ITEM ----------------------
				if(obj.content.picture != "" && obj.content.picture != null){
					this.picContent = new ListItem({
						variableHeight: true,
						"class": "feedPicContentItemClass"
					});

					var div = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.picture+'" style="max-width:90%;max-height:90%;" /></a></span>'});

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

						var dialogDiv = domConstruct.create("div", {innerHTML: '<span><img src="'+obj.content.picture+'" style="" /></a></span>'});

						var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

						dialog.set("content", dialogDiv);
						dialog.show();

						document.body.appendChild(blackoutDiv);
					});

					this.picContent.domNode.appendChild(div);
					this.roundRight.addChild(this.picContent);
				}
				if(obj.content.album.url.length > 0){
					this.picContent = new ListItem({
						variableHeight: true,
						"class": "feedPicContentItemClass"
					});
					var div = domConstruct.create("div", {innerHTML: 'View Album Photos', "class": "twitterOrangeDiv"});
					div.onclick = lang.hitch(this, function(){
						this.pictureScroller.albumLinks = obj.content.album.url;
						this.pictureScroller.postText = obj.content.text.text;
						this.pictureScroller.dataObj = obj;
						this.pictureScroller.blastView = this.blastView;
						this.pictureScroller.parseSpecialChars = this.parseSpecialChars;
						window.location = '#/'+this.pictureScroller.mod+'/PictureFeedScroller';
					});
					this.picContent.domNode.appendChild(div);
					this.roundRight.addChild(this.picContent);
				}		
				
				var source = this.data.hits.hits[this.counter]._source;
				var content = this.data.hits.hits[this.counter]._source.content;
				
				var blastDiv = domConstruct.create("div", {style: "margin-left:5px", innerHTML: "Blast", "class": "twitterBlueDiv"});
				
				blastDiv.onclick = lang.hitch(this, function(blastDiv, source){
					this.blastView.blastObj = {};

					this.blastView.blastObj.imgName = source.content.id;
					this.blastView.blastObj.postLink = source.postLink;
					this.blastView.blastObj.service = source.service;
					this.blastView.blastObj.poster = source.actor.displayName;
					this.blastView.blastObj.msg = source.content.text.text;

					if(source.content.picture == undefined ||
						source.content.picture == null){
						this.blastView.blastObj.url = "";
						this.blastView.blastObj.finalUrl = "";
					}else{
						this.blastView.blastObj.url = source.content.picture;
						this.blastView.blastObj.finalUrl = "app/post/tmpUpload/" + this.blastView.blastObj.imgName;
					}
					
					this.downloadImage(this.blastView.blastObj.url, this.blastView.blastObj.imgName).then(lang.hitch(this, function(){
						window.location = "#/"+this.blastView.mod+this.blastView.route;
					}))
				}, blastDiv, source);
				
				this.commentHolder = new ListItem({
					variableHeight: true,
					"class": "feedCommentItemClass"
				});
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
