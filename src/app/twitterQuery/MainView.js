/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This is the mainView for the appHelp module
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
		"dojo/_base/declare",
		'dojo/_base/kernel',
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-construct",
		"dojo/dom-geometry",
		"dojo/_base/window",
		"dojo/_base/connect",
		"dojo/dom-style",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/on",
		"dojo/_base/event",
		"dojo/mouse",
	    'dojo/dom-geometry',
		'dojo/topic',
		
		'dojo-mama/views/ModuleScrollableView',

		"app/SearchScroller",
		"app/SelectorBar",
		
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/TextBox",
		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",	
		
		"dojo/ready"

	], function(
		declare,
		kernel,
		dom,
		domClass,
		domConstruct,
		domGeometry,
		domWindow,
		connect,
		domStyle,
		domAttr,
		lang,
		on,
		event,
		mouse,
		domGeom,
		topic,
		
		ModuleScrollableView,

		SearchScroller,
		SelectorBar,
		
		ToolBarButton,
		TextBox,
		RoundRectList,
		EdgeToEdgeList,
		ListItem,
		Button,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/query', title: "Search Twitter"} );

				this.buildList();
			},

			buildList: function(){
				this.mainList = new RoundRectList({

				});

				this.queryListItem = new ListItem({
					variableHeight: true,
					"class": "borderlessListItemClass"
				});

				this.queryBox = new TextBox({
					placeHolder: "Search here"
				});

				this.queryButton = new Button({
					label: "Search",
					onClick: lang.hitch(this, function(){
						console.log("you searched for: ", this.queryBox.get("value"));

						this.getServiceCreds().then(lang.hitch(this, function(obj){
							this.authObj = obj;
							console.log("this.authObj is: ", this.authObj);

							for(var key in this.authObj){
								if(key !== "login"){
									if(this.authObj[key].length > 0 && key == "twitter"){
										var accountArr = this.authObj[key][0]['accounts'];
										if(accountArr[0].accessToken != undefined){


											//for facebook
											//accountArr[d].key = this.authObj[key].key;
											//accountArr[d].secret = this.authObj[key].secret;

											this.queryTwitter(this.queryBox.get("value"), this.authObj[key]).then(lang.hitch(this, function(obj){
												console.log("returned object is: ", obj);
											}))
										}
									}
								}
							}
						}));
					})
				});

				this.queryListItem.addChild(this.queryBox);
				this.queryListItem.addChild(this.queryButton);
				this.mainList.addChild(this.queryListItem);
				this.addChild(this.mainList);
			},
			
			deactivate: function(){
				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
			}
		});
	}
);
