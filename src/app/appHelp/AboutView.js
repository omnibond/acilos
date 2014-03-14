/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This is the aboutView for the appHelp module
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
define([
		"dojo/_base/declare",
		'dojo/_base/kernel',
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-construct",
		"dojo/dom-geometry",
		"dojo/_base/window",
		"dojo/_base/connect",
		"dojo/dom-style",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/on",
		"dojo/_base/event",
		"dojo/mouse",
        'dojo/dom-geometry',
		'dojo/topic',
		
		'dojo-mama/views/ModuleScrollableView',

		"app/SearchScroller",
		"app/SelectorBar",
		
		"dojox/widget/ColorPicker",
		"dijit/Dialog",
		
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/TextBox",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/EdgeToEdgeList",	
		"dojox/mobile/ListItem",	
		"dojox/mobile/Button",	
		"dijit/Dialog",
		"dojox/mobile/GridLayout",
		"dojox/mobile/Pane",
		
		"dojo/ready"

	], function(
		declare,
		kernel,
		dom,
		domClass,
		domConstruct,
		domGeometry,
		domWindow,
		connect,
		domStyle,
		domAttr,
		lang,
		on,
		event,
		mouse,
		domGeom,
		topic,
		
		ModuleScrollableView,

		SearchScroller,
		SelectorBar,
		
		ColorPicker,
		Dialog,
		
		ToolBarButton,
		TextBox,
		RoundRectList,
		EdgeToEdgeList,
		ListItem,
		Button,
		Dialog,
		GridLayout,
		Pane,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/appHelp', title: "About Acilos"} );
				
				this.buildView();
			},
			
			buildView: function(){
				this.mainList = new EdgeToEdgeList({
					style: "border:none"
				});
				
				var supportList = new EdgeToEdgeList({
					style: "border:none"
				});
				var support = new ListItem({
					label: "Browser Support",
					style: "font-weight:bold"
				})
				var supportExtra = new ListItem({
					variableHeight: true, 
					label: "For the best app experience, the latest version of one of the following browsers is recommended"
				})
				supportList.addChild(support);
				supportList.addChild(supportExtra);
				this.mainList.addChild(supportList);
				
				var feedbackList = new EdgeToEdgeList({
					style: "border:none"
				});
				var feedback = new ListItem({
					label: "Feedback",
					style: "font-weight:bold"
				})
				var feedbackExtra = new ListItem({
					variableHeight: true, 
					label: "Comments and suggestions are welcome and may be directed to the Acilos github page at https://github.com/omnibond/acilos. For more information about the app please visit www.acilos.com"
				})
				feedbackList.addChild(feedback);
				feedbackList.addChild(feedbackExtra);
				this.mainList.addChild(feedbackList);
				
				var creditList = new EdgeToEdgeList({
					style: "border:none"
				});
				var credits = new ListItem({
					label: "Credits",
					style: "font-weight:bold"
				})
				var elasticExtra = new ListItem({
					variableHeight: true, 
					label: "elasticsearch"
				})
				var dojoExtra = new ListItem({
					variableHeight: true, 
					label: "dojo"
				})
				var mamaExtra = new ListItem({
					variableHeight: true, 
					label: "dojo-mama"
				})
				var abrahamExtra = new ListItem({
					variableHeight: true, 
					label: "twitter abraham client"
				})
				var nerveExtra = new ListItem({
					variableHeight: true, 
					label: "nerve-tattoo es client"
				})
				var omniExtra = new ListItem({
					variableHeight: true, 
					label: "omnibond"
				})
				creditList.addChild(credits);
				creditList.addChild(elasticExtra);
				creditList.addChild(dojoExtra);
				creditList.addChild(mamaExtra);
				creditList.addChild(abrahamExtra);
				creditList.addChild(nerveExtra);
				creditList.addChild(omniExtra);
				this.mainList.addChild(creditList);
				
				this.addChild(this.mainList);
			},
			
			deactivate: function(){
				this.inherited(arguments);
				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
			}
			
		});
	}
);
