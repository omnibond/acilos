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
			this.serviceSelectors = [];
			this.divs = [];
		},
		
		buildRendering: function() {
			this.inherited(arguments);

			if(this.serviceSelectors.length > 0){
				for(var x = 0; x < this.serviceSelectors.length; x++){
					this.serviceSelectors[x].placeAt(this.domNode);
				}
			}
			
			if(this.toolTips.length > 0){
				for(var x = 0; x < this.toolTips.length; x++){
					if(this.toolTips[x]['name'] == "helpButton"){
						var divHelpButton = domConstruct.create("div", {"class": "icon-help fontSize25 fontDiv30", title: "Help"});

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

			if(this.divs.length > 0){
				for(var x = 0; x < this.divs.length; x++){
					for(var y = 0; y < this.divs[x].children.length; y++){
						if(this.divs[x].children[y].type == "button"){
							if(this.divs[x].children[y].name == "goButton"){
								var divSelectButton = domConstruct.create("div", {"class": "icon-go fontSize25 fontDiv30", title: "Go to the next page"});

								this.divs[x].children[y].appendChild(divSelectButton);
							}

							if(this.divs[x].children[y].right == "true"){
								domClass.add(this.divs[x].children[y], "floatRightButton");
							}

							if(this.divs[x].children[y].left == "true"){
								domClass.add(this.divs[x].children[y], "floatLeftButton");
							}

							domClass.add(this.divs[x].children[y], "selectorButton");
						}
					}

					this.domNode.appendChild(this.divs[x]);
				}
			}

			//left attribute is set on the button when we make it - ("left": "true") will put the button on the left

			if(this.buttons.length > 0){
				for(var x = 0; x < this.buttons.length; x++){
					if(this.buttons[x]['name'] == "scrollButton"){
						var divScrollButton = domConstruct.create("div", {"class": "icon-scroll-to-top fontSize25 fontDiv30", title: "Scroll to the top"});

						this.buttons[x].domNode.appendChild(divScrollButton);
					}

					if(this.buttons[x]['name'] == "goButton"){
						var divSelectButton = domConstruct.create("div", {"class": "icon-go fontSize25 fontDiv30", title: "Go to the next page"});

						this.buttons[x].domNode.appendChild(divSelectButton);
					}

					if(this.buttons[x]['name'] == "alphaButton"){
						var divAlphaButton = domConstruct.create("div", {"class": "icon-alphabetical fontSize25 fontDiv30", title: "Sort alphabetically"});

						this.buttons[x].domNode.appendChild(divAlphaButton);
					}

					if(this.buttons[x]['name'] == "chattyButton"){
						var divChattyButton = domConstruct.create("div", {"class": "icon-chattiest fontSize25 fontDiv30", title: "Show the chattiest people"});

						this.buttons[x].domNode.appendChild(divChattyButton);
					}

					if(this.buttons[x]['name'] == "secondButton"){
						var divSecondButton = domConstruct.create("div", {"class": "icon-friends-of-friends fontSize25 fontDiv30", title: "Show friends of friends"});

						this.buttons[x].domNode.appendChild(divSecondButton);
					}

					if(this.buttons[x]['name'] == "recentButton"){
						var divRecentButton = domConstruct.create("div", {"class": "icon-recent-posters fontSize25 fontDiv30", title: "Show most recent posters"});

						this.buttons[x].domNode.appendChild(divRecentButton);
					}

					if(this.buttons[x]['name'] == "manualRefreshButton"){
						var divManualRefreshBut = domConstruct.create("div", {"class": "icon-refresh fontSize25 fontDiv30", title: "Refresh the data"});

						this.buttons[x].domNode.appendChild(divManualRefreshBut);
					}

					// THIS BUTTON IS NOT CURRENTLY BEING USED, BUT THE CODE IS HERE IF WE NEED IT
					/*if(this.buttons[x]['name'] == "manualReload"){
						var divManualReload = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/Button-Reload-icon_small.png>", title: "Reload the page"});

						this.buttons[x].domNode.appendChild(divManualReload);
					}*/

					if(this.buttons[x]['name'] == "saveButton"){
						var divSaveButton = domConstruct.create("div", {"class": "icon-save fontSize25 fontDiv30", title: "Save this feed"});

						this.buttons[x].domNode.appendChild(divSaveButton);
					}

					if(this.buttons[x]['name'] == "searchButton"){
						var divSearchButton = domConstruct.create("div", {"class": "icon-search fontSize25 fontDiv30", title: "Start the search"});

						this.buttons[x].domNode.appendChild(divSearchButton);
					}

					if(this.buttons[x]['name'] == "mergeButton"){
						var divMergeButton = domConstruct.create("div", {"class": "icon-edit-accounts fontSize25 fontDiv30", title: "Merge contacts"});

						this.buttons[x].domNode.appendChild(divMergeButton);
					}

					if(this.buttons[x]['name'] == "newFeedButton"){
						var divNewFeedButton = domConstruct.create("div", {"class": "icon-add fontSize25 fontDiv30", title: "Create a New Feed"});

						this.buttons[x].domNode.appendChild(divNewFeedButton);
					}

					if(this.buttons[x]['name'] == "editFeedButton"){
						var divEditFeedButton = domConstruct.create("div", {"class": "icon-edit fontSize25 fontDiv30", title: "Edit a Feed"});

						this.buttons[x].domNode.appendChild(divEditFeedButton);
					}

					if(this.buttons[x]['name'] == "deleteFeedButton"){
						var divDeleteFeedButton = domConstruct.create("div", {"class": "icon-delete fontSize25 fontDiv30", title: "Delete a Feed"});

						this.buttons[x].domNode.appendChild(divDeleteFeedButton);
					}

					if(this.buttons[x]['name'] == "topContactsButton"){
						var divtopContactsButton = domConstruct.create("div", {"class": "icon-top-poster fontSize25 fontDiv30", title: "Top Posters"});

						this.buttons[x].domNode.appendChild(divtopContactsButton);
					}

					if(this.buttons[x]['name'] == "helpButton"){
						var divHelpButton = domConstruct.create("div", {"class": "icon-help fontSize25 fontDiv30", title: "Help"});

						this.buttons[x].domNode.appendChild(divHelpButton);	
					}

					if(this.buttons[x]['name'] == "postHistoryButton"){
						var divPostHistoryButton = domConstruct.create("div", {"class": "icon-barcode fontSize25 fontDiv30", title: "Post History"});

						this.buttons[x].domNode.appendChild(divPostHistoryButton);	
					}

					if(this.buttons[x]['name'] == "publicButton"){
						var divPublicButton = domConstruct.create("div", {innerHTML: "P", "class": "fontSize25 fontDiv30", title: "View your local feeds"});

						this.buttons[x].domNode.appendChild(divPublicButton);	
					}

					if(this.buttons[x]['name'] == "localButton"){
						var divLocalButton = domConstruct.create("div", {innerHTML: "L", "class": "fontSize25 fontDiv30", title: "View your public feeds"});

						this.buttons[x].domNode.appendChild(divLocalButton);	
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