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
			
		stopTheInterval: function(){
			clearInterval(this.interval);
		},

		buildList: function(obj){
			this.mainList = new EdgeToEdgeList({ });

			this.mainObj = obj;

			console.log("this.mainObj is: ", this.mainObj);

			this.scopeToKeep = this;

			var instructionDiv = domConstruct.create("div", {innerHTML: "This page will allow you to upload the json backup files you downloaded on the 'Download backup data' page. You may also upload your service credentials file using this page.", style: "margin-bottom: -10px"});

			this.mainList.domNode.appendChild(instructionDiv);

			var fileHolder = domConstruct.create("div", {style: "border:none; margin-left: 7px; margin-top: 14px; height: auto"});
			this.mainList.domNode.appendChild(fileHolder);

			this.getDomain().then(lang.hitch(this, function(obj){
				if(obj.domain){
					this.domain = obj.domain;	
				}
				
				var iframe = document.createElement("IFRAME");
				iframe.setAttribute("src", "http://"+this.domain+"/uploadJsonPage.html");
				iframe.setAttribute("name", "iframe");
				iframe.style.width = 275+"px";
				iframe.style.height = 85+"px";
				iframe.style.border = "none";
				iframe.style.marginLeft = "-20px";
				iframe.style.marginBottom = "-5px";
				fileHolder.appendChild(iframe);

				this.iframeElements = '';

				iframe.onload = lang.hitch(this, function(){
					this.iframeElements = iframe.contentWindow.document.body.getElementsByTagName("*");

					console.log("THE IFRAME ELEMENTS ARE: ", this.iframeElements);

					for(var q = 0; q < this.iframeElements.length; q++){
						if(this.iframeElements[q]){
							if(this.iframeElements[q]['innerHTML'] == "Upload"){
								this.iframeElements[q].onclick = lang.hitch(this, function(){
									console.log("this.scopeToKeep is: ", this.scopeToKeep);

									this.iframeElements = iframe.contentWindow.document.body.getElementsByTagName("*");

									console.log("THE SECOND IFRAME ELEMENTS ARE: ", this.iframeElements);

									this.interval = setInterval(lang.hitch(this, function(){
										for(var t = 0; t < this.iframeElements.length; t++){
											if(this.iframeElements[t]['innerHTML'] == "The file was uploaded successfully" || this.iframeElements[t]['innerHTML'] == "There was an error uploading the files"){
												this.stopTheInterval();

												this.scopeToKeep.activate();
											}
										}
									}), 1000);
								});
							}
						}
					}

					if(this.mainObj['success']){
						this.mainObj = this.mainObj['success'];

						this.backupList = [];

						for(var x = 0; x < this.mainObj.length; x++){
							var date = new Date(this.mainObj[x] * 1000);

							date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " on " + (date.getMonth() - 1) + "-" + date.getDate() +  "-" + date.getFullYear();

							this.backupList[x] = {'name': date};
							this.backupList[x]['originalName'] = this.mainObj[x];
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

						this.instructionDiv = domConstruct.create("div", {innerHTML: "This page will allow you to restore backed up items to your database. You can also choose to restore your backed up service credentials. This may take a little while if you have a lot of data to restore.", style: "margin-bottom: 10px"});

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

						this.wipeDataDiv = domConstruct.create("div", {innerHTML: "Check this box to also wipe the current data in the database before you restore your backup data.", style: "display: inline-block; margin-left: 5px"});

						this.wipeDataWrapperDiv = domConstruct.create("div", {});

						this.restoreButton = new Button({
							label: "Restore data from backup",
							style: "margin-top: 10px",
							onClick: lang.hitch(this, function(){
								for(var y = 0; y < this.backupList.length; y++){
									if(this.backupList[y]['name'] == this.backupFileComboBox.textbox.value){
										var fileName = this.backupList[y]['originalName'];
									}
								}

								if(fileName == ""){
									alert("You must select a file to back up from");
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

									console.log("the fileName is: ", fileName);

									this.importBackupData(fileName, restoreServiceCreds, wipeDBData).then(lang.hitch(this, function(obj){
										console.log("obj is: ", obj);

										if(this.pi){
											this.pi.stop();
										}

										this.activate();
									}));
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
					}
				});
			}));

			this.addChild(this.mainList);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Upload and restore data"} );

			this.checkForBackupData().then(lang.hitch(this, function(obj){
				if(!obj){
					var obj = "blah";
				}

				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;

					this.buildList(obj);
				}else{
					this.buildList(obj);
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