/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the feedView for the mainFeed module
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
		"dojo/_base/declare",
		"dijit/registry",
		'dojo/_base/kernel',
		"dojo/dom",
		'dojo/topic',
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
		"dojo/_base/array",
		"dojo/mouse",
		'dojo/dom-geometry',
		
		'dojo-mama/views/ModuleScrollableView',
		'dojo-mama/views/ModuleView',
		
		"app/mainFeed/facebookFeedItem",
		"app/mainFeed/twitterFeedItem",
		"app/mainFeed/linkedinFeedItem",
		"app/mainFeed/instagramFeedItem",
		"app/mainFeed/googleFeedItem",
		"app/mainFeed/FeedScroller",
		"app/SearchScroller",
		"app/TitleBar",
		"app/SelectorBar",
		'app/util/xhrManager',
		
		"dojox/mobile/sniff",
		"dojox/mobile/_css3",
		"dojox/mobile/ScrollableView",
		"dojox/mobile/Heading",
		"dojox/mobile/ToolBarButton",
		"app/SelRoundRectList",	
		"dojox/mobile/ListItem",
		"dojox/mobile/Accordion",
		"dojox/mobile/ContentPane",		
		"dojox/mobile/Button",	
		"dojox/mobile/TextBox",	
		"dijit/Dialog",
		
		"dojo/ready"

	], function(
		declare,
		registry,
		kernel,
		dom,
		topic,
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
		array,
		mouse,
		domGeom,
		
		ModuleScrollableView,
		ModuleView,
		
		facebookFeedItem,
		twitterFeedItem,
		linkedinFeedItem,
		instagramFeedItem,
		googleFeedItem,
		FeedScroller,
		SearchScroller,
		TitleBar,
		SelectorBar,
		xhrManager,

		has,
		css3,
		ScrollableView,
		Heading,
		ToolBarButton,
		RoundRectList,
		ListItem,
		Accordion,
		Pane,
		Button,
		TextBox,
		Dialog,
		
		ready
	){
		return declare("DataObjFeedListView",[ModuleScrollableView], {			
			style: "overflow:scroll",
			
			activate: function() {
				topic.publish("/dojo-mama/updateSubNav", {back: "/"+this.mod, title: "Manage Your Accounts"} );
				console.log(this.albumLinks);
				console.log(this.dataObj);
				if(this.albumLinks && this.albumLinks.length > 0){
					this.showAlbum();
				}else{
					window.location = "#/mainFeed";
				}
			},

			deactivate: function(){
				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
			},
			
			showAlbum: function(){
				this.mainList = new RoundRectList({
					
				})
				if(this.postText && this.postText != ""){
					var string = this.parseSpecialChars(this.postText);
					this.textContent = new ListItem({
						variableHeight: true,
						"class": "feedTextContentItemClass",
						label: string
					});
					this.mainList.addChild(this.textContent);
				}
				if(this.albumLinks.length > 0){
					for(var d = 0; d < this.albumLinks.length; d++){
						this.picContent = new ListItem({
							variableHeight: true,
							"class": "feedPicContentItemClass"
						});

						var div = domConstruct.create("div", {innerHTML: '<span><img src="'+this.albumLinks[d]+'" /></a></span>'});
					
						div.onclick = lang.hitch(this, function(d){
							var dialog = new Dialog({
								title: "Click to close ->",
								"class": "blackBackDijitDialog",
								onHide: lang.hitch(this, function(){
									if(blackoutDiv){
										document.body.removeChild(blackoutDiv);
									}
								})
							});

							var dialogDiv = domConstruct.create("div", {innerHTML: '<span><img src="'+this.albumLinks[d]+'" style="" /></a></span>'});

							var blackoutDiv = domConstruct.create("div", {"class": "blackoutDiv"});

							dialog.set("content", dialogDiv);
							dialog.show();

							document.body.appendChild(blackoutDiv);
						}, d);

						this.picContent.domNode.appendChild(div);
						this.mainList.addChild(this.picContent);
						
						var blastDiv = domConstruct.create("div", {style: "margin-left:5px;margin-bottom:30px", innerHTML: "Blast", "class": "twitterBlueDiv"});
				
						blastDiv.onclick = lang.hitch(this, function(blastDiv, d){
							this.blastView.blastObj = {};
							if(this.albumLinks[d] == undefined || this.albumLinks[d] == null){
								this.blastView.blastObj.url = "";
							}else{
								this.blastView.blastObj.url = this.albumLinks[d];
							}
							this.blastView.blastObj.imgName = this.dataObj.content.id;
							this.blastView.blastObj.postLink = this.dataObj.postLink;
							this.blastView.blastObj.service = this.dataObj.service;
							this.blastView.blastObj.poster = this.dataObj.actor.displayName;
							this.blastView.blastObj.msg = this.dataObj.content.text.text;
							this.downloadImage(this.blastView.blastObj.url, this.blastView.blastObj.imgName).then(lang.hitch(this, function(){
								window.location = "#/"+this.blastView.mod+this.blastView.route;
							}))
						}, blastDiv, d);
						
						this.commentHolder = new ListItem({
							variableHeight: true,
							"class": "feedCommentItemClass"
						});
						this.commentHolder.domNode.appendChild(blastDiv);
						this.mainList.addChild(this.commentHolder);
					}
				}
				this.addChild(this.mainList);
			},
			
			downloadImage: function(url, imgName){
				var params = {url: url, imgName: imgName};
				return xhrManager.send('POST', 'rest/v1.0/Blast/downloadImage', params);
			}
			
		});
	}
);
