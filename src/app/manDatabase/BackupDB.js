/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the backupDB of the manDatabase module
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
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/ComboBox",
		
		"dojo/store/Memory"
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
	EdgeToEdgeCategory,
	ComboBox,
	
	Memory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		
		buildMainList: function(obj){
			this.mainList = new EdgeToEdgeList({
				
			});
			
			var item = new ListItem({
				label: "Select a timeframe to backup the database. These items will be removed from the app and saved for later",
				variableHeight: true,
				style: "border:none"
			});
			this.mainList.addChild(item);
			
			this.loadComboBox(obj);
			this.loadBackUpButton(obj);
			
			this.addChild(this.mainList);		
			
		},
		
		loadBackUpButton: function(obj){
			var item = new ListItem({
				variableHeight: true,
				style: "border:none"
			});
			
			this.backUp = new ToolBarButton({
				label: "BackUp Now",
				onClick: lang.hitch(this, function(){
					for(var x = 0; x < this.data['data'].length; x++){
						if(this.data['data'][x]['name'] == this.box.get("value")){
							this.backUpDB(this.data['data'][x]['value'], this.data['data'][x]['size']).then(lang.hitch(this, function(obj){
								var tempArr = obj['file'].split(".");
								var nameArr = tempArr[0].split("-");
								var date = new Date(Math.floor(nameArr[1]));
								var items = nameArr[2];

								this.response.set("label", items + " items from: " + date + " have been backed up");
								this.router.goToAbsoluteRoute("/manDatabase");
							}))
						}						
					}
				})
			});
			
			item.addChild(this.backUp);
			this.mainList.addChild(item);
		},
		
		loadComboBox: function(obj){
			var item = new ListItem({
				variableHeight: true,
				style: "border:none"
			});
			
			this.data = new Memory({
				data: [
					{name: "1 week (" + obj['one'] + " items)", value: 1, size: obj['one']},
					{name: "2 weeks (" + obj['two'] + " items)", value: 2, size: obj['two']},	
					{name: "3 weeks (" + obj['three'] + " items)", value: 3, size: obj['three']},
					{name: "1 month (" + obj['four'] + " items)", value: 4, size: obj['four']},
					{name: "everything (" + obj['all'] + " items)", value: 5, size: obj['all']}
				]
			});
			
			this.box = new ComboBox({
				store: this.data,
				style: "margin: 0 0 0 0"
			});
			this.box.loadDropDown();
			
			var tinyButton = new ToolBarButton({
				label: "\u25BC",
				style: "margin: 0 0 0 0;height:21px;width:21px;line-height:21px"
			});
			tinyButton.onClick = lang.hitch(this, function(){
				if(this.counter%2 == 0){
					this.box.closeDropDown();
				}else{
					this.box.openDropDown();
				}
				this.counter++;
			})
			
			item.addChild(this.box);
			item.addChild(tinyButton);
			this.mainList.addChild(item);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Backup the database"} );
			
			this.counter = 0;
			
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
			this.getBackUpCounts().then(lang.hitch(this, this.buildMainList));
		}
	})
});
