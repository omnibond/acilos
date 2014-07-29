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

			this.helpDiv = domConstruct.create("div", {innerHTML: "This is a list of your posts. Successful posts will be white, and posts that failed on one or more services will be red. Clicking on one of the posts will take you to a page where you can send the post again if you want.", style: "color: black; margin-bottom: 10px"});

			this.mainList.domNode.appendChild(this.helpDiv);

			if(successObj != '' && successObj != "undefined" && successObj != null){
				for(var key in successObj){
					console.log("the key's value is: ", successObj[key]);

					var color = 'white';

					if(successObj[key]['facebook']){
						if(successObj[key]['facebook']['result']){
							if(successObj[key]['facebook']['result'] == 'failure'){
								color = '#FF9494';
							}
						}
					}

					if(successObj[key]['linkedin']){
						if(successObj[key]['linkedin']['result']){
							if(successObj[key]['linkedin']['result'] == 'failure'){
								color = '#FF9494';
							}
						}
					}

					if(successObj[key]['twitter']){
						if(successObj[key]['twitter']['result']){
							if(successObj[key]['twitter']['result'] == 'failure'){
								color = '#FF9494';
							}
						}
					}

					var listItem = new ListItem({
						style: "background-color: " + color,
						label: successObj[key]['msg'],
						variableHeight: true,
						clickable: true,
						noArrow: true
					});

					this.mainList.addChild(listItem);
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