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
				topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: "Create a Local Feed"} );

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
			},

			buildList: function(){
				this.infoList = new RoundRectList({

				});

				this.infoListItem = new ListItem({
					variableHeight: true,
					"class": "borderlessListItemClass"
				});

				var infoDiv = domConstruct.create("div", {innerHTML: "Clicking the search button will allow you to test your search. If you like the results, you can save the search with the save button."});

				this.infoListItem.domNode.appendChild(infoDiv);
				this.infoList.addChild(this.infoListItem);
				this.addChild(this.infoList);

				this.searchBox = new TextBox({
					placeHolder: "Enter a term to search",
					"class": "selectorTextBox"
				});

				this.searchButton = new Button({
					"name": "searchButton",
					onClick: lang.hitch(this, function(){
						if(this.infoList){
							this.infoList.destroyRecursive();
							this.infoList = null;
						}
						
						this.fromVar = 0;
						var searchString = this.searchBox.get("value");						
						if(searchString === ""){
							console.log("You must enter a term to search");
						}else{
							if(this.list){
								this.list.destroyRecursive();
								this.list = null;
							}
							if(this.emptyItem){
								this.emptyItem.destroyRecursive();
								this.emptyItem = null;
							}
							var searchString = searchString.replace(/ /gi, "+");
							
							this.showResponse(searchString);
						}
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
					"right": "true",
					onClick: lang.hitch(this, function(){
						this.dialog = new Dialog({
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
								if(feedNameTextBox.get("value") != "" && this.searchBox.get("value") != ""){	
									this.writeLocalFeed(feedNameTextBox.get("value"), this.searchBox.get("value"));

									this.dialog.hide();

									this.router.go("/LocalMainView");
								}else{
									console.log("you must enter a name for your feed");
								}	
							})
						});

						var saveDiv = domConstruct.create("div", {});

						saveDiv.appendChild(feedNameTextBox.domNode);
						saveDiv.appendChild(saveFeedButton.domNode);

						this.dialog.set("content", saveDiv);
						this.dialog.show();
					})
				});

				this.searchBoxQueryButtonHolder = domConstruct.create("div", {"class": "displayBlockOnPhoneClass"});
				this.searchBoxQueryButtonHolder.appendChild(this.searchBox.domNode);

				this.selectorItem = new SelectorBar({
					divs: [this.searchBoxQueryButtonHolder],
					buttons: [this.searchButton, this.scrollButton, this.saveButton],
					style: "text-align: center"
				});
				this.selectorItem.placeAt(this.domNode.parentNode);

				domStyle.set(this.infoList.domNode, "margin-top", this.selectorItem.domNode.offsetHeight+"px");

				document.body.onkeydown = lang.hitch(this, function(event){
					switch(event.keyCode){
						case 13: 
							this.searchButton.onClick();
						break;
						
						default: 
					}
				});	
			},

			showResponse: function(searchString){						
				//this.searchTerm is now passed to the scroller class but it still takes in the same arguments from that class
				//so terms is passed into feedName and this.from is passed to from. so the new
				//function gets the new variables but in the same manner the old one did so the
				//class still works
				this.list = new SearchScroller({
					feedName: searchString,
					blastView: this.blastView,
					getFeedData: lang.hitch(this, this.sendSearchString),
					pictureScroller: this.pictureScroller,
					getNextGroup: lang.hitch(this, this.getNextGroup),
					setStarred: lang.hitch(this, this.setStarred),
					setStarredClient: lang.hitch(this, this.setStarredClient),
					fromVar: this.fromVar,
					FeedViewID: this.id,
					view: this
				});			
				this.addChild(this.list);
				this.resize();
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

				if(this.dialog){
					this.dialog.destroyRecursive();
					this.dialog = null;
				}
			}
		});
	}
);
