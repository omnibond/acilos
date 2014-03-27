/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the feedView of the manDatabase module
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
		'dojo/_base/kernel',
		'dojo/dom-construct',
		'dojo/dom-class',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/dom-geometry',
		"dojo/on",
		
		'app/util/xhrManager',
		'app/TitleBar',
		'app/ServiceSelector',
		'app/PruneScroller',
		
		"dojox/mobile/ScrollableView",
		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/TextBox",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/ValuePickerDatePicker",
		"dijit/Calendar",
		"dijit/_FocusMixin"
		//"dojox/mobile/deviceTheme"
], function(
	declare, 
	ModuleScrollableView, 
	kernel,
	domConstruct, 
	domClass, 
	topic, 
	lang,
	domGeom,
	on,
	
	xhrManager, 
	TitleBar, 
	ServiceSelector,
	PruneScroller,
	
	ScrollableView,
	RoundRectList, 
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	TextBox, 
	ToolBarButton,
	EdgeToEdgeCategory,
	DatePicker,
	Calendar,
	FocusMixin
	//deviceTheme
) {
	return declare([ModuleScrollableView], {				
		constructor: function(){
			this.fromVar = 0;
		},
		
		buildExampleFeed: function(feedObj){
			console.log(feedObj);
			
			if(this.list){
				this.list.destroyRecursive();
			}
			
			this.list = new PruneScroller({
				"class": "feedScrollerRoundRectClassNoMarg",
				feedName: feedObj,
				getFeedData: lang.hitch(this, this.checkSpecificFeedList),
				getNextGroup: lang.hitch(this, this.getNextGroup),
				setStarred: lang.hitch(this, this.setStarred),
				setStarredClient: lang.hitch(this, this.setStarredClient),
				deleteItem: lang.hitch(this, this.deleteItem),
				deleteAll: lang.hitch(this, this.deleteAll),
				fromVar: this.fromVar,
				FeedViewID: this.id,
				view: this
			});			
			this.addChild(this.list);
			this.resize();
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);

			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			this.list.postAddToList(this.fromVar+=20);
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Delete app items"} );
			
			kernel.global.feedCount[this.id] = {};
			kernel.global.feedCount[this.id].count = 0;
			kernel.global.feedCount[this.id].services = {"Twitter": "false", "Facebook": "false", "Instagram": "false", "LinkedIn": "false"};

			this.buildExampleFeed(this.object);
			
			on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
			
		}	
	})
});
