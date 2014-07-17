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
		"dojox/mobile/RadioButton"
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
	RadioButton
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
			
		buildMainList: function(obj){
			console.log("obj is: ", obj);

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			this.checkObj = {};

			if(obj['Response']){
				if(obj['Response'] == "true"){
					this.checkObj['on'] = true;
					this.checkObj['off'] = false;
				}else if(obj['Response'] == "false"){
					this.checkObj['on'] = false;
					this.checkObj['off'] = true;
				}else{
					this.checkObj['on'] = false;
					this.checkObj['off'] = true;
				}
			}

			this.mainList = new EdgeToEdgeList({ 
				style: "margin-top: 50px"
			});

			var onDiv = domConstruct.create("span", {innerHTML: "Select this option to have your computer reboot every day at 3:30 am" + "<br>"});

			var offDiv = domConstruct.create("span", {innerHTML: "Select this option and acilos will not reboot your computer", style: "margin-top: 10px"});

			var onRadioButton = new RadioButton({
				checked: this.checkObj['on'],
				"class": "slightlyLargerCheckBox"
			});

			var offRadioButton = new RadioButton({
				checked: this.checkObj['off'],
				"class": "slightlyLargerCheckBox",
				style: "margin-top: 10px"
			});

			this.saveBut = new Button({
				"name": "saveButton",
				"right": "true",
				onClick: lang.hitch(this, function(){
					console.log("clickky");

					var rebootOption = {};

					console.log("button checked state ", onRadioButton.checked);

					if(onRadioButton.checked == true){
						console.log("it's true");
						rebootOption['reboot'] = "true";
					}else{
						console.log("it's false");
						rebootOption['reboot'] = "false";
					}

					this.saveRebootSetting(rebootOption['reboot']).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);
					}));
				})
			});

			this.mainList.addChild(onRadioButton);
			this.mainList.domNode.appendChild(onDiv);
			this.mainList.addChild(offRadioButton);
			this.mainList.domNode.appendChild(offDiv);

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