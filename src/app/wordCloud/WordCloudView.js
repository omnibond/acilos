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
		
		"dojox/mobile/ScrollableView",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
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
	
	ScrollableView,
	RoundRectList,
	ListItem,
	ToolBarButton,
	EdgeToEdgeCategory,
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
					this.div = domConstruct.create("div", {id: "oneTwo"});
					this.domNode.appendChild(this.div);
					
					var fill = d3.scale.category20();

					var draw = function(words) {
					    d3.select(this.div).append("svg")
						.attr("width", 300)
						.attr("height", 300)
					      .append("g")
						.attr("transform", "translate(150,150)")
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
					
					d3.layout.cloud().size([300, 300])
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
						var clients = obj;
						clients.push(mainUser);
						console.log("CLIENTS: ", clients);
						//build and return a list for each user/ownedGroup
						this.cloud = this.buildCloud(clients, this.numWords);
					}, mainUser))
				}
			}))
			
		},

		deactivate: function(){
			if(this.div){
				this.domNode.removeChild(this.div);
				this.div = null;
			}
			if(this.errorMsg){
				this.errorMsg.destroyRecursive();
				this.errorMsg = null;
			}
		}
	})
});