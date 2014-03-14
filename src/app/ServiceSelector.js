/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the serviceSelector widget
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
define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"dojox/mobile/CheckBox",
	"dojox/mobile/RadioButton",
	"dojox/mobile/ListItem"
], function(
	array, declare, event, lang, win, domConstruct, domAttr, Contained, Container, WidgetBase, 
	CheckBox, 
	RadioButton,
	ListItem
){

	// module:
	//		dojox/mobile/RoundRectList

	return declare("dojox.mobile.ServiceSelector", [WidgetBase, Container, Contained], {
		// summary:
		//		A rounded rectangle list.
		// description:
		//		RoundRectList is a rounded rectangle list, which can be used to
		//		display a group of items. Each item must be a dojox/mobile/ListItem.

		// transition: String
		//		The default animated transition effect for child items.
		transition: "slide",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// select: String
		//		Selection mode of the list. The check mark is shown for the
		//		selected list item(s). The value can be "single", "multiple", or "".
		//		If "single", there can be only one selected item at a time.
		//		If "multiple", there can be multiple selected items at a time.
		//		If "", the check mark is not shown.
		select: "",

		// stateful: Boolean
		//		If true, the last selected item remains highlighted.
		stateful: false,

		// syncWithViews: [const] Boolean
		//		If true, this widget listens to view transition events to be
		//		synchronized with view's visibility.
		//		Note that changing the value of the property after the widget
		//		creation has no effect.
		syncWithViews: false,

		// editable: [const] Boolean
		//		If true, the list can be reordered.
		//		Note that changing the value of the property after the widget
		//		creation has no effect.
		editable: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "ul",

		/* internal properties */
		// editableMixinClass: String
		//		The name of the mixin class.
		editableMixinClass: "dojox/mobile/_EditableListMixin",
		
		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "serviceSelector",
		
		// filterBoxClass: String
		//		The name of the CSS class added to the DOM node inside which is placed the 
		//		dojox/mobile/SearchBox created when mixing dojox/mobile/FilteredListMixin.
		//		The default value is "mblFilteredRoundRectListSearchBox".  
		filterBoxClass: "mblFilteredRoundRectListSearchBox",
		
		radioButtons: {},
		
		checkBoxes: {},

		horizontal: "",

		vertical: "",
		
		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			if(this.select){
				domAttr.set(this.domNode, "role", "listbox");
				if(this.select === "multiple"){
					domAttr.set(this.domNode, "aria-multiselectable", "true");
				}
			}
			this.inherited(arguments);
		},

		postCreate: function(){
			if(this.editable){
				require([this.editableMixinClass], lang.hitch(this, function(module){
					declare.safeMixin(this, new module());
				}));
			}
			this.connect(this.domNode, "onselectstart", event.stop);

			if(this.syncWithViews){ // see also TabBar#postCreate
				var f = function(view, moveTo, dir, transition, context, method){
					var child = array.filter(this.getChildren(), function(w){
						return w.moveTo === "#" + view.id || w.moveTo === view.id; })[0];
					if(child){ child.set("selected", true); }
				};
				this.subscribe("/dojox/mobile/afterTransitionIn", f);
				this.subscribe("/dojox/mobile/startView", f);
			}
			
			// Put checkBoxes on widget
			if((this.vertical == 'true') || (this.horizontal == 'false')){
				if(this.checkBoxes != ""){
					this.currentCheckBoxes = [];
					var blah = domConstruct.create("div", {});
					for(var key in this.checkBoxes){
						var myCheckBox = new CheckBox({
							label: key,
							checked: this.checkBoxes[key],
							"class": "radioCheckBox"
						})
						var checkHolder = domConstruct.create("span", {});
						checkHolder.appendChild(myCheckBox.domNode);

						if(key == "Facebook"){
							var myLabel = domConstruct.create("span", {innerHTML: "<img src=app/resources/img/Facebook_logo.png>", "class": "verticalIconClass"});
						}
						if(key == "Twitter"){
							var myLabel = domConstruct.create("span", {innerHTML: "<img src=app/resources/img/Twitter_logo_blue_small.png>", "class": "verticalIconClass"});
						}
						if(key == "Instagram"){
							var myLabel = domConstruct.create("span", {innerHTML: "<img src=app/resources/img/Instagram_logo.png>", "class": "verticalIconClass"});
						}
						if(key == "Linkedin"){
							var myLabel = domConstruct.create("span", {innerHTML: "<img src=app/resources/img/LinkedIn_logo.png>", "class": "verticalIconClass"});
						}

						var hold = domConstruct.create("div", {"class": "divHoldClass"});
						hold.appendChild(checkHolder);
						hold.appendChild(myLabel);

						blah.appendChild(hold);

						this.currentCheckBoxes.push(myCheckBox);
					
					}
					this.domNode.appendChild(blah);
				}

				if(this.radioButtons != ""){
					this.currentButtons = [];
					for(var key in this.radioButtons){
						var myRadioButton = new RadioButton({
							label: key,
							checked: this.radioButtons[key],
							"class": "radioCheckBox"
						})
						
						var hold = domConstruct.create("span");
						var label = domConstruct.create("div", {innerHTML: key, style: "float:left"});
						var checkHolder = domConstruct.create("div", {style: "float:left"});
						checkHolder.appendChild(myRadioButton.domNode);
						hold.appendChild(checkHolder);
						hold.appendChild(label);
						this.domNode.appendChild(hold);
						
						this.currentButtons.push(myRadioButton);
						
					}
				}
			}else{
				if(this.checkBoxes != ""){
					this.currentCheckBoxes = [];
					for(var key in this.checkBoxes){
						var myCheckBox = new CheckBox({
							label: key,
							/*style: "margin-left:70px",*/
							checked: this.checkBoxes[key],
							"class": "radioCheckBox"
						})

						if(key == "Facebook"){
							var myIcon = domConstruct.create("div", {"class": "serviceSelectorIconDivClass", innerHTML: "<img src=app/resources/img/Facebook_logo.png>"});
						}
						if(key == "Twitter"){
							var myIcon = domConstruct.create("div", {"class": "serviceSelectorIconDivClass", innerHTML: "<img src=app/resources/img/Twitter_logo_blue_small.png>"});
						}
						if(key == "Instagram"){
							var myIcon = domConstruct.create("div", {"class": "serviceSelectorIconDivClass", innerHTML: "<img src=app/resources/img/Instagram_logo.png>"});
						}
						if(key == "Linkedin"){
							var myIcon = domConstruct.create("div", {"class": "serviceSelectorIconDivClass", innerHTML: "<img src=app/resources/img/LinkedIn_logo.png>"});
						}
						
						var div = domConstruct.create("span", {style: "float:left"});
						this.domNode.appendChild(div);
						var checkBoxHolder = domConstruct.create("div", {style: "float:left"});
						
						checkBoxHolder.appendChild(myCheckBox.domNode);
						div.appendChild(checkBoxHolder);
						div.appendChild(myIcon);
						
						this.currentCheckBoxes.push(myCheckBox);
					
					}
				}
				
				if(this.radioButtons != ""){
					this.currentButtons = [];
					for(var key in this.radioButtons){
						var myRadioButton = new RadioButton({
							label: key,
							style: "margin-left:70px",
							checked: this.radioButtons[key],
							"class": "radioCheckBox"
						})
						
						this.addChild(myRadioButton);
						var div;
						this.domNode.appendChild(div = domConstruct.create("div"));
						div.appendChild(domConstruct.create("label", {innerHTML : key, style: "width:20px;float:left", "for" : myRadioButton.id}));
						div.appendChild(myRadioButton.domNode);
						
						this.currentButtons.push(myRadioButton);
						
					}
				}
			}
		},
		
		_getButtonsAttr: function(){
			
			var returnButtons = [];
			for(i=0; i<this.currentButtons.length; i++){
				
				if(this.currentButtons[i].get("checked") == true){
					returnButtons.push(this.currentButtons[i].label);
				}
			}
			
			return returnButtons;
		},
		
		_getCheckBoxesAttr: function(){			/*By inheriting from WidgetBase and defining a function that looks like "_get" + str + "Attr" 
												str will map from get(str) to _getStrAttr see https://dojotoolkit.org/documentation/tutorials/1.7/understanding_widgetbase/ */
			
			var returnCheckBoxes = [];
			for(i=0; i<this.currentCheckBoxes.length; i++){
				
				if(this.currentCheckBoxes[i].get("checked") == true){
					returnCheckBoxes.push(this.currentCheckBoxes[i].label);
				}
			}
			
			return returnCheckBoxes;
		},
		
		
		
		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onCheckStateChanged: function(/*Widget*//*===== listItem, =====*/ /*String*//*===== newState =====*/){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the check state has been changed.
		},

		_setStatefulAttr: function(stateful){
			// tags:
			//		private
			this._set("stateful", stateful);
			this.selectOne = stateful;
			array.forEach(this.getChildren(), function(child){
				child.setArrow && child.setArrow();
			});
		},

		deselectItem: function(/*dojox/mobile/ListItem*/item){
			// summary:
			//		Deselects the given item.
			item.set("selected", false);
		},

		deselectAll: function(){
			// summary:
			//		Deselects all the items.
			array.forEach(this.getChildren(), function(child){
				child.set("selected", false);
			});
		},

		selectItem: function(/*ListItem*/item){
			// summary:
			//		Selects the given item.
			item.set("selected", true);
		}
	});
});
