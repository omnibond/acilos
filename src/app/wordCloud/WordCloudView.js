/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the wordCloudView of the wordCloud module
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
		"dojo/dom-style",
		
		'app/util/xhrManager',
		"app/TitleBar",
		'dojox/mobile/ProgressIndicator',
		
		"dojox/mobile/ScrollableView",
		"app/SelRoundRectList",
		"app/SelectorBar",
		
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/Button",
		"dojox/mobile/RadioButton"
], function(
	declare,
	ModuleScrollableView,
	domConstruct,
	topic,
	lang,
	on,
	domStyle,
	
	xhrManager,
	TitleBar,
	ProgressIndicator,
	
	ScrollableView,
	RoundRectList,
	SelectorBar,
	
	ListItem,
	ToolBarButton,
	EdgeToEdgeCategory,
	Button,
	RadioButton
) {
	return declare([ModuleScrollableView], {		
		
		buildCloud: function(clients, numWords){
			this.createTagCloud(clients, numWords).then(lang.hitch(this, function(obj){				
				var wordArr = obj;
				
				if(this.div){
					this.domNode.removeChild(this.div);
					this.div = null;
				}
				if(this.errorMsg){
					this.errorMsg.destroyRecursive();
					this.errorMsg = null;
				}
				
				if(wordArr.length == 0){
					this.errorMsg = new ListItem({
						label: "User has no comments to generate a cloud with"
					});
					this.addChild(this.errorMsg);
				}else{
					this.div = domConstruct.create("div", {id: "oneTwo", style: "margin-top: 40px"});
					this.domNode.appendChild(this.div);
					
					var fill = d3.scale.category20();

					var translateX = (this.domNode.offsetWidth - 25)/2;
					var translateY = (this.domNode.offsetHeight - 25)/2;

					var draw = function(words) {
					    d3.select(this.div).append("svg")
						.attr("width", this.domNode.offsetWidth - 25)
						.attr("height", this.domNode.offsetHeight - 25)
					      .append("g")
						//.attr("transform", "translate(150,150)")
						.attr("transform", "translate(" + translateX + "," + translateY + ")")
					      .selectAll("text")
						.data(words)
					      .enter().append("text")
						.style("font-size", function(d) { return d.size + "px"; })
						.style("font-family", "Impact")
						.style("fill", function(d, i) { return fill(i); })
						.attr("text-anchor", "middle")
						.attr("transform", function(d) {
						  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
						})
						.text(function(d) { return d.text; });
					 }
					
					d3.layout.cloud().size([this.domNode.offsetWidth - 25, this.domNode.offsetHeight - 25])
					.words(wordArr.map(function(d) {
					return {text: d, size: 10 + Math.random() * 90};
					}))
					.rotate(function() { return ~~(Math.random() * 2) * 90; })
					.font("Impact")
					.fontSize(function(d) { return d.size; })
					.on("end", lang.hitch(this, draw))
					.start();
					
					this.resize();
				}
			}))
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/wordCloud', title: this.name} );

			this.pi = new ProgressIndicator();
			this.pi.placeAt(document.body);
			this.pi.start();
			
			this.button = new Button({
				"left": "true",
				"name": "manualRefreshButton",
				onClick: lang.hitch(this, function(){
					this.buildCloud(this.clients, this.numWords);
				})
			});
			this.selectorItem = new SelectorBar({
				buttons: [this.button],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);
			
			this.getSpecificClients(this.users).then(lang.hitch(this, function(obj){
				for(y = 0; y < obj.length; y++){
					//get each group of owned users
					var ownsArray = [];
					//set the main user from MainView
					for(var x = 0; x < obj[y].data.owns.length; x++){
						ownsArray.push(obj[y].data.owns[x]);
					}
					var mainUser = obj[y];
					this.getSpecificClients(ownsArray).then(lang.hitch(this, function(mainUser, obj){
						var mainUser = mainUser;
						//set the ownedUsers for each MainView user
						this.clients = obj;
						this.clients.push(mainUser);
						console.log("CLIENTS: ", this.clients);

						//build and return a list for each user/ownedGroup
						this.buildCloud(this.clients, this.numWords);

						this.pi.stop();
					}, mainUser))
				}
			}))
			
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
			if(this.div){
				this.domNode.removeChild(this.div);
				this.div = null;
			}
			if(this.errorMsg){
				this.errorMsg.destroyRecursive();
				this.errorMsg = null;
			}
			if(this.pi){
				this.pi.destroyRecursive();
				this.pi = null;
			}
		}
	})
});
