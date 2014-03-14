/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the restoreDB part of the manDatabase module
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
		"dojo/on",
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/SelectorBar',
		'app/TitleBar',
		
		"dojox/mobile/EdgeToEdgeList",
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
	on,
	domGeom,

	xhrManager, 
	SelectorBar, 
	TitleBar, 
	
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton, 
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		
		buildIt: function(){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
			this.getBackUpList().then(lang.hitch(this, this.buildMainList));
		},
		
		buildMainList: function(obj){
			console.log("buildMainList: ", obj);
			
			this.mainList = new EdgeToEdgeList({});
				
			var list = new EdgeToEdgeList({});
			var item = new ListItem({
				label: "Click on a file to restore its data"
			});
			list.addChild(item);
			
			if(obj == null || obj.length == 0){
				var item = new ListItem({
					label: "No files have been backed up yet"
				});	
				this.mainList.addChild(item);	
			}else{
				for(var x = 0; x < obj.length; x++){
					var item = new ListItem({
						label: obj[x], 
						clickable: true,
						onClick: lang.hitch(this, function(obj, x){
							this.restoreBackUpData(obj[x]).then(lang.hitch(this, function(obj){
								if('file' in obj){
									var tempArr = obj['file'].split(".");
									var nameArr = tempArr[0].split("-");
									var date = new Date(Math.floor(nameArr[1]));
									var items = nameArr[2];

									this.response.set("label", items + " items from: " + date + " have been restored");
									this.router.goToAbsoluteRoute("/manDatabase");
								}else{
									this.response.set("label", obj['error']);
									this.router.goToAbsoluteRoute("/manDatabase");
								}
							}))
						}, obj, x)
					});	
					this.mainList.addChild(item);	
				}
			}
			this.addChild(this.mainList);
			this.resize();
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Restore previous saves"} );
			
			this.buildIt();
		}
	})
});