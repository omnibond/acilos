/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the notifications module
** This is DEPRECATED
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
		'dojo/_base/kernel',
		'dojo/topic',
		'dojo/dom',
		'dojo/dom-class',
		"dojo/_base/lang",
		
		'app/util/xhrManager',
		
		'app/SelEdgeToEdgeList',
		'dojox/mobile/ListItem',
		'dojox/mobile/Accordion',
		'dojox/mobile/ContentPane'
		
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		kernel,
		topic,
		dom,
		domClass,
		lang,
		
		xhrManager,
		
		EdgeToEdgeList,
		ListItem,
		Accordion,
		ContentPane
) {
	return declare([ModuleScrollableView], {	
		
		clearNotificationBar: function(){
			if(domClass.contains(dom.byId("dojox_mobile_Pane_6"), "dmMenuBar")){
				var menuBar = dom.byId("dojox_mobile_Pane_6");
			}else{
				//otherwise start walking down right pane
				var possible = dom.byId("dojox_mobile_Pane_1");
				var out = false;
				while(out != true){
					possible = possible.firstChild;
					if(domClass.contains(possible, "dmMenuBar")){
						var menuBar = possible;
						out = true;
					}
				}
			}
			menuBar.firstChild.innerHTML = "Notifications";
		},
		
		clearNotification: function(service){
			var params = [service];
			xhrManager.send('clearNotification', 'app/util/_scaffold.php', params)
		},
		
		buildList: function(){
			this.list = new EdgeToEdgeList({
			});
			
			var credAccordion = new Accordion({
				"class": "feedAccordionClass"
			});
			credAccordion.startup();
			credAccordion.addChild(this.buildCredPane());
			var item = new ListItem({
				variableHeight: true,
				"class": "feedAccordionItemClass"
			});
			item.addChild(credAccordion);
			item.placeAt(this.list);
		
		/* The world is not ready for notification pane 			
			var noteAccordion = new Accordion({
				"class": "feedAccordionClass"
			});
			noteAccordion.startup();
			noteAccordion.addChild(this.buildNotificationPane());
			var item = new ListItem({
				variableHeight: true,
				"class": "feedAccordionItemClass"
			});
			item.addChild(noteAccordion);
			item.placeAt(this.list);
		*/
			this.list.placeAt(this.containerNode);
		
		},
		
		buildCredPane: function(){
			var obj = kernel.global.notifications.credObj;
			console.log(obj);
			var numBad = 0;
			this.credPane = new ContentPane({
			});
			
			if(obj){
				for(var k in obj){
					if(obj[k]['status'] == 'good'){
						var item = new ListItem({
							label: k,
							style: "background:#18AD25",
							rightText: "Good to Go!",
							clickable: true
						})
					}else{
						var item = new ListItem({
							label: k,
							style: "background:#BD1C52",
							rightText: "Credential is bad, click to reauthenticate",
							clickable: true
						})
						numBad++;
					}
					item.on("click", lang.hitch(this, function(){
						this.router.goToAbsoluteRoute("/manAccounts");
					}))
					this.credPane.addChild(item);
				}
				if(numBad > 0){
					this.credPane.set("label", "Credentials (" + numBad + ")");
				}else{
					this.credPane.set("label", "Credentials");
				}
			}else{
				this.credPane.set("label", "Credentials");
			}
			return this.credPane;
		},
		
		buildNotificationPane: function(){
			var obj = kernel.global.notifications.noteObj;
			console.log(obj);
			var numThings = 0;
			this.notePane = new ContentPane({
			});
			
			if(obj){
				for(var k in obj){
					if(obj[k].length >0){
						if(obj[k]['notes'] > 0 || obj[k]['messages'] > 0 || obj[k]['friends'].length > 0){
							var item = new ListItem({
								label: k,
								style: "background:#BD1C52",
								rightText: 'New Notifications!!!',
								clickable: true
							})
							numThings++;
						}else{
							var item = new ListItem({
								label: k,
								style: "background:#18AD25",
								rightText: "No new notifications"
							})
						}
						
						item.on("click", lang.hitch(this, function(k, item){
							this.notePane.set("label", "Notifications");
							this.clearNotification(k);
							window.open('http://www.'+k+'.com/', '_blank');
						}, k, item))
						this.notePane.addChild(item);
					}
				}
				if(numThings > 0){
					this.notePane.set("label", "Notifications (" + numThings + ")");
				}else{
					this.notePane.set("label", "Notifications");
				}
			}else{
				this.notePane.set("label", "Notifications");
			}
			return this.notePane;
		},
		
		activate: function(e){
			//this.clearNotificationBar();
			
			if(this.list){
				this.list.destroyRecursive();
			}
			this.buildList();
			
			topic.publish("/dojo-mama/updateSubNav", {title: "App Notifications"} );
		}
		
	})
});