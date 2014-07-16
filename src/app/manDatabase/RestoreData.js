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
		"dojox/mobile/CheckBox",
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

	xhrManager, 
	SelectorBar, 
	TitleBar, 
	
	EdgeToEdgeList, 
	Button, 
	ListItem, 
	ToolBarButton, 
	CheckBox,
	ProgressIndicator,
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
			
		buildDataList: function(){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			this.mainList = new EdgeToEdgeList({ });

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

			this.wipeBackupFileBox = new CheckBox({
				checked: false,
				style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
			});

			this.wipeBackupFileDiv = domConstruct.create("div", {innerHTML: "Check this box to also delete the backup file you just restored from.", style: "display: inline-block; margin-left: 5px"});

			this.wipeBackupFileWrapperDiv = domConstruct.create("div", {});

			this.wipeCredentialsBackupBox = new CheckBox({
				checked: false,
				style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
			});

			this.wipeCredentialsBackupDiv = domConstruct.create("div", {innerHTML: "Check this box to also delete the service credentials backup file if you are restoring from one.", style: "display: inline-block; margin-left: 5px"});

			this.wipeCredentialsBackupWrapperDiv = domConstruct.create("div", {});

			this.restoreButton = new Button({
				label: "Restore data from backup",
				style: "margin-top: 10px",
				onClick: lang.hitch(this, function(){
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

					if(this.wipeBackupFileBox.get("checked") == false){
						var deleteBackupFile = "false";
					}else if(this.wipeBackupFileBox.get("checked") == true){
						var deleteBackupFile = "true";
					}

					if(this.wipeCredentialsBackupBox.get("checked") == false){
						var deleteBackupCredentials = "false";
					}else if(this.wipeCredentialsBackupBox.get("checked") == true){
						var deleteBackupCredentials = "true";
					}

					this.importBackupData(restoreServiceCreds, wipeDBData, deleteBackupFile, deleteBackupCredentials).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);

						this.pi.stop();

						this.router.goToAbsoluteRoute("/manDatabase");
					}));
				})
			});

			this.credentialsWrapperDiv.appendChild(this.credentialsBox.domNode);
			this.credentialsWrapperDiv.appendChild(this.credsOptionDiv);

			this.wipeDataWrapperDiv.appendChild(this.wipeDataBox.domNode);
			this.wipeDataWrapperDiv.appendChild(this.wipeDataDiv);

			this.wipeBackupFileWrapperDiv.appendChild(this.wipeBackupFileBox.domNode);
			this.wipeBackupFileWrapperDiv.appendChild(this.wipeBackupFileDiv);

			this.wipeCredentialsBackupWrapperDiv.appendChild(this.wipeCredentialsBackupBox.domNode);
			this.wipeCredentialsBackupWrapperDiv.appendChild(this.wipeCredentialsBackupDiv);

			this.mainList.domNode.appendChild(this.instructionDiv);
			this.mainList.domNode.appendChild(this.selectOptionsDiv);
			this.mainList.domNode.appendChild(this.credentialsWrapperDiv);
			this.mainList.domNode.appendChild(this.wipeDataWrapperDiv);
			this.mainList.domNode.appendChild(this.wipeBackupFileWrapperDiv);
			this.mainList.domNode.appendChild(this.wipeCredentialsBackupWrapperDiv);

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
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Restore backed up data"} );		

			this.checkForBackupData().then(lang.hitch(this, function(obj){
				console.log("obj is: ", obj);

				if(obj){
					if(obj['success']){
						this.buildDataList();
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