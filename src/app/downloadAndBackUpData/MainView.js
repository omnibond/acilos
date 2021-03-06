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
		"dojox/mobile/TextBox",
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
	TextBox,
	ToolBarButton, 
	CheckBox,
	ComboBox,
	ProgressIndicator,
	EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
			
		buildMainList: function(obj){
			this.mainList = new EdgeToEdgeList({ });

			this.instructionDiv = domConstruct.create("div", {innerHTML: "This page will allow you to back up the items in your database. Your service credentials will also be backed up. Just click 'Back up data' to back up your data. This may take a little while if you have a lot of data to back up.", style: "margin-bottom: 10px"});

			this.wipeDataWrapperDiv = domConstruct.create("div", {});

			this.wipeDataBox = new CheckBox({
				checked: false,
				style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
			});

			this.wipeDataDiv = domConstruct.create("div", {innerHTML: "Check this box to also wipe the data you are backing up from the database.", style: "display: inline-block; margin-left: 5px"});

			this.backupButton = new Button({
				label: "Back up data",
				style: "display: block; margin-top: 10px; margin-bottom: 10px",
				onClick: lang.hitch(this, function(){
					this.pi = new ProgressIndicator();
					this.pi.placeAt(document.body);
					this.pi.start();

					if(this.wipeDataBox.get("checked") == false){
						var wipeCurrentData = "false";
					}else if(this.wipeDataBox.get("checked") == true){
						var wipeCurrentData = "true";
					}

					this.saveBackupData(wipeCurrentData).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);

						if(this.pi){
							this.pi.stop();
						}

						this.activate();
					}));	
				})
			});

			this.wipeDataWrapperDiv.appendChild(this.wipeDataBox.domNode);
			this.wipeDataWrapperDiv.appendChild(this.wipeDataDiv);

			this.mainList.domNode.appendChild(this.instructionDiv);
			this.mainList.domNode.appendChild(this.wipeDataWrapperDiv);

			this.mainList.addChild(this.backupButton);

			if(obj['success']){
				obj = obj['success'];

				console.log("obj is: ", obj);

				this.backupList = [];

				for(var x = 0; x < obj.length; x++){
					var date = new Date(obj[x] * 1000);

					date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " on " + (date.getMonth() - 1) + "-" + date.getDate() +  "-" + date.getFullYear();

					this.backupList[x] = {'name': date};
					this.backupList[x]['originalName'] = obj[x];
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

				this.instructionDiv = domConstruct.create("div", {innerHTML: "This page will also allow you to download the json backup files you have created to your device. There is another page that will allow you to upload them to the server. This is useful if you have to reinstall acilos and want to save your data.", style: "margin-bottom: 10px"});

				this.credentialsBox = new CheckBox({
					checked: false,
					style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
				});

				this.credsOptionDiv = domConstruct.create("div", {innerHTML: "Check this box to download your service credentials in addition to your other data.", style: "display: inline; margin-left: 5px"});

				this.credentialsWrapperDiv = domConstruct.create("div", {});

				this.downloadButton = new Button({
					label: "Download backup data",
					style: "margin-top: 10px",
					onClick: lang.hitch(this, function(){
						if(this.jsonDownloadButton){
							if(this.jsonDownloadButton.parentNode){
								this.jsonDownloadButton.parentNode.removeChild(this.jsonDownloadButton);
							}
						}

						if(this.backupFileComboBox.textbox.value == ""){
							alert("You must select a backup file to download");
						}else{
							this.pi = new ProgressIndicator();
							this.pi.placeAt(document.body);
							this.pi.start();

							if(this.credentialsBox.get("checked") == false){
								var downloadServiceCreds = "false";
							}else if(this.credentialsBox.get("checked") == true){
								var downloadServiceCreds = "true";
							}

							for(var y = 0; y < this.backupList.length; y++){
								if(this.backupList[y]['name'] == this.backupFileComboBox.textbox.value){
									var fileName = this.backupList[y]['originalName'];
								}
							}

							console.log("the fileName is: ", fileName);

							this.downloadJsonBackupFile(fileName, downloadServiceCreds).then(lang.hitch(this, function(obj){
								console.log("obj is: ", obj);

								if(obj['referer']){
									var referer = obj['referer'];
								}

								if(this.pi){
									this.pi.stop();
								}

								if(obj['jsonBackup']['success']){
									this.jsonDownloadButton = document.createElement('a');
									this.jsonDownloadButton.href = referer + fileName + "-backup.zip";
									this.jsonDownloadButton.download = referer + fileName + "-backup.zip";
									this.jsonDownloadButton.textContent = 'Download file!';
									domConstruct.place(this.jsonDownloadButton, this.credentialsWrapperDiv, "after");

									this.jsonDownloadButton.style.display = "none";

									console.log("jsonDownloadButton is: ", this.jsonDownloadButton);

									this.jsonDownloadButton.click();
								}else{
									alert("There was an error downloading the backup file");
								}

								if(obj['serviceCredsBackup']){
									if(obj['serviceCredsBackup']['success']){
										this.serviceCredsDownloadButton = document.createElement('a');
										this.serviceCredsDownloadButton.href = referer + "serviceCredsBackup.json";
										this.serviceCredsDownloadButton.download = referer + "serviceCredsBackup.json";
										this.serviceCredsDownloadButton.textContent = 'Download file!';
										domConstruct.place(this.serviceCredsDownloadButton, this.credentialsWrapperDiv, "after");

										this.serviceCredsDownloadButton.style.display = "none";

										console.log("serviceCredsDownloadButton is: ", this.serviceCredsDownloadButton);

										this.serviceCredsDownloadButton.click();
									}else{
										alert("There was an error downloading the service credentials file");
									}
								}

								this.credentialsBox.set("checked", false);
							}));
						}
					})
				});

				this.credentialsWrapperDiv.appendChild(this.credentialsBox.domNode);
				this.credentialsWrapperDiv.appendChild(this.credsOptionDiv);

				this.mainList.domNode.appendChild(this.instructionDiv);
				this.mainList.addChild(this.backupFileComboBox);
				this.mainList.domNode.appendChild(this.credentialsWrapperDiv);

				this.mainList.addChild(this.downloadButton);
			}else{
				this.noBackupDataDiv = domConstruct.create("div", {innerHTML: "You do not have any backup data to download."});

				this.mainList.domNode.appendChild(this.noBackupDataDiv);
			}

			this.addChild(this.mainList);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Back up and download data"} );

			this.checkForBackupData().then(lang.hitch(this, function(obj){
				if(!obj){
					var obj = "blah";
				}

				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;

					this.buildMainList(obj);
				}else{
					this.buildMainList(obj);
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