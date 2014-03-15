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
		GridLayout,
		Pane,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			activate: function() {				
				topic.publish("/dojo-mama/updateSubNav", {back: '/appHelp', title: "About Acilos"} );
				
				this.buildView();
			},

			parseSpecialChars: function(str) {
				//var stringArr = str.split(" ");
				var regex = /([ \n])/;
				var stringArr = str.split(regex);
				var finalStr = '';
				
				var patternURL = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
				var patternHashTag = new RegExp(/\B#\w*[a-zA-Z]+\w*/);
				var patternAt = new RegExp(/\B@\w*[a-zA-Z]+\w*/);
				
				for(var u = 0; u < stringArr.length; u++){
					if(patternURL.test(stringArr[u])) {
						if(str.indexOf('...') === -1 && str.indexOf('..') === -1){
							finalStr += '<a href="'+stringArr[u]+'" target="_blank">'+stringArr[u]+'</a>' + " ";
						}else{
							finalStr += stringArr[u] + " ";
						}
					}else if(patternHashTag.test(stringArr[u])){
						//#HASTAGS
						var pre = '';
						var post = '';
						var word = stringArr[u];
						//pre - if the word begins with " ' (
						for(var e = 0; e < stringArr[u].length; e++){
							if(stringArr[u].charAt(e) == ":" || 
							stringArr[u].charAt(e) == "?" || 
							stringArr[u].charAt(e) == '"' || 
							stringArr[u].charAt(e) == "'" ||
							stringArr[u].charAt(e) == "." || 
							stringArr[u].charAt(e) == "," || 
							stringArr[u].charAt(e) == ")" || 
							stringArr[u].charAt(e) == "!" || 
							stringArr[u].charAt(e) == "(" || 
							stringArr[u].charAt(e) == ";"){
								pre = stringArr[u].slice(0, e + 1);
								word = stringArr[u].slice(e + 1, stringArr[u].length);
							}else{
								break;
							}
						}
						//post - if the word ends with : " ' ? ; , . )
						for(var e = 0; e < word.length; e++){
							if(word.charAt(word.length - 1) == ":" || 
							word.charAt(word.length - 1) == "?" || 
							word.charAt(word.length - 1) == '"' || 
							word.charAt(word.length - 1) == "'" ||
							word.charAt(word.length - 1) == "." || 
							word.charAt(word.length - 1) == "," || 
							word.charAt(word.length - 1) == ")" || 
							word.charAt(word.length - 1) == "!" || 
							word.charAt(word.length - 1) == ";"){
								post += word.slice(-1);
								word = word.slice(0, -1);
							}else{
								post = post.split("").reverse().join("");
								break;
							}
						}
						
						finalStr += pre + '<a style="color:#048bf4">'+word+'</a>' + post + " ";
					}else if(patternAt.test(stringArr[u])){						
						//@PEOPLE
						var pre = '';
						var post = '';
						var word = stringArr[u];
						//console.log("before@: " + word);
						//pre - if the word begins with " ' (
						for(var e = 0; e < stringArr[u].length; e++){
							if(stringArr[u].charAt(e) == ":" || 
							stringArr[u].charAt(e) == "?" || 
							stringArr[u].charAt(e) == '"' || 
							stringArr[u].charAt(e) == "'" ||
							stringArr[u].charAt(e) == "." || 
							stringArr[u].charAt(e) == "," || 
							stringArr[u].charAt(e) == "&" || 
							stringArr[u].charAt(e) == ")" || 
							stringArr[u].charAt(e) == "!" || 
							stringArr[u].charAt(e) == "(" || 
							stringArr[u].charAt(e) == ";"){
								pre = stringArr[u].slice(0, e + 1);
								word = stringArr[u].slice(e + 1, stringArr[u].length);
							}else{
								break;
							}
						}
						//console.log("middle@: " + word);	
						//post - if the word ends with : " ' ? ; , . ) !
						for(var e = 0; e < word.length; e++){
							if(word.charAt(word.length - 1) == ":" || 
							word.charAt(word.length - 1) == "?" || 
							word.charAt(word.length - 1) == '"' || 
							word.charAt(word.length - 1) == "'" ||
							word.charAt(word.length - 1) == "." || 
							word.charAt(word.length - 1) == "," || 
							word.charAt(word.length - 1) == "&" || 
							word.charAt(word.length - 1) == ")" || 
							word.charAt(word.length - 1) == "!" || 
							word.charAt(word.length - 1) == ";"){
								post += word.slice(-1);
								word = word.slice(0, -1);
							}else{
								post = post.split("").reverse().join("");
								break;
							}
						}
						//console.log("after@: " + word);
						finalStr += pre + '<a style="color:#ee4115">'+word+'</a>' + post + " ";
					}else{
						finalStr += stringArr[u] + " ";
					}
				}
				
				return finalStr.trim();
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
					style: "font-weight:bold !important; border: none"
				});
				var supportExtra = new ListItem({
					variableHeight: true, 
					label: "For the best app experience, the latest version of one of the following browsers is recommended: ",
					style: "border: none"
				});
				var chromeListItem = new ListItem({
					variableHeight: true,
					clickable: true,
					noArrow: true,
					label: "Google Chrome",
					rightText: "(Windows, OS X, iOS, Android 4.0+)",
					style: "font-weight: bold !important",
					onClick: lang.hitch(this, function(){
						window.open("https://www.google.com/intl/en/chrome/browser/");
					})
				});

				var safariListItem = new ListItem({
					variableHeight: true,
					clickable: true,
					noArrow: true,
					label: "Apple Safari",
					rightText: "(Windows, OS X, iOS 6+)",
					style: "font-weight: bold !important",
					onClick: lang.hitch(this, function(){
						window.open("http://support.apple.com/downloads/#safari");
					})
				});

				var firefoxListItem = new ListItem({
					variableHeight: true,
					clickable: true,
					noArrow: true,
					label: "Mozilla Firefox",
					rightText: "(Windows, OS X)",
					style: "font-weight: bold !important",
					onClick: lang.hitch(this, function(){
						window.open("http://www.mozilla.org/en-US/firefox/new/");
					})
				});

				var internetExplorerListItem = new ListItem({
					variableHeight: true,
					clickable: true,
					noArrow: true,
					label: "Microsoft Internet Explorer 9+",
					rightText: "(Windows, Windows Phone 7+)",
					style: "font-weight: bold !important",
					onClick: lang.hitch(this, function(){
						window.open("http://www.microsoft.com/en-us/download/internet-explorer-10-details.aspx");
					})
				});
				supportList.addChild(support);
				supportList.addChild(supportExtra);
				supportList.addChild(chromeListItem);
				supportList.addChild(safariListItem);
				supportList.addChild(firefoxListItem);
				supportList.addChild(internetExplorerListItem);
				this.mainList.addChild(supportList);

				chromeListItem.labelNode.style.marginTop = "1px";
				safariListItem.labelNode.style.marginTop = "1px";
				firefoxListItem.labelNode.style.marginTop = "1px";
				internetExplorerListItem.labelNode.style.marginTop = "1px";

				chromeListItem.rightTextNode.style.marginTop = "1px";
				safariListItem.rightTextNode.style.marginTop = "1px";
				firefoxListItem.rightTextNode.style.marginTop = "1px";
				internetExplorerListItem.rightTextNode.style.marginTop = "1px";
				
				var feedbackList = new EdgeToEdgeList({
					style: "border:none"
				});
				var feedback = new ListItem({
					label: "Feedback",
					style: "font-weight:bold !important; border: none"
				});
				var feedbackExtra = new ListItem({
					variableHeight: true, 
					label: "Comments and suggestions are welcome and may be directed to the Acilos github page at " + this.parseSpecialChars("https://github.com/omnibond/acilos") + ". For more information about the app, please visit " + this.parseSpecialChars("www.acilos.com") + ".",
					style: "border: none"
				});
				feedbackList.addChild(feedback);
				feedbackList.addChild(feedbackExtra);
				this.mainList.addChild(feedbackList);
				
				var creditList = new EdgeToEdgeList({
					style: "border:none"
				});
				var credits = new ListItem({
					label: "Credits",
					style: "font-weight:bold !important; border: none"
				});
				var elasticExtra = new ListItem({
					variableHeight: true, 
					label: "elasticsearch — " + this.parseSpecialChars("http://www.elasticsearch.org/download/"),
					style: "border: none"
				});
				var dojoExtra = new ListItem({
					variableHeight: true, 
					label: "dojo — " + this.parseSpecialChars("http://download.dojotoolkit.org/"),
					style: "border: none"
				});
				var mamaExtra = new ListItem({
					variableHeight: true, 
					label: "dojo-mama — " + this.parseSpecialChars("https://github.com/OpenClemson/dojo-mama"),
					style: "border: none"
				});
				var abrahamExtra = new ListItem({
					variableHeight: true, 
					label: "twitter abraham client — " + this.parseSpecialChars("https://github.com/abraham/twitteroauth"),
					style: "border: none"
				});
				var nerveExtra = new ListItem({
					variableHeight: true, 
					label: "nerve-tattoo es client — " + this.parseSpecialChars("https://github.com/nervetattoo/elasticsearch"),
					style: "border: none"
				});
				var omniExtra = new ListItem({
					variableHeight: true, 
					label: "omnibond — " + this.parseSpecialChars("http://www.omnibond.com"),
					style: "border: none"
				});
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
