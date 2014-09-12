/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the searchView for the mainFeed module
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
		"dojo/_base/declare",
		"dijit/registry",
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
		'dojo/topic',
		"dojo/_base/event",
		"dojo/_base/array",
		"dojo/mouse",
        'dojo/dom-geometry',
		
		'dojo-mama/views/ModuleScrollableView',
		'dojo-mama/views/ModuleView',
		
		"app/mainFeed/facebookFeedItem",
		"app/mainFeed/twitterFeedItem",
		"app/mainFeed/linkedinFeedItem",
		"app/mainFeed/instagramFeedItem",
		"app/mainFeed/FeedScroller",
		"app/SearchScroller",
		"app/TitleBar",
		"app/SelectorBar",
		
		"dojox/mobile/sniff",
		"dojox/mobile/_css3",
		"dojox/mobile/ScrollableView",
		"dojox/mobile/Heading",
		"dojox/mobile/ToolBarButton",
		"app/SelRoundRectList",	
		"dojox/mobile/ListItem",
		"dojox/mobile/Accordion",
		"dojox/mobile/ContentPane",		
		"dojox/mobile/Button",	
		"dojox/mobile/TextBox",	
		"dijit/Dialog",
		
		"dojo/ready"

	], function(
		declare,
		registry,
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
		topic,
		event,
		array,
		mouse,
		domGeom,
		
		ModuleScrollableView,
		ModuleView,
		
		facebookFeedItem,
		twitterFeedItem,
		linkedinFeedItem,
		instagramFeedItem,
		FeedScroller,
		SearchScroller,
		TitleBar,
		SelectorBar,

		has,
		css3,
		ScrollableView,
		Heading,
		ToolBarButton,
		RoundRectList,
		ListItem,
		Accordion,
		Pane,
		Button,
		TextBox,
		Dialog,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			style: "overflow:scroll",

			constructor: function(args){
				this.postAddArray = [];				
			},
			
			startup: function(){
				this.inherited(arguments);
				
				kernel.global.feedCount[this.id] = {};
				kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			},

			activate: function() {
				topic.publish("/dojo-mama/updateSubNav", {back: '/mainFeed', title: "Content Query"} );

				kernel.global.feedCount[this.id].count = 0;
				
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
				this.manualRefreshBut = new Button({
					"name": "manualRefreshButton",
					"left": "true",
					onClick: lang.hitch(this, function(){
						this.manualRefresh(kernel.global.feedCount[this.id].services).then(lang.hitch(this, function(obj){
								//stuff here
						}));
						if(this.list){
							this.list.destroyRecursive();
							this.postAddArray = [];
							this.buildFeedList();
						}
					})
				});
				console.log("WSTUUUUUF", this.queryObjViewed);
				if(this.queryObjViewed){
					this.searchBox = new TextBox({
						value: this.queryObjViewed,
						style: "height:19px; vertical-align: top; margin-right: 5px; margin-top: 5px"
					});
				}else{
					this.searchBox = new TextBox({
						placeHolder: "Enter a term to search",
						style: "height:19px; vertical-align: top; margin-right: 5px; margin-top: 5px"
					});
				}
				this.searchButton = new Button({
					"name": "searchButton",
					onClick: lang.hitch(this, function(){
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
								if(feedNameTextBox.get("value") != "" && this.searchBox.get("value") != ""){	
									this.writeLocalFeed(feedNameTextBox.get("value"), this.searchBox.get("value"));

									dialog.hide();

									this.router.goToAbsoluteRoute("/feeds");
								}else{
									console.log("you must enter a name for your feed");
								}	
							})
						});

						var saveDiv = domConstruct.create("div", {});

						saveDiv.appendChild(feedNameTextBox.domNode);
						saveDiv.appendChild(saveFeedButton.domNode);

						dialog.set("content", saveDiv);
						dialog.show();
					})
				});

				this.helpButton = new Button({
					"name": "helpButton",
					onClick: lang.hitch(this, function(){
						this.dialog = new Dialog({
							title: "Help",
							draggable: false,
							"class": "helpDijitDialog",
							onHide: lang.hitch(this, function(){
								if(this.whiteoutDiv){
									document.body.removeChild(this.whiteoutDiv);
									this.whiteoutDiv = null;
								}
							})
						});

						var dialogDiv = domConstruct.create("div", {innerHTML: "<span class='helpTitle'>User Search</span><br>Bob Dole: your text here<br><br><span class='helpTitle'>Service Search</span><br>Facebook: your text here<br><br><span class='helpTitle'>Exact Search</span><br>Put \"quotes\" around what you would like to search for"});

						this.whiteoutDiv = domConstruct.create("div", {"class": "whiteoutDiv"});

						this.dialog.set("content", dialogDiv);
						this.dialog.show();

						document.body.appendChild(this.whiteoutDiv);
					})
				});

				this.selectorItem = new SelectorBar({
					textBoxes: [this.searchBox],
					buttons: [this.manualRefreshBut, this.searchButton, this.scrollButton, this.saveButton],
					toolTips: [this.helpButton],
					style: "text-align: center"
				});
				this.selectorItem.placeAt(this.domNode.parentNode);	

				if(this.list){
					console.log("List exists, transitioning to last place now");
					
					var kids = this.list.getChildren();
					if(domClass.contains(kids[0].id, "feedSearchErrorClass")){
						this.list.destroyRecursive();
						this.buildFeedList();
						this.loading = false;
					}
				}else{
					console.log("No list made, making one now");
					
					on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
					
					this.buildFeedList();
					this.loading = false;
				}

				document.body.onkeydown = lang.hitch(this, function(event){
					switch(event.keyCode){
						case 13: 
							this.searchButton.onClick();
						break;
						
						default: 
					}
				});
			},

			deactivate: function(){
				document.body.onkeydown = '';
				if(this.selectorItem){
					this.selectorItem.destroyRecursive();
					this.selectorItem = null;
				}
				if(this.list){
					this.list.destroyRecursive();
					this.list= null;
				}
				if(this.emptyItem){
					this.emptyItem.destroyRecursive();
					this.emptyItem = null;
				}

				if(this.dialog){
					this.dialog.destroy();
					this.dialog = null;
				}

				if(this.whiteoutDiv){
					document.body.removeChild(this.whiteoutDiv);
					this.whiteoutDiv = null;
				}
			},
			
			dataPoints: function(){
				var pos= domGeom.position(this.list.domNode,true);

				if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
					if(this.loading == false){
						this.getNextGroup();
					}
				}
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
			
			getNextGroup: function(){
				if(this.list.ListEnded == false){
					this.loading = true;
					this.list.postAddToList(this.fromVar+=20);
					this.loading = false;
				}
			},
			
			buildFeedList: function(){
				//this is what we searched for on the mainFeed textbox		
				console.log("QUERYOBJ: ", this.queryObj);
				if(this.queryObj == undefined){
					this.emptyItem = new ListItem({
						variableHeight: true,
						style: "border:none;margin-top:50px",
						label: "Enter a search term in the textbox above to search the database"
					});
					this.addChild(this.emptyItem);
				}else{
					this.list = new SearchScroller({
						feedName: this.queryObj,
						blastView: this.blastView,
						postAddArray: this.postAddArray,
						pictureScroller: this.pictureScroller,
						getFeedData: lang.hitch(this, this.sendSearchString),
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
			}
			
		});
	}
);
