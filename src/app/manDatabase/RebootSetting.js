/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the manDatabase module
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
		
		"app/SelEdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/RadioButton",
		"dojox/mobile/CheckBox"
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
	RadioButton,
	CheckBox
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
			
		buildMainList: function(obj){
			console.log("obj is: ", obj);

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			this.mainList = new EdgeToEdgeList({ 
				style: "margin-top: 50px"
			});

			if(obj){
				if(obj['Response']){
					if(obj['Response']['system'] && obj['Response']['system'] === true){
						var systemCheckStatus = true
					}
				}
			}

			if(obj){
				if(obj['Response']){
					if(obj['Response']['apache'] && obj['Response']['apache'] === true){
						var apacheCheckStatus = true
					}
				}
			}

			var systemCheckBox = new CheckBox({
				checked: systemCheckStatus,
				style: "height: 20px; width: 20px"
			});

			var systemCheckBoxLabel = domConstruct.create("span", {innerHTML: "Check this box to have your computer reboot every day at 3:30 am", style: "vertical-align: 4px"});

			var systemHolder = domConstruct.create("div", {});

			var apacheCheckBox = new CheckBox({
				checked: apacheCheckStatus,
				style: "height: 20px; width: 20px"
			});

			var apacheCheckBoxLabel = domConstruct.create("span", {innerHTML: "Check this box to have apache restarted to free up memory if available memory falls below a certain level", style: "vertical-align: 4px"});

			var apacheHolder = domConstruct.create("div", {});

			this.saveBut = new Button({
				"name": "saveButton",
				"right": "true",
				onClick: lang.hitch(this, function(){
					var rebootOptions = {};

					console.log("the system check box is: ", systemCheckBox.checked);
					console.log("the apache check box is: ", apacheCheckBox.checked);

					if(systemCheckBox.checked === true){
						rebootOptions['system'] = true;
					}else{
						rebootOptions['system'] = false;
					}

					if(apacheCheckBox.checked === true){
						rebootOptions['apache'] = true;
					}else{
						rebootOptions['apache'] = false;
					}

					this.saveRebootSettings(rebootOptions).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);
					}));
				})
			});

			systemHolder.appendChild(systemCheckBox.domNode);
			systemHolder.appendChild(systemCheckBoxLabel);
			this.mainList.domNode.appendChild(systemHolder);

			apacheHolder.appendChild(apacheCheckBox.domNode);
			apacheHolder.appendChild(apacheCheckBoxLabel);
			this.mainList.domNode.appendChild(apacheHolder);

			this.addChild(this.mainList);

			this.selectorItem = new SelectorBar({
				buttons: [this.saveBut],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);
		},
		
		activate: function(){
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Turn rebooting on or off"} );

			this.checkRebootSetting().then(lang.hitch(this, function(obj){
				var result = obj;

				this.buildMainList(obj);
			}));
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}
	})
});