/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file is the mainView for the barGraph module
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
		'dojo/on',
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/TitleBar',
		
		"dojo-mama/util/RoundRectList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/Heading"
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		topic, 
		lang, 
		on,
		domGeom,
		
		xhrManager, 
		TitleBar, 
		
		RoundRectList, 
		Button, 
		ListItem, 
		ToolBarButton, 
		EdgeToEdgeCategory,
		Heading
) {
	return declare([ModuleScrollableView], {				
		buildList: function(){

			this.userItem = new ListItem({
				label: "Graph by User",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/userList");
				})	
			})

			this.serviceItem = new ListItem({
				label: "Graph by Service",
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/serviceGraph");
				})	
			})

			this.addChild(this.userItem);
			this.addChild(this.serviceItem);
		},

		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/analytics', title: "Generate a Bar Graph"} );	

			if(this.userItem){
				this.userItem.destroyRecursive();
				this.userItem = null;
			}
			if(this.serviceItem){
				this.serviceItem.destroyRecursive();
				this.serviceItem = null;
			}

			this.buildList();
		}
	})
});
