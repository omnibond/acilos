/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the feedAccordion for the mainFeed module
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
	"dojo/_base/array"
	,"dojo/_base/declare"
	,"dojo/_base/lang"
	,"dojo/_base/sniff"
	,"dojo/dom"
	,"dojo/dom-class"
	,"dojo/dom-construct"
	,"dojo"
	
	,"dijit/_Contained"
	,"dijit/_Container"
	,"dijit/_WidgetBase"
	,"dijit/registry"
	
	,"dojox/mobile/Accordion"
	,"dojox/mobile/ContentPane"
	,"dojox/mobile/ToolBarButton"
	,"dojox/mobile/TextBox"
	,"dojo-mama/util/RoundRectList"
	,"dojo-mama/util/EdgeToEdgeList"
	,"dojox/mobile/ListItem"
		
	,"require"
	
], function(
	array
	,declare
	,lang
	,has
	,dom
	,domClass
	,domConstruct
	,dojo
	
	,Contained
	,Container
	,WidgetBase
	,registry
	
	,Accordion
	,ContentPane
	,ToolBarButton
	,TextBox
	,RoundRectList
	,EdgeToEdgeList
	,ListItem
	
	,require
	
	){

	return declare("DataObjAccordion", [Accordion], {
		
		buildRendering: function(){
			//call buildRendering from Accordion, because that is where this class inherited from
			this.inherited(arguments);	
			//now the other buildRendering has been run and is done and comes back here to finish this Brender 
			var data = this.data;
			var counter = this.counter;
			var type = this.type;
			var label = this.label;
			
			this.startup();
			
			this.pane = new ContentPane({
				label: label,
				"class": "feedCommentPaneLabelClass"
			});

			switch(type){
				case "faceComment":
					var content = data.hits.hits[counter]._source.content;
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentFacebookBox = new TextBox({
						placeHolder: "Enter a comment and post it"						
					});
					var commentBut = new ToolBarButton({
						label: "Post!",
						onClick: lang.hitch(this, function(content){
							console.log(content.commentURL);				
						},content)
					});
					item.addChild(this.commentFacebookBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					for(var m = 0; m < x.length; m++){
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="https://graph.facebook.com/'+x[m].userId+'/picture" width="60px" height="60px" />' + " " + x[m].name  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.pane.addChild(this.list);	
				break;
				case "faceLike":
					var content = data.hits.hits[counter]._source.content;
					var x = data.hits.hits[counter]._source.content.likes;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var commentBut = new ToolBarButton({
						label: "Click to like",
						onClick: lang.hitch(this, function(content){
							console.log(content.likeURL);				
						},content)
					});
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					for(var m = 0; m < x.length; m++){
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="https://graph.facebook.com/'+x[m].id+'/picture" width="60px" height="60px" />' + " " + x[m].name,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.pane.addChild(this.list);
				break;
				case "twitReply":
					var x = data.hits.hits[counter]._source.content;
					var actor = data.hits.hits[counter]._source.content;
					this.list = new RoundRectList({
						
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var replyBut = new ToolBarButton({
						label: "Click to reply",
						onClick: lang.hitch(this, function(){
							console.log("@" + actor.displayName + " message" + " ==in_reply_to_status_id");			
						})
					});
					item.addChild(replyBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.pane.addChild(this.list);
				break;
				case "twitRetweet":
					var x = data.hits.hits[counter]._source.content;
					var retweet = "";
					if(x.retweet == null){
						retweet = 0;
					}else{
						retweet = x.retweet;
					}
					this.list = new RoundRectList({
						
					});	
					var item = new ListItem({
						label: retweet + " have retweeted this tweet",
						style: "border:none;margin: 0 0 0 0"
					});	
					this.list.addChild(item);	
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var retweetBut = new ToolBarButton({
						label: "Click to retweet",
						onClick: lang.hitch(this, function(){
							console.log("https://api.twitter.com/1.1/statuses/retweet/241259202004267009.json");
						})
					});
					item.addChild(retweetBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.pane.addChild(this.list);
				break;
				case "twitFavorite":
					var x = data.hits.hits[counter]._source.content;
					var favorite = "";
					if(x.favorite == null){
						favorite = 0;
					}else{
						favorite = x.favorite;
					}
					
					this.list = new RoundRectList({
						
					});	
					var item = new ListItem({
						label: favorite + " have favorited this tweet",
						style: "border:none;margin: 0 0 0 0"
					});	
					this.list.addChild(item);					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var favoriteBut = new ToolBarButton({
						label: "Click to favorite",
						onClick: lang.hitch(this, function(){
							console.log("https://api.twitter.com/1.1/favorites/create.json" + " and post " + x.id);
						})
					});
					item.addChild(favoriteBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.pane.addChild(this.list);
				break;
				case "instaLikes":
					var x = data.hits.hits[counter]._source.content.likes;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						
					});
					var likeBut = new ToolBarButton({
						label: "Click to like",
						onClick: lang.hitch(this, function(id){
							var params = ["Instagram", id]; 
							app.send('publishLike', 'php/_scaffold.php', params);
							var item = new ListItem({
								variableHeight: true,
								label: "- You liked this",
								"class": "commentLikeAccordionItemClass"
							});
							item.placeAt(this.list, 1);
							this.resize();
							this.expand(this.pane, true);
						}, id)
					});
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					item.addChild(likeBut);
					this.list.addChild(item);
					this.list.resize();
					for(var m = 0; m < x.length; m++){
						if(x[m].profileImg == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].profileImg;
						}
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].name,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					
					this.pane.addChild(this.list);
				break;
				case "instaComments":
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						
					});
					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentInstaBox = new TextBox({
						placeHolder: "Enter a comment and post it"						
					});
					var commentBut = new ToolBarButton({
						label: "Post!",
						onClick: lang.hitch(this, function(id){
							if(this.commentInstaBox.get("value") === ""){
								console.log("Please type a comment in the box");
							}else{
								var params = ["Instagram", this.commentInstaBox.get("value"), id]; 
								var string = this.parseSpecialChars(params[1]);
								app.send('publishComment', 'php/_scaffold.php', params);
								var item = new ListItem({
									variableHeight: true,
									label: string + " - Posted By - You",
									"class": "commentLikeAccordionItemClass"
								});
								item.placeAt(this.list, 1);
								this.resize();
								this.expand(this.pane, true);
							}							
						}, id)
					});
					item.addChild(this.commentInstaBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					for(var m = 0; m < x.length; m++){
						if(x[m].profileImg == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].profileImg;
						}
						if(x[m].text.text == null){
							continue;
						}
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].name  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.pane.addChild(this.list);					
				break;
				case "linkedLikes":
					var x = data.hits.hits[counter]._source.content.likes;
					var id = data.hits.hits[counter]._source.content.id;
					
					this.list = new RoundRectList({
						
					});
					var likeBut = new ToolBarButton({
						label: "Click to like",
						onClick: lang.hitch(this, function(id){
							var params = ["LinkedIn", id]; 
							app.send('publishLike', 'php/_scaffold.php', params);
							var item = new ListItem({
								label: "- You liked this",
								"class": "commentLikeAccordionItemClass"
							});
							item.placeAt(this.list, 1);
							this.resize();
							this.expand(this.pane, true);							
						}, id)
					});
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					item.addChild(likeBut);
					this.list.addChild(item);
					this.list.resize();
					
					for(var m = 0; m < x.length; m++){
						if(x[m].pictureURL == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].pictureURL;
						}
						var item = new ListItem({
							variableHeight: true,
							innerHTML: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].firstName + " " + x[m].lastName + " likes this",
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.pane.addChild(this.list);					
				break;
				case "linkedComments":
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					var obj = data.hits.hits[counter]._source;
	
					this.list = new RoundRectList({
						
					});
					this.commentLinkBox = new TextBox({
						placeHolder: "Enter a comment and post it"						
					});
					var commentBut = new ToolBarButton({
						label: "Post!",
						onClick: lang.hitch(this, function(id){
							if(this.commentLinkBox.get("value") === ""){
								console.log("Please type a comment in the box");
							}else{
								var params = ["LinkedIn", this.commentLinkBox.get("value"), id]; 
								var string = this.parseSpecialChars(params[1]);
								app.send('publishComment', 'php/_scaffold.php', params);
								var item = new ListItem({
									label: string + " - Posted By - You",
									"class": "commentLikeAccordionItemClass"
								});
								item.placeAt(this.list, 1);
								this.resize();
								this.expand(this.pane, true);
							}							
						}, id)
					});
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					item.addChild(this.commentLinkBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					for(var m = 0; m < x.length; m++){
						if(x[m].pictureURL == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].pictureURL;
						}
						if(x[m].text.text == null){
							continue;
						}
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							innerHTML: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].firstName + " " + x[m].lastName  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.pane.addChild(this.list);					
				break;
				default:
					console.log("no service came to the accordion");
				break;
			}
			
			this.addChild(this.pane);
		},
		
		makeHTTPS: function(url){
			if(url){
				oldURL = url.slice(4, -1);
			
				newURL = "https" + oldURL;

				return newURL;
			}else{
				return url;
			}
		},
		
		expand: function(){
			//This call can get very expensive so I am trying to put it after the page build and it will hit all FB stuff at once
			if(this.type == "faceComment" || this.type == "faceLike"){
				var call = 0;
				if(call === 0){
					//passing in this.div breaks it for some reason must use registry.byId
					//FB.XFBML.parse(this.div);
					FB.XFBML.parse(this.pane.domNode);
					call = 1;
				}
			}
			this.inherited(arguments);
		}
		
	});
});
