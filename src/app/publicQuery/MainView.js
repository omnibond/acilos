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

		"app/PublicScroller",
		"app/SearchScroller",
		"app/SelectorBar",
		'app/ServiceSelector',
		'dojox/mobile/ProgressIndicator',
		
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/TextBox",
		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",	
		"dijit/Dialog",
		
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

		PublicScroller,
		SearchScroller,
		SelectorBar,
		ServiceSelector,
		ProgressIndicator,
		
		ToolBarButton,
		TextBox,
		RoundRectList,
		EdgeToEdgeList,
		ListItem,
		Button,
		Dialog,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			startup: function(){
				this.inherited(arguments);
				
				kernel.global.feedCount[this.id] = {};
				kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			},

			constructor: function(args){
				this.postAddArray = [];				
			},

			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/', title: "Search Public Data"} );

				this.fromVar = 0;
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
				this.getServiceCreds().then(lang.hitch(this, function(obj){
					this.authObj = obj;

					this.exists = {};
					for(var key in this.authObj){	
						if(key == "facebook" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Facebook'] = true;
							}
						}
						if(key == "twitter" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Twitter'] = true;
							}
						}
						if(key == "google" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Google'] = true;
							}
						}
						/*
						if(key == "instagram" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Instagram'] = true;
							}
						}
						if(key == "linkedin" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Linkedin'] = true;
							}
						}
						*/
					}

					if(this.infoList){
						this.infoList.destroyRecursive();
						this.infoList = null;
					}

					if(this.list){
						this.list.destroyRecursive();
						this.postAddArray = [];
						this.buildList();
					}else{
						this.buildList();
					}
				}))
			},

			buildList: function(){
				this.infoList = new RoundRectList({

				});

				this.infoListItem = new ListItem({
					variableHeight: true,
					"class": "borderlessListItemClass"
				});

				var infoDiv = domConstruct.create("div", {innerHTML: "Clicking the button on the left will display search results from previous Facebook queries that are stored in your database. Clicking the \"go\" button will search live data from Facebook. Click the button with the question mark for more info."});

				this.infoListItem.domNode.appendChild(infoDiv);
				this.infoList.addChild(this.infoListItem);
				this.addChild(this.infoList);

				this.queryBox = new TextBox({
					placeHolder: "Search here",
					style: "height:19px; vertical-align: top; margin-right: 5px"
				});

				this.justQuery = new Button({
					"name": "searchButton",
					left:"true",
					onClick: lang.hitch(this, function(){
						this.fromVar = 0;
						if(this.list){
							this.list.destroyRecursive();
							this.postAddArray = [];
							this.list = null;
						}
						if(this.infoList){
							this.infoList.destroyRecursive();
							this.infoList = null;
						}
						if(this.queryBox.get("value") == ""){

						}else{
							this.list = new SearchScroller({
								feedName: this.queryBox.get("value"),
								postAddArray: this.postAddArray,
								getFeedData: lang.hitch(this, this.getPublicDBObjects),
								getNextGroup: lang.hitch(this, this.getNextGroup),
								setStarred: lang.hitch(this, this.setStarred),
								setStarredClient: lang.hitch(this, this.setStarredClient),
								fromVar: this.fromVar,
								FeedViewID: this.id,
								view: this
							});			
							this.addChild(this.list);
							this.resize();
						}
					})
				});

				this.helpButton = new Button({
					"name": "helpButton",
					onClick: lang.hitch(this, function(){
						this.dialog = new Dialog({
							title: "Help",
							draggable: false,
							"class": "helpDijitDialog",
							"style": "height: 290px !important; overflow: scroll !important",
							onHide: lang.hitch(this, function(){
								if(this.whiteoutDiv){
									document.body.removeChild(this.whiteoutDiv);
									this.whiteoutDiv = null;
								}
							})
						});

						var dialogDiv = domConstruct.create("div", {innerHTML: "<span class='helpTitle'>Normal Search</span><br>Example: red hat<br><br><span class='helpTitle'>Exact Search</span><br>Put \"quotes\" around what you would like to search for. Example: \"the red hat\"<br><br><span class='helpTitle'>How it works</span><br>Clicking the button on the left will query your database for stored search results from Facebook. Clicking the \"go\" button will search live data from Facebook"});

						this.whiteoutDiv = domConstruct.create("div", {"class": "whiteoutDiv"});

						this.dialog.set("content", dialogDiv);
						this.dialog.show();

						document.body.appendChild(this.whiteoutDiv);
					})
				});

				this.scrollButton = new Button({
					"name": "scrollButton",
					"right": "true",
					onClick: lang.hitch(this, function(){
						var scroller = lang.hitch(this, function(){
							if(this.domNode.scrollTop <= 0){
								this.domNode.scrollTop = 0;
							}else{
								this.domNode.scrollTop = this.domNode.scrollTop - (this.domNode.scrollTop*0.08);
								if(this.domNode.scrollTop !== 0){
									setTimeout(scroller, 20);
								}
							}
						});
						setTimeout(scroller, 20);
					})
				});

				this.saveButton = new Button({
					"name": "saveButton",
					"right": "true"
				});

				this.queryButton = new Button({
					"name": "goButton",
					onClick: lang.hitch(this, function(){
						this.fromVar = 0;

						if(this.pi){
							this.pi.destroyRecursive();
							this.pi = null;
						}

						if(this.list){
							this.list.destroyRecursive();
							this.postAddArray = [];
							this.list = null;
						}

						if(this.infoList){
							this.infoList.destroyRecursive();
							this.infoList = null;
						}

						this.pi = new ProgressIndicator();
						this.pi.placeAt(document.body);
						this.pi.start();

						this.checked = {};
						for(var d=0; d < this.services.currentCheckBoxes.length; d++){
							this.checked[this.services.currentCheckBoxes[d].label] = this.services.currentCheckBoxes[d].checked;
						}

						console.log("checked outside", this.checked);

						this.getPublicQueryObjects(this.queryBox.get("value"), this.authObj, this.checked).then(lang.hitch(this, function(obj, checked){

							console.log("obj inside first getPublicQueryObjects is: ", obj);
							console.log("checked inside", this.checked);

							this.list = new PublicScroller({
								feedName: this.queryBox.get("value"),
								postAddArray: this.postAddArray,
								getFeedData: lang.hitch(this, this.getPublicDBObjects),
								paginateService: lang.hitch(this, this.paginateService),
								nextToken: obj,
								checkedServices: this.checked,
								authStuff: this.authObj,
								getNextGroup: lang.hitch(this, this.getNextGroup),
								setStarred: lang.hitch(this, this.setStarred),
								setStarredClient: lang.hitch(this, this.setStarredClient),
								fromVar: this.fromVar,
								FeedViewID: this.id,
								view: this
							});			
							this.addChild(this.list);
							this.resize();

							this.pi.stop();

						}))
					})
				});
				
				this.services = new ServiceSelector({
					//checkBoxes: this.exists,
					checkBoxes: {"Facebook": true, "Twitter": true, "Linkedin": true, "Google": true, "Instagram": true},
					style: "display: inline-block"
					//vertical: "true"
				});

				console.log("the facebook check box is: ", this.services.currentCheckBoxes[0].checked);

				this.services.currentCheckBoxes[0].domNode.onclick = lang.hitch(this, function(){
					console.log("the facebook checkbox: ", this.services.currentCheckBoxes[0].checked);
				});

				this.services.currentCheckBoxes[1].domNode.onclick = lang.hitch(this, function(){
					console.log("the twitter checkbox: ", this.services.currentCheckBoxes[1].checked);
				});

				this.selectorItem = new SelectorBar({
					textBoxes: [this.queryBox],
					buttons: [this.queryButton, this.saveButton, this.scrollButton],
					serviceSelectors: [this.services],
					style: "text-align: center"
				});
				this.selectorItem.placeAt(this.domNode.parentNode);

				domStyle.set(this.infoList.domNode, "margin-top", this.selectorItem.domNode.offsetHeight+"px");


				document.body.onkeydown = lang.hitch(this, function(event){
					switch(event.keyCode){
						case 13: 
							this.queryButton.onClick();
						break;
						
						default: 
					}
				});	
			},

			dataPoints: function(){
				if(this.list){
					var pos= domGeom.position(this.list.domNode,true);
				       
					if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
						this.getNextGroup();
					}
				}
			},

			getNextGroup: function(){
				console.log(this.list.ListEnded, " ", this.list.loading);
				if(this.list.ListEnded === false && this.list.loading == false){
					console.log("going to get 20 more from mainView");
					this.list.postAddToList(this.fromVar+=20);
				}
			},
			
			deactivate: function(){
				document.body.onkeydown = '';

				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}

				if(this.infoList){
					this.infoList.destroyRecursive();
					this.infoList = null;
				}

				if(this.selectorItem){
					this.selectorItem.destroyRecursive();
					this.selectorItem = null;
				}

				if(this.pi){
					this.pi.destroyRecursive();
					this.pi = null;
				}

				if(this.whiteoutDiv){
					document.body.removeChild(this.whiteoutDiv);
					this.whiteoutDiv = null;
				}
			}
		});
	}
);
