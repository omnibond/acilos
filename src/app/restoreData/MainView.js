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
		"dojo/store/Memory",
		
		'app/util/xhrManager',
		'app/SelectorBar',
		'app/TitleBar',
		
		"app/SelEdgeToEdgeList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/CheckBox",
		"dojox/mobile/ComboBox",
		'dojox/mobile/ProgressIndicator',
		"dojox/mobile/EdgeToEdgeCategory"
], function(
	declare, 
	ModuleScrollableView, 
	domConstruct, 
	topic, 
	lang,
	on,
	domGeom,
	Memory,

	xhrManager, 
	SelectorBar, 
	TitleBar, 
	
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton, 
	CheckBox,
	ComboBox,
	ProgressIndicator,
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
			
		buildDataList: function(obj){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			obj = obj['success'];

			this.mainList = new EdgeToEdgeList({ });

			console.log("obj is: ", obj);

			this.backupList = [];

			for(var x = 0; x < obj.length; x++){
				var date = new Date(obj[x] * 1000);

				date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " on " + (date.getMonth() - 1) + "-" + date.getDate() +  "-" + date.getFullYear();

				this.backupList[x] = {'name': date};
			}

			this.backupStore = new Memory({
				idProperty: "name",
				data: this.backupList
			});

			console.log("this.backupList is: ", this.backupList);

			this.backupFileComboBox = new ComboBox({
				store: this.backupStore,
				placeholder: "Select a backup file",
				style: "margin-bottom: 10px"
			});

			console.log("this.backupFileComboBox is: ", this.backupFileComboBox);

			this.instructionDiv = domConstruct.create("div", {innerHTML: "This page will allow you to restore backed up items to your database. You can also choose to restore your backed up service credentials.", style: "margin-bottom: 10px"});

			this.selectOptionsDiv = domConstruct.create("div", {innerHTML: "You may select any of the following options that apply to you.", style: "margin-bottom: 10px; font-weight: bold"});

			this.credentialsBox = new CheckBox({
				checked: false,
				style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
			});

			this.credsOptionDiv = domConstruct.create("div", {innerHTML: "Check this box to restore your service credentials in addition to your other data.", style: "display: inline-block; margin-left: 5px"});

			this.credentialsWrapperDiv = domConstruct.create("div", {});

			this.wipeDataBox = new CheckBox({
				checked: false,
				style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
			});

			this.wipeDataDiv = domConstruct.create("div", {innerHTML: "Check this box to also wipe the current data in the database before you restore your backed up data.", style: "display: inline-block; margin-left: 5px"});

			this.wipeDataWrapperDiv = domConstruct.create("div", {});

			this.restoreButton = new Button({
				label: "Restore data from backup",
				style: "margin-top: 10px",
				onClick: lang.hitch(this, function(){
					console.log("this.backupFileComboBox is: ", this.backupFileComboBox);
					var fileName = this.backupFileComboBox.textbox.value;

					console.log("fileName is: ", fileName);

					var re = /^[a-zA-Z0-9-]+$/;

					if(fileName == ""){
						alert("You must enter a name for your backup file");
					}else{
						if(!re.test(fileName)){
							alert("The name may only contain letters, numbers, and dashes.");
						}else{
							this.pi = new ProgressIndicator();
							this.pi.placeAt(document.body);
							this.pi.start();

							if(this.credentialsBox.get("checked") == false){
								var restoreServiceCreds = "false";
							}else if(this.credentialsBox.get("checked") == true){
								var restoreServiceCreds = "true";
							}

							if(this.wipeDataBox.get("checked") == false){
								var wipeDBData = "false";
							}else if(this.wipeDataBox.get("checked") == true){
								var wipeDBData = "true";
							}

							this.importBackupData(fileName, restoreServiceCreds, wipeDBData).then(lang.hitch(this, function(obj){
								console.log("obj is: ", obj);

								this.pi.stop();

								this.router.goToAbsoluteRoute("/settings");
							}));
						}
					}
				})
			});

			this.credentialsWrapperDiv.appendChild(this.credentialsBox.domNode);
			this.credentialsWrapperDiv.appendChild(this.credsOptionDiv);

			this.wipeDataWrapperDiv.appendChild(this.wipeDataBox.domNode);
			this.wipeDataWrapperDiv.appendChild(this.wipeDataDiv);

			this.mainList.domNode.appendChild(this.instructionDiv);
			this.mainList.domNode.appendChild(this.selectOptionsDiv);
			this.mainList.addChild(this.backupFileComboBox);
			this.mainList.domNode.appendChild(this.credentialsWrapperDiv);
			this.mainList.domNode.appendChild(this.wipeDataWrapperDiv);

			this.mainList.addChild(this.restoreButton);

			this.addChild(this.mainList);
		},

		buildNoDataList: function(){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			this.mainList = new EdgeToEdgeList({ });

			this.noDataDiv = domConstruct.create("div", {innerHTML: "You currently do not have any backed up data to restore.", style: "margin-top: 10px; font-weight: bold"});

			this.mainList.domNode.appendChild(this.noDataDiv);

			this.addChild(this.mainList);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Restore backed up data"} );		

			this.checkForBackupData().then(lang.hitch(this, function(obj){
				if(obj){
					if(obj['success']){
						this.buildDataList(obj);
					}else{
						this.buildNoDataList();
					}
				}else{
					this.buildNoDataList();
				}
			}));
		},

		deactivate: function(){
			this.inherited(arguments);

			if(this.pi){
				this.pi.destroyRecursive();
				this.pi = null;
			}
		}
	})
});