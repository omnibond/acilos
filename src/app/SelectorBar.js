/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the selectorBar widget
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
		'dojo/_base/lang',
		'dojo/dom-construct',
		'dojo/dom-class',
		'dojo/keys',
		'dojo/on',
		'dijit/_WidgetBase'
], function(declare, lang, domConstruct, domClass, keys, on, WidgetBase) {
	return declare([WidgetBase], {
		baseClass: "selectorBar",
		fixed: "top",
		buttons: null,
		textBoxes: null,
		toolTips: null,

		constructor: function(){
			this.buttons = [];
			this.textBoxes = [];
			this.toolTips = [];
		},
		
		buildRendering: function() {
			this.inherited(arguments);
			
			if(this.toolTips.length > 0){
				for(var x = 0; x < this.toolTips.length; x++){
					if(this.toolTips[x]['name'] == "helpButton"){
						var divHelpButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/question_mark_small.png>", title: "Help"});

						this.toolTips[x].domNode.appendChild(divHelpButton);
					}

					if(this.toolTips[x]['left'] == "true"){
						domClass.add(this.toolTips[x].domNode, "floatLeftButton");
					}

					if(this.buttons[x]['right'] == "true"){
						domClass.add(this.buttons[x].domNode, "floatRightButton");
					}

					this.toolTips[x].placeAt(this.domNode);
					domClass.add(this.toolTips[x].domNode, "selectorButton");
				}
			}
			
			if(this.textBoxes.length > 0){
				for(var x = 0; x < this.textBoxes.length; x++){
					this.textBoxes[x].placeAt(this.domNode);
				}
			}

			//left attribute is set on the button when we make it - ("left": "true") will put the button on the left

			if(this.buttons.length > 0){
				for(var x = 0; x < this.buttons.length; x++){
					if(this.buttons[x]['name'] == "scrollButton"){
						var divScrollButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/uparrow_small.png>", title: "Scroll to the top"});

						this.buttons[x].domNode.appendChild(divScrollButton);
					}

					if(this.buttons[x]['name'] == "goButton"){
						var divSelectButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/go-icon_small.png>", title: "Go to the next page"});

						this.buttons[x].domNode.appendChild(divSelectButton);
					}

					if(this.buttons[x]['name'] == "alphaButton"){
						var divAlphaButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/a_to_z_template_icon_small.png>", title: "Sort alphabetically"});

						this.buttons[x].domNode.appendChild(divAlphaButton);
					}

					if(this.buttons[x]['name'] == "chattyButton"){
						var divChattyButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/chatty_small.png>", title: "Show the chattiest people"});

						this.buttons[x].domNode.appendChild(divChattyButton);
					}

					if(this.buttons[x]['name'] == "secondButton"){
						var divSecondButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/Handshake_hands_deal_contractors_alliance_small.png>", title: "Show friends of friends"});

						this.buttons[x].domNode.appendChild(divSecondButton);
					}

					if(this.buttons[x]['name'] == "recentButton"){
						var divRecentButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/clock_small.png>", title: "Show most recent posters"});

						this.buttons[x].domNode.appendChild(divRecentButton);
					}

					if(this.buttons[x]['name'] == "manualRefreshButton"){
						var divManualRefreshBut = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/reload_small.png>", title: "Refresh the data"});

						this.buttons[x].domNode.appendChild(divManualRefreshBut);
					}

					// THIS BUTTON IS NOT CURRENTLY BEING USED, BUT THE CODE IS HERE IF WE NEED IT
					if(this.buttons[x]['name'] == "manualReload"){
						var divManualReload = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/Button-Reload-icon_small.png>", title: "Reload the page"});

						this.buttons[x].domNode.appendChild(divManualReload);
					}

					if(this.buttons[x]['name'] == "saveButton"){
						var divSaveButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/save-icon_small.png>", title: "Save this feed"});

						this.buttons[x].domNode.appendChild(divSaveButton);
					}

					if(this.buttons[x]['name'] == "searchButton"){
						var divSearchButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/Search-icon_small.png>", title: "Start the search"});

						this.buttons[x].domNode.appendChild(divSearchButton);
					}

					if(this.buttons[x]['name'] == "mergeButton"){
						var divMergeButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/merge_small.png>", title: "Merge contacts"});

						this.buttons[x].domNode.appendChild(divMergeButton);
					}

					if(this.buttons[x]['name'] == "newFeedButton"){
						var divNewFeedButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/plus_icon_small.png>", title: "Create a New Feed"});

						this.buttons[x].domNode.appendChild(divNewFeedButton);
					}

					if(this.buttons[x]['name'] == "editFeedButton"){
						var divEditFeedButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/edit_icon_small.png>", title: "Edit a Feed"});

						this.buttons[x].domNode.appendChild(divEditFeedButton);
					}

					if(this.buttons[x]['name'] == "deleteFeedButton"){
						var divDeleteFeedButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/minus_icon_small.png>", title: "Delete a Feed"});

						this.buttons[x].domNode.appendChild(divDeleteFeedButton);
					}

					if(this.buttons[x]['name'] == "topContactsButton"){
						var divtopContactsButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/topContacts_small.png>", title: "Top Posters"});

						this.buttons[x].domNode.appendChild(divtopContactsButton);
					}

					if(this.buttons[x]['name'] == "helpButton"){
						var divHelpButton = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/question_mark_small.png>", title: "Help"});

						this.buttons[x].domNode.appendChild(divHelpButton);	
					}

					if(this.buttons[x]['right'] == "true"){
						domClass.add(this.buttons[x].domNode, "floatRightButton");
					}

					if(this.buttons[x]['left'] == "true"){
						domClass.add(this.buttons[x].domNode, "floatLeftButton");
					}

					this.buttons[x].placeAt(this.domNode);
					domClass.add(this.buttons[x].domNode, "selectorButton");
				}
			}
		}
			
	});
});