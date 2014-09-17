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
			
		buildList: function(){
			this.mainList = new EdgeToEdgeList({ });

			var instructionDiv = domConstruct.create("div", {innerHTML: "This page will allow you to upload the json backup files you downloaded on the 'Download backup data' page. You may also upload your service credentials file using this page."});

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
				iframe.style.height = 150+"px";
				iframe.style.border = "none";
				iframe.style.marginLeft = "-20px";
				iframe.style.marginBottom = "-5px";
				fileHolder.appendChild(iframe);
			}));

			this.addChild(this.mainList);
		},
		
		activate: function() {
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Upload backup files"} );

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			this.buildList();		
		},

		deactivate: function(){
			this.inherited(arguments);
		}
	})
});