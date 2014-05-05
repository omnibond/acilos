/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the commentPane for the mainFeed module
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
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo",

	"dojox/mobile/Container",
	"dojox/mobile/_ContentPaneMixin",

	"dojox/mobile/Accordion",
	"dojox/mobile/ContentPane",
	"dojox/mobile/Button",
	"dojox/mobile/TextBox",
	"app/SelRoundRectList",
	"app/SelEdgeToEdgeList",
	"dojox/mobile/ListItem",
	"dojox/mobile/ContentPane",

	'app/util/xhrManager',
	
	"dijit/Dialog"
], function(
	array,
	declare,
	lang,
	has,
	dom,
	domClass,
	domStyle,
	domConstruct,
	dojo,

	Container, 
	ContentPaneMixin,

	Accordion,
	ContentPane,
	Button,
	TextBox,
	RoundRectList,
	EdgeToEdgeList,
	ListItem,
	Pane,

	xhrManager,
	
	Dialog

){

	// module:
	//		dojox/mobile/ContentPane

	return declare("dojox.mobile.DataObjPane", [Container, ContentPaneMixin], {
		// summary:
		//		A very simple content pane to embed an HTML fragment.
		// description:
		//		This widget embeds an HTML fragment and runs the parser. It has
		//		the ability to load external content using dojo/_base/xhr. onLoad()
		//		is called when parsing is done and the content is
		//		ready. Compared with dijit/layout/ContentPane, this widget
		//		provides only basic fuctionality, but it is much lighter.

		baseClass: "mblContentPane",

		sendFaceComment: function(id, comment, accessToken){
			var params = {id: id, comment: comment, accessToken: accessToken};
			return xhrManager.send('POST', 'rest/v1.0/Post/sendFaceComment', params);
		},

		sendTwitReply: function(authorUsername, tweetID, message, accessToken, accessSecret, appKey, appSecret){
			var params = {authorUsername: authorUsername, tweetID: tweetID, message: message, accessToken: accessToken, accessSecret: accessSecret, appKey: appKey, appSecret: appSecret};
			console.log("params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/sendTwitReply', params);
		},
		
		sendLinkedinComments: function(id, msg, accessToken){
			var params = {id: id, msg: msg, accessToken: accessToken};
			console.log("params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/sendLinkedinComments', params);
		},
		
		sendInstaComment: function(id, msg, accessToken){
			var params = {id: id, accessToken: accessToken, msg: msg};
			console.log("params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/sendInstaComment', params);
		},

		getServiceCreds: function(){
			params = {};
			return xhrManager.send('POST', 'rest/v1.0/Credentials/getServiceCreds', params);
		},

		buildRendering: function(){
			//call buildRendering from Accordion, because that is where this class inherited from
			this.inherited(arguments);	
			//now the other buildRendering has been run and is done and comes back here to finish this Brender 
			var data = this.data;
			var counter = this.counter;
			var type = this.type;
			
			console.log("data is: ", data);

			switch(type){
				case "faceComment":
					var content = data.hits.hits[counter]._source.content;
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					var source = data.hits.hits[counter]._source;
				
					this.list = new RoundRectList({
						"class": "commentPane"
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentFacebookBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"						
					});
					var commentBut = new Button({
						label: "Post!",
						"class": "postButton",
						onClick: lang.hitch(this, function(content, source){

							for(var key in this.authObj){
								if(key !== "login"){
									if(this.authObj[key].length > 0){
										var accountArr = this.authObj[key][0]['accounts'];
										for(var d = 0; d < accountArr.length; d++){
											if(accountArr[d].accessToken != undefined){
												if(source.mainAccountID == accountArr[d].user){
													var accessToken = accountArr[d].accessToken;

													id = content.id;

													var comment = this.commentFacebookBox.get("value");

													this.sendFaceComment(id, comment, accessToken).then(lang.hitch(this, function(obj){
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
														}
													}));	
													this.commentFacebookBox.set("value", "");
												}
											}
										}
									}
								}
							}
						},content, source)
					});
					item.addChild(this.commentFacebookBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					var comLength = x.length;
					
					for(var m = 0; m < comLength; m++){
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							//label: '<img src="https://graph.facebook.com/'+x[m].userId+'/picture" width="60px" height="60px" />' + " " + x[m].name  + "<br/>" + string,
							//label: '<img src="https://graph.facebook.com/'+x[m].userId+'/picture" width="60px" height="60px" />',
							"class": "commentLikeAccordionItemClass"
						});

						var picDiv = domConstruct.create("div", {innerHTML: '<img src="https://graph.facebook.com/'+x[m].userId+'/picture" width="60px" height="60px" />'});

						var itemText = new ListItem({
							variableHeight: true,
							label: x[m].name + "<br/>" + "<br/>" + string,
							"class": "reworkedCommentClass"
						});
						
						var paneLeft = new Pane({
							"class": "paneLeftClass"
						});
						var paneRight = new Pane({
							"class": "paneRightClass"
						});
						var roundLeft = new RoundRectList({
							"class": "roundRectLeftClass"
						});
						var roundRight = new RoundRectList({
							"class": "roundRectRightClass"
						});
						paneLeft.addChild(roundLeft);
						paneRight.addChild(roundRight);
						roundLeft.domNode.appendChild(picDiv);
						roundRight.addChild(itemText);
						item.addChild(paneLeft);
						item.addChild(paneRight);

						this.list.addChild(item);
					}
					this.addChild(this.list);	
				break;
				case "twitReply":
					var x = data.hits.hits[counter]._source.content;
					var actor = data.hits.hits[counter]._source.actor;
					var source = data.hits.hits[counter]._source;
					
					this.list = new RoundRectList({
						"class": "commentPane"
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentTwitterBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"					
					});
					var replyBut = new Button({
						label: "Post",
						"class": "postButton",
						onClick: lang.hitch(this, function(source){
							this.getServiceCreds().then(lang.hitch(this, function(obj){
								this.authObj = obj;

								for(var key in this.authObj){
									if(key !== "login"){
										if(this.authObj[key].length > 0){
											var accountArr = this.authObj[key][0]['accounts'];
											for(var d = 0; d < accountArr.length; d++){
												if(accountArr[d].accessToken != undefined){
													if(source.mainAccountID == accountArr[d].user){

														var accessToken = accountArr[d].accessToken;
														var accessSecret = accountArr[d].accessSecret;
														var appKey = accountArr[d].key;
														var appSecret = accountArr[d].secret;

														console.log("data is: ", data);
														console.log("@" + actor.displayName + " message" + " ==in_reply_to_status_id");

														var tweetID = data.hits.hits[counter]._id.split("-----");
														tweetID = tweetID[1];
														var message = this.commentTwitterBox.get("value");

														this.sendTwitReply(actor.displayName, tweetID, message, accessToken, accessSecret, appKey, appSecret).then(lang.hitch(this, function(obj){
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
															}
														}));		
														this.commentTwitterBox.set("value", "");
													}
												}
											}
										}
									}
								}
							}));
						}, source)
					});
					item.addChild(this.commentTwitterBox);
					item.addChild(replyBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.addChild(this.list);
				break;
				case "instaComments":
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					var source = data.hits.hits[counter]._source;
					
					this.list = new RoundRectList({
						"class": "commentPane"
					});
					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentInstaBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"						
					});
					var commentBut = new Button({
						label: "Post!",
						"class": "postButton",
						onClick: lang.hitch(this, function(id, source){
							for(var key in this.authObj){
								if(key !== "login"){
									if(this.authObj[key].length > 0){
										var accountArr = this.authObj[key][0]['accounts'];
										for(var d = 0; d < accountArr.length; d++){
											if(accountArr[d].accessToken != undefined){
												if(source.mainAccountID == accountArr[d].user){
													
													if(this.commentInstaBox.get("value") === ""){
														console.log("Please type a comment in the box");
													}else{
														var string = this.commentInstaBox.get("value");
														this.sendInstaComment(id, this.commentInstaBox.get("value"), this.authObj[key][d].accessToken);
														var item = new ListItem({
															variableHeight: true,
															label: string + " - Posted By - You",
															"class": "commentLikeAccordionItemClass"
														});
														item.placeAt(this.list, 1);
														this.resize();
														this.expand(this.pane, true);
														this.commentInstaBox.set("value", "");
													}
												}
											}
										}
									}
								}
							}
						}, id, source)
					});
					//item.addChild(this.commentInstaBox);
					//item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					if(x.length > 10){
						var comLength = 10;
					}else{
						var comLength = x.length;
					}

					for(var m = 0; m < comLength; m++){
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
							//label: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].name  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});

						var picDiv = domConstruct.create("div", {innerHTML: '<img src="'+pic+'" width="60px" height="60px" />'});

						var itemText = new ListItem({
							variableHeight: true,
							label: x[m].name + "<br/>" + "<br/>" + string,
							"class": "reworkedCommentClass"
						});
						
						var paneLeft = new Pane({
							"class": "paneLeftClass"
						});
						var paneRight = new Pane({
							"class": "paneRightClass"
						});
						var roundLeft = new RoundRectList({
							"class": "roundRectLeftClass"
						});
						var roundRight = new RoundRectList({
							"class": "roundRectRightClass"
						});
						paneLeft.addChild(roundLeft);
						paneRight.addChild(roundRight);
						roundLeft.domNode.appendChild(picDiv);
						roundRight.addChild(itemText);
						item.addChild(paneLeft);
						item.addChild(paneRight);

						this.list.addChild(item);
					}
					this.addChild(this.list);					
				break;
				case "linkedComments":
					var x = data.hits.hits[counter]._source.content.comments;
					var idArr = data.hits.hits[counter]._source.id.split("-----");
					var id = idArr[1];
					var obj = data.hits.hits[counter]._source;
	
					this.list = new RoundRectList({
						"class": "commentPane"
					});
					this.commentLinkBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"						
					});
					var commentBut = new Button({
						label: "Post!",
						"class": "postButton",
						onClick: lang.hitch(this, function(id){
							for(var key in this.authObj){
								if(key !== "login"){
									if(this.authObj[key].length > 0){
										var accountArr = this.authObj[key][0]['accounts'];
										for(var d = 0; d < accountArr.length; d++){
											if(accountArr[d].accessToken != undefined){
												if(obj.mainAccountID == accountArr[d].user){
													if(this.commentLinkBox.get("value") === ""){
														console.log("Please type a comment in the box");
													}else{
														var string = this.commentLinkBox.get("value");

														this.sendLinkedinComments(id, this.commentLinkBox.get("value"), accountArr[d].accessToken).then(lang.hitch(this, function(obj){
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
															}

															if(obj['Success']){
																var item = new ListItem({
																	label: string + " - Posted By - You",
																	"class": "commentLikeAccordionItemClass"
																});
																item.placeAt(this.list, 1);
																this.resize();
																this.expand(this.pane, true);
																this.commentLinkBox.set("value", "");
															}
														}));
													}	
												}
											}
										}
									}
								}
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
					
					if(x.length > 10){
						var comLength = 10;
					}else{
						var comLength = x.length;
					}

					for(var m = 0; m < comLength; m++){
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
							//innerHTML: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].firstName + " " + x[m].lastName  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});

						var picDiv = domConstruct.create("div", {innerHTML: '<img src="'+pic+'" width="60px" height="60px" />'});

						var itemText = new ListItem({
							variableHeight: true,
							label: x[m].firstName + " " + x[m].lastName + "<br/>" + "<br/>" + string,
							"class": "reworkedCommentClass"
						});
						
						var paneLeft = new Pane({
							"class": "paneLeftClass"
						});
						var paneRight = new Pane({
							"class": "paneRightClass"
						});
						var roundLeft = new RoundRectList({
							"class": "roundRectLeftClass"
						});
						var roundRight = new RoundRectList({
							"class": "roundRectRightClass"
						});
						paneLeft.addChild(roundLeft);
						paneRight.addChild(roundRight);
						roundLeft.domNode.appendChild(picDiv);
						roundRight.addChild(itemText);
						item.addChild(paneLeft);
						item.addChild(paneRight);

						this.list.addChild(item);
					}
					this.addChild(this.list);					
				break;
				default:
					console.log("no service came to the accordion");
				break;
			}

		},
		
		makeHTTPS: function(url){
			if(url){
				oldURL = url.slice(4, -1);
			
				newURL = "https" + oldURL;

				return newURL;
			}else{
				return url;
			}
		}

	});
});
