/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the feeds that can be deleted for the custom feeds module
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
		'dojo/dom-class',
		
		'app/util/xhrManager',
		'app/TitleBar',
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
	domClass,
	
	xhrManager, 
	TitleBar, 
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
		
		/*buildMainList: function(obj){
			console.log("buildMainList: ", obj);
			
			this.mainList = new EdgeToEdgeList({
				
			});
			if(obj == null || obj.length == 0){
				var item = new ListItem({
					label: "No feeds have been saved yet"
				});	
				this.mainList.addChild(item);	
			}else{
				for(var x = 0; x < obj.length; x++){
					var item = new ListItem({
						label: obj[x].name,
						clickable: true,
						onClick: lang.hitch(this, function(obj, x){
							this.deleteFeedList(obj[x].name).then(lang.hitch(this, function(){
								this.router.go("/");
							}))
						}, obj, x)
					});	
					//var divDelete = domConstruct.create("span", {innerHTML: "<img src=app/resources/img/minus_icon_small.png>", title: "Delete a Feed"});
					//var divLabel = domConstruct.create("span", {innerHTML: obj[x].name,});
					
					//item.domNode.appendChild(divDelete);
					//item.domNode.appendChild(divLabel);
					//domClass.add(divDelete, "selectorButton");
					this.mainList.addChild(item);	
				}
			}
			this.addChild(this.mainList);
			
		},*/

		buildMainList: function(obj){
			console.log("buildMainList: ", obj);

			this.mainList = new EdgeToEdgeList({
				
			});

			if(obj == null || obj.length == 0){
				var item = new ListItem({
					label: "No feeds have been saved yet"
				});	
				this.mainList.addChild(item);	
			}else{
				for(var key in obj){
					var item = new ListItem({
						label: key,
						clickable: true,
						onClick: lang.hitch(this, function(obj, key){
							this.deletePublicQueryObjectTerm(key).then(lang.hitch(this, function(){
								this.router.go("/");
							}));
						}, obj, key)
					});

					this.mainList.addChild(item);
				}
			}
			this.addChild(this.mainList);
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/feeds', title: "Select a feed to delete"} );
				
			/*if(this.mainList){
				this.mainList.destroyRecursive();
				this.getFeedList().then(lang.hitch(this, this.buildMainList));
			}else{
				this.getFeedList().then(lang.hitch(this, this.buildMainList));
			}*/

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.getPublicQueryObject().then(lang.hitch(this, this.buildMainList));
			}else{
				this.getPublicQueryObject().then(lang.hitch(this, this.buildMainList));
			}
		}
	})
});