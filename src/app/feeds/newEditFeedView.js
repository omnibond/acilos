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
		"dojox/mobile/CheckBox",	
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
		CheckBox,
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
				topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: "Search Public Data"} );

				

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
			},

			postCreate: function(){
				this.inherited(arguments);

				this.fromVar = 0;
				
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
				this.getServiceCreds().then(lang.hitch(this, function(obj){
					this.authObj = obj;

					this.exists = {};
					for(var key in this.authObj){	
						if(key == "facebook" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Facebook'] = false;
							}
						}
						if(key == "twitter" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Twitter'] = false;
							}
						}
						if(key == "google" && this.authObj[key][0]['accounts'].length > 0){
							if(this.authObj[key][0]['accounts'][0]['accessToken'] != undefined){
								this.exists['Google'] = false;
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
				}))
			},

			buildList: function(){
				this.infoList = new RoundRectList({

				});

				this.infoListItem = new ListItem({
					variableHeight: true,
					"class": "borderlessListItemClass"
				});

				var infoDiv = domConstruct.create("div", {innerHTML: "Clicking the \"go\" button will search live data from the services you have selected"});

				this.infoListItem.domNode.appendChild(infoDiv);
				this.infoList.addChild(this.infoListItem);
				this.addChild(this.infoList);

				this.queryBox = new TextBox({
					placeHolder: "Search here",
					"class": "selectorTextBox"
				});

				/*this.justQuery = new Button({
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
				});*/

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
					"right": "true",
					onClick: lang.hitch(this, function(){
						var dialog = new Dialog({
							title: "Save your query",
							draggable: false,
							"class": "saveDijitDialog"
						});

						var feedNameTextBox = new TextBox({
							placeHolder: "Custom feed name"
						});

						var saveFeedButton = new Button({
							label: "Save",
							style: "height: 21px; line-height: 20px",
							onClick: lang.hitch(this, function(){
								if(feedNameTextBox.get("value") != ""){
									this.checked = {};
									for(var d=0; d < this.services.currentCheckBoxes.length; d++){
										this.checked[this.services.currentCheckBoxes[d].label] = this.services.currentCheckBoxes[d].checked;
									}

									var feedArr = ["public"];
									if(mainFeedCheckBox.get("value") == "on"){
										feedArr.push("app");
									}
	
									this.writeQueryTerm(feedNameTextBox.get("value"), this.checked, this.queryBox.get("value"), feedArr);

									dialog.hide();

									this.router.goToAbsoluteRoute("/feeds");
								}else{
									console.log("you must enter a name for your feed");
								}	
							})
						});

						var mainFeedCheckBox = new CheckBox({
							"class": "saveQueryCheckBox"
						});

						var checkBoxLabelDiv = domConstruct.create("div", {innerHTML: "Merge this data into Main Feed", style: "font-size: 12px; display: inline"});

						var saveDiv = domConstruct.create("div", {});

						saveDiv.appendChild(feedNameTextBox.domNode);
						saveDiv.appendChild(saveFeedButton.domNode);
						saveDiv.appendChild(mainFeedCheckBox.domNode);
						saveDiv.appendChild(checkBoxLabelDiv);

						dialog.set("content", saveDiv);
						dialog.show();
					})
				});

				this.queryButton = new Button({
					"name": "goButton",
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

						this.checked = {};
						for(var d=0; d < this.services.currentCheckBoxes.length; d++){
							this.checked[this.services.currentCheckBoxes[d].label] = this.services.currentCheckBoxes[d].checked;
						}

						console.log("checked outside", this.checked);

						this.list = new PublicScroller({
							feedName: this.queryBox.get("value"),
							postAddArray: this.postAddArray,
							getFeedData: lang.hitch(this, this.getPublicQueryObjects),
							paginateService: lang.hitch(this, this.paginateService),
							blastView: this.blastView,
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
					})
				});

				this.publicFlag = "false";
				this.localFlag = "false";

				this.publicButton = new Button({
					"name": "publicButton",
					"right": "true",
					onClick: lang.hitch(this, function(){
						if(this.publicFlag == "false"){
							domClass.add(this.publicButton.domNode, "darkenedButton");
							this.publicFlag = "true";
						}else{
							domClass.remove(this.publicButton.domNode, "darkenedButton");
							this.publicFlag = "false";
						}
					})
				});

				this.localButton = new Button({
					"name": "localButton",
					"right": "true",
					onClick: lang.hitch(this, function(){
						if(this.localFlag == "false"){
							domClass.add(this.localButton.domNode, "darkenedButton");
							this.localFlag = "true";
						}else{
							domClass.remove(this.localButton.domNode, "darkenedButton");
							this.localFlag = "false";
						}
					})
				});

				this.searchBoxQueryButtonHolder = domConstruct.create("div", {"class": "displayBlockOnPhoneClass"});
				this.searchBoxQueryButtonHolder.appendChild(this.queryBox.domNode);
				this.searchBoxQueryButtonHolder.appendChild(this.queryButton.domNode);
				
				this.services = new ServiceSelector({
					checkBoxes: this.exists,
					//checkBoxes: {"Facebook": true, "Twitter": true, "Linkedin": true, "Google": true, "Instagram": true},
					style: "display: inline-block"
					//vertical: "true"
				});

				this.selectorItem = new SelectorBar({
					divs: [this.searchBoxQueryButtonHolder],
					buttons: [this.scrollButton, this.saveButton, this.publicButton, this.localButton],
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

				if(this.whiteoutDiv){
					document.body.removeChild(this.whiteoutDiv);
					this.whiteoutDiv = null;
				}
			}
		});
	}
);
