/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the MainView for the favoritePeople module
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
		"dojo-mama/util/RoundRectList",	
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
		ListItem,
		Button,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			constructor: function(args){
				this.fromVar = 0;
			},
			
			activate: function() {
				topic.publish("/dojo-mama/updateSubNav", {back: '/favorites', title: "Favorite Posts"} );
				
				kernel.global.feedCount[this.id] = {};
				kernel.global.feedCount[this.id].count = 0;
				kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
				
				if(this.list){
					this.list.destroyRecursive();
					this.buildFavList();
				}else{
					console.log("No list made, making one now");
					
					on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
					this.buildFavList();
				}
			},
			
			buildFavList: function(){				
				this.scrollButton = new Button({
					"name": "scrollButton",
					onClick: lang.hitch(this, function(){
						var scroller = lang.hitch(this, function(){
							if(this.domNode.scrollTop <= 0){
								this.domNode.scrollTop = 0;
							}else{
								this.domNode.scrollTop = this.domNode.scrollTop - (this.domNode.scrollTop*.08);
								if(this.domNode.scrollTop != 0){
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
							console.log("obj is: ", obj);

							if(this.list && obj){
								this.list.destroyRecursive();
								this.buildFeedList();
								this.loading = false;
							}
						}))
					})
				});

				this.selectorItem = new SelectorBar({
					buttons: [this.scrollButton, this.manualRefreshBut]
				})
				this.selectorItem.placeAt(this.domNode.parentNode);
				//this.searchTerm is now passed to the scroller class but it still takes in the same arguments from that class
				//so terms is passed into feedName and this.from is passed to from. so the new
				//function gets the new variables but in the same manner the old one did so the
				//class still works
				this.list = new SearchScroller({
					feedName: 'all',
					getFeedData: lang.hitch(this, this.searchStarred),
					getNextGroup: lang.hitch(this, this.getNextGroup),
					//setStarred: lang.hitch(this, this.setStarred),
					setStarredClient: this.setStarredClient,
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
				this.list.postAddToList(this.list.fromVar+=20);
			},
			
			deactivate: function(){
				if(this.selectorItem){
					this.selectorItem.destroyRecursive();
					this.selectorItem = null;
				}
			}
		});
	}
);
