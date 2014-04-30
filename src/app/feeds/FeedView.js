/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the feedView for the custom feeds module
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
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/dom-geometry',
		"dojo/on",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		'app/TitleBar',
		"app/SelectorBar",
		"app/SearchScroller",
		
		"dojox/mobile/ScrollableView",
		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
], function(
	declare, 
	ModuleScrollableView, 
	domConstruct, 
	topic, 
	lang,
	domGeom,
	on,
	kernel, 
	
	xhrManager, 
	TitleBar, 
	SelectorBar,
	SearchScroller,
	
	ScrollableView,
	RoundRectList, 
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton,
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		
		constructor: function(){
			this.fromVar = 0;
		},
		
		buildFeedList: function(){
			kernel.global.feedCount[this.id] = {};
			kernel.global.feedCount[this.id].count = 0;
			kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};
			
			if(this.list){
				this.list.destroyRecursive();
				this.list = null;
			}

			console.log("this.searchString is: ", this.searchString);
			this.searchString = this.searchString.replace(/ /gi, "+");

			this.list = new SearchScroller({
				feedName: this.searchString,
				blastView: this.blastView,
				getFeedData: lang.hitch(this, this.sendSearchString),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				fromVar: this.fromVar,
				FeedViewID: this.id,
				view: this
			});			
			this.addChild(this.list);
			this.resize();

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

			this.selectorItem = new SelectorBar({
				buttons: [this.scrollButton]
			});			
			this.selectorItem.placeAt(this.domNode.parentNode);
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);

			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			if(this.list.ListEnded === false && this.list.loading == false){
				this.list.postAddToList(this.fromVar+=20);
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: e.params.feedName} );

			console.log("e.params is: from activate: ", e.params);

			if(this.feedName != e.params.feedName){
				if(this.list){
					this.list.destroyRecursive();
					this.list = null;
					this.fromVar = 0;
					this.buildFeedList();
				}else{
					this.fromVar = 0;
					this.buildFeedList();
				}
			}else{
				if(!this.list){
					this.fromVar = 0;
					this.buildFeedList();
				}
			}
			this.feedName = e.params.feedName;

			if(!this.selectorItem){
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
				
				this.selectorItem = new SelectorBar({
					buttons: [this.scrollButton]
				});			
				this.selectorItem.placeAt(this.domNode.parentNode);
			}

			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}
	})
});