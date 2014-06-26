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
			
		buildMainList: function(obj){
			this.mainList = new EdgeToEdgeList({ });

			this.instructionDiv = domConstruct.create("div", {innerHTML: "This page will allow you to back up the items in your database. You can also choose to back up your service credentials.", style: "margin-bottom: 10px"});

			this.credentialsBox = new CheckBox({
				checked: false,
				style: "-webkit-transform: scale(1.4); -moz-transform: scale(1.4); -ms-transform: scale(1.4); -o-transform: scale(1.4)"
			});

			this.credsOptionDiv = domConstruct.create("div", {innerHTML: "Check this box to back up your service credentials in addition to your other data.", style: "display: inline-block; margin-left: 5px"});

			this.backupButton = new Button({
				label: "Back up data",
				style: "display: block",
				onClick: lang.hitch(this, function(){
					pi = new ProgressIndicator();
					pi.placeAt(document.body);
					pi.start();

					console.log("check isissisisisisis", this.credentialsBox.get("checked"));

					if(this.credentialsBox.get("checked") == false){
						var saveServiceCreds = "false";
					}else if(this.credentialsBox.get("checked") == true){
						var saveServiceCreds = "true";
					}

					this.saveBackupData(saveServiceCreds).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);

						pi.stop();
					}));
				})
			});

			if(obj){
				if(obj['success']){
					this.restoreButton = new Button({
						label: "Restore data from backup"
					});
				}
			}

			this.mainList.domNode.appendChild(this.instructionDiv);
			this.mainList.addChild(this.credentialsBox);
			this.mainList.domNode.appendChild(this.credsOptionDiv);
			this.mainList.addChild(this.backupButton);

			if(this.restoreButton){
				this.mainList.addChild(this.restoreButton);
			}

			this.addChild(this.mainList);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/manDatabase', title: "Restore previous saves"} );

			this.checkForBackupData().then(lang.hitch(this, function(obj){
				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;

					this.buildMainList(obj);
				}else{
					this.buildMainList(obj);
				}
			}));	
		}
	})
});