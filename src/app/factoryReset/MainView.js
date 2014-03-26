/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines mainView for the factoryReset module
** This code is DEPRECATED
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
		
		"dojo-mama/util/EdgeToEdgeList",
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
		
		EdgeToEdgeList, 
		Button, 
		ListItem, 
		ToolBarButton, 
		EdgeToEdgeCategory,
		Heading
) {
	return declare([ModuleScrollableView], {
		
		buildList: function(){
			if(this.list){
				this.list.destroyRecursive();
				this.list = null;
			}
			
			this.list = new EdgeToEdgeList({
				style: "border:none"
			})
			var item = new ListItem({
				variableHeight: true,
				style: "border:none"
			});
			
			var resetButton = new Button({
				label: "Nuke From Orbit!",
				onClick: lang.hitch(this, function(){
					this.appFactoryReset().then(function(){
						window.location = "login.php?logout=true";
					})
				})
			});
			item.addChild(resetButton);
			
			this.list.addChild(item);
			this.addChild(this.list);
		},
		
		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/help', title: "Reset the app to factory defaults"} );	
			
			this.buildList();
		}
	})
});
