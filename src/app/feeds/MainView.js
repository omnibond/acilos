/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView for the custom feeds module
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
		
		'app/util/xhrManager',
		'app/SelectorBar',
		'app/SearchScroller',
		
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
	
	xhrManager, 
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

		deactivate: function(){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/', title: "Manage your feeds"} );

			this.mainList = new EdgeToEdgeList({
				style: "margin-top: none;"
			});

			this.publicFeeds = new ListItem({
				label: "Your public feeds",
				"class": "helpListItemClass",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/PublicMainView");
				})
			});
			
			this.localFeeds = new ListItem({
				label: "Your local feeds",
				"class": "helpListItemClass",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/LocalMainView");
				})
			});

			this.mainList.addChild(this.publicFeeds);
			this.mainList.addChild(this.localFeeds);
			this.addChild(this.mainList);
		}
	})
});