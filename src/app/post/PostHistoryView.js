/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the post module
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
		"dojo/_base/lang",
		"dojo/dom-class",
		"dojo/dom-style",

		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",
		"dojox/mobile/CheckBox",
		'dojox/mobile/TextArea',
		'dojox/mobile/Button',
		"dojox/mobile/ListItem",
		"dojox/mobile/TextBox",
		"dijit/Calendar",
		"dojox/mobile/RadioButton",
		"dojox/mobile/Accordion",
		"dojox/mobile/ContentPane",
		
		"dojox/form/Uploader",
		"dojox/form/uploader/_IFrame",
		
		"app/post/FileList",
		"app/SelectorBar",
		"dijit/Dialog",

		'dojo/dom-construct',
		'dojo/topic',
		'dojo/has'
], function(
	declare, 
	ModuleScrollableView,
	lang,
	domClass,
	domStyle,

	RoundRectList, 
	EdgeToEdgeList,
	CheckBox,
	TextArea,
	Button,
	ListItem,
	TextBox,
	Calendar,
	RadioButton,
	Accordion,
	ContentPane,
	
	Uploader,
	iFramePlugin,
	
	FileList,
	SelectorBar,
	Dialog,
	
	domConstruct, 
	topic,
	has
) {
	return declare([ModuleScrollableView], {		
		activate: function(){
			topic.publish("/dojo-mama/updateSubNav", {back: "/post", title: "Your posts"} );

			this.getPostHistory().then(lang.hitch(this, function(obj){
				if(obj['success']){
					successObj = JSON.parse(obj['success']);
				}else{
					successObj = '';
				}

				this.buildList(successObj);
			}));
		},

		buildList: function(successObj){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}

			this.mainList = new RoundRectList({
				style: "margin: none; margin-top: 50px; border: none"
			});

			this.helpDiv = domConstruct.create("div", {innerHTML: "This is a list of your posts. Successful posts will be white, and posts that failed on one or more services will be red. Clicking on one of the failed posts will expand an accordion that will show more details about the post's failure.", style: "color: black; margin-bottom: 10px"});

			this.mainList.domNode.appendChild(this.helpDiv);

			console.log("successObj is: ", successObj);

			if(successObj != '' && successObj != "undefined" && successObj != null){
				for(var key in successObj){
					//console.log("the key's value is: ", successObj[key]);

					var color = 'white';
					var facebookFailure = "false";
					var linkedinFailure = "false";
					var twitterFailure = "false";

					if(successObj[key]['facebook']){
						if(successObj[key]['facebook']['response']){
							if(successObj[key]['facebook']['response']['failure']){
								color = '#FF9494';
								var facebookFailure = "true";
							}
						}
					}

					if(successObj[key]['linkedin']){
						if(successObj[key]['linkedin']['response']){
							if(successObj[key]['linkedin']['response']['failure']){
								color = '#FF9494';
								var linkedinFailure = "true";
							}
						}
					}

					if(successObj[key]['twitter']){
						if(successObj[key]['twitter']['response']){
							if(successObj[key]['twitter']['response']['failure']){
								color = '#FF9494';
								var twitterFailure = "true";
							}
						}
					}

					var labelValue = "";

					if(successObj[key]){						
						if(successObj[key]['msg']){
							if(successObj[key]['postStatus']){
								if(twitterFailure == "true" || facebookFailure == "true" || linkedinFailure == "true"){
									labelValue = successObj[key]['msg'] + " --> " + "attempted on " + successObj[key]['date'] + " at " + successObj[key]['time'];
								}else if(successObj[key]['postStatus'] == "completed"){
									labelValue = successObj[key]['msg'] + " --> " + "completed on " + successObj[key]['date'] + " at " + successObj[key]['time'];
								}else if(successObj[key]['postStatus'] == "pending"){
									labelValue = successObj[key]['msg'] + " --> " + "pending for " + successObj[key]['date'] + " at " + successObj[key]['time'];
								}
							}
						}	
					}

					var accordion = new Accordion({
						"class": "feedAccordionClass postAccordionClass",
						style: "background-color: " + color + "; padding: 5px"
					});
					accordion.startup();

					var pane = new ContentPane({
						label: labelValue
					});					
					var list = new EdgeToEdgeList({	});

					if(facebookFailure && (facebookFailure == "true")){
						var facebookFailureDiv = domConstruct.create("div", {innerHTML: "Facebook failure - " + successObj[key]['facebook']['response']['msg'] + "\n\r" + "We tried to post this status for you " + (successObj[key]['facebook']['faceCounter'] - 1) + " additional times.", style: "background-color: " + color + "; border: none; height: auto"});

						list.domNode.appendChild(facebookFailureDiv);
					}

					if(linkedinFailure && (linkedinFailure == "true")){
						var linkedinFailureDiv = domConstruct.create("div", {innerHTML: "LinkedIn failure - " + successObj[key]['linkedin']['response']['msg'] + "<br><br>" + "We tried to post this status for you " + (successObj[key]['linkedin']['linkCounter'] - 1) + " additional times.", style: "background-color: " + color + "; border: none; height: auto"});

						list.domNode.appendChild(linkedinFailureDiv);
					}

					if(twitterFailure && (twitterFailure == "true")){
						var twitterFailureDiv = domConstruct.create("div", {innerHTML: "Twitter failure - " + successObj[key]['twitter']['response']['msg'] + "<br><br>" + "We tried to post this status for you " + (successObj[key]['twitter']['twitterCounter'] - 1) + " additional times.", style: "background-color: " + color + "; border: none; height: auto"});

						list.domNode.appendChild(twitterFailureDiv);
					}

					pane.addChild(list);
					accordion.addChild(pane);

					var item = new ListItem({
						variableHeight: true
					})

					item.domNode.appendChild(accordion.domNode);										

					this.mainList.addChild(item);
				}
			}else{
				var errorDiv = domConstruct.create("div", {innerHTML: "You don't have any scheduled posts.", style: "color: black"});
				this.mainList.domNode.appendChild(errorDiv);
			}

			this.deletePostButton = new Button({
				"name": "deleteFeedButton",
				"right": "true",
				onClick: lang.hitch(this, function(){
					this.router.go("/DeletePostView");
				})
			});

			this.selectorItem = new SelectorBar({
				buttons: [this.deletePostButton],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);

			this.addChild(this.mainList);
			this.resize();
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}
	});
});