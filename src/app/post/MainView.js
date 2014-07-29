/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the post module
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
		"dojo/_base/lang",
		"dojo/dom-class",
		"dojo/dom-style",

		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",
		"dojox/mobile/CheckBox",
		'dojox/mobile/TextArea',
		'dojox/mobile/Button',
		"dojox/mobile/ListItem",
		"dojox/mobile/TextBox",
		"dijit/Calendar",
		"dojox/mobile/RadioButton",
		
		"dojox/form/Uploader",
		"dojox/form/uploader/_IFrame",
		
		"app/post/FileList",
		"dijit/Dialog",

		'dojo/dom-construct',
		'dojo/topic',
		'dojo/has'
], function(
	declare, 
	ModuleScrollableView,
	lang,
	domClass,
	domStyle,

	RoundRectList, 
	EdgeToEdgeList,
	CheckBox,
	TextArea,
	Button,
	ListItem,
	TextBox,
	Calendar,
	RadioButton,
	
	Uploader,
	iFramePlugin,
	
	FileList,
	Dialog,
	
	domConstruct, 
	topic,
	has
) {
	return declare([ModuleScrollableView], {		
		activate: function(){
			topic.publish("/dojo-mama/updateSubNav", {back: "/", title: "Post"} );

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			this.mainList = new RoundRectList({
				style: "margin:none;border:none"
			});

			this.postListItem = new ListItem({
				label: "Post, Tweet, Blog",
				variableHeight: true,
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/PostView");
				})
			});

			this.postHistoryListItem = new ListItem({
				label: "See a list of your posts",
				variableHeight: true,
				clickable: true,
				noArrow: true,
				onClick: lang.hitch(this, function(){
					this.router.go("/PostHistoryView");
				})
			});

			this.mainList.addChild(this.postListItem);
			this.mainList.addChild(this.postHistoryListItem);

			this.addChild(this.mainList);
			this.resize();
		}
	});
});