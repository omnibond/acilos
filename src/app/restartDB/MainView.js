/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the restartDB module
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
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button"
], function(declare, ModuleScrollableView, domConstruct, topic, lang, RoundRectList, ListItem, Button) {
	return declare([ModuleScrollableView], {		
		postCreate: function(){
			this.list = new RoundRectList({
					
			})
			this.item = new ListItem({
				variableHeight: true,
				"class": "helpItemClass"
			})				
			this.dbRestartButton = new Button({
				label: "Restart Database",
				style: "float: center",
				onClick: lang.hitch(this, function(){
					if(this.responseItem){
						this.responseItem.destroyRecursive();
					}
					this.restartDB().then(lang.hitch(this, function(obj){
						this.populateResponse(obj);
					}));
				})
			})
			this.item.addChild(this.dbRestartButton);
			this.list.addChild(this.item);
			this.addChild(this.list);			
		},
		
		populateResponse: function(obj){
			console.log(obj);
			this.responseItem = new ListItem({
				style: "border:none"
			})
			this.addChild(this.responseItem);
			if(obj['success']){
				switch(obj['success']){
					case "running":
						this.responseItem.set("label", "Database is running already");
					break;
					case "started":
						this.responseItem.set("label", "Database is starting, give it just a moment");
					break;
				}
			}else if(obj['error']){
				this.responseItem.set("label", "Error starting Database: ");
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/help', title: "Restart the database"} );
			
			if(this.responseItem){
				this.responseItem.destroyRecursive();
			}
		}
	})
});