/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines serviceBarGraph of the barGraph module
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
		'dojo/on',
		'dojo/dom-geometry',
		"dojo/dom-style",
		
		'app/util/xhrManager',
		'app/TitleBar',
		"app/SelectorBar",
		
		"app/SelRoundRectList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/Heading"
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		topic, 
		lang, 
		on,
		domGeom,
		domStyle,
		
		xhrManager, 
		TitleBar, 
		SelectorBar,
		
		RoundRectList, 
		Button, 
		ListItem, 
		ToolBarButton, 
		EdgeToEdgeCategory,
		Heading
) {
	return declare([ModuleScrollableView], {	
		"class": "barGraph",
		
		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/barGraph', title: "Service Bar Graph"} );	

			if(this.div){
				this.domNode.removeChild(this.div);
				this.div = null;
			}

			this.button = new Button({
				"left": "true",
				"name": "manualRefreshButton",
				onClick: lang.hitch(this, function(){
					if(this.div){
						this.domNode.removeChild(this.div);
						this.div = null;
					}
			
					this.getAllBarGraphClients().then(lang.hitch(this, this.buildServiceBarGraph));
				})
			});
			this.selectorItem = new SelectorBar({
				buttons: [this.button],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);
			
			this.getAllBarGraphClients().then(lang.hitch(this, this.buildServiceBarGraph));
		},

		buildServiceBarGraph: function(obj){
			console.log("serviceBarGraph/MainView.js: ", obj);
			var tempObj = {
				'Facebook': {
					'count': 0
				},
				'Twitter': {
					'count': 0
				},
				'Instagram': {
					'count': 0
				},
				'Linkedin': {
					'count': 0
				}
			}

			for (var index in obj){
				if(obj[index]['Service'] == "Facebook"){
					tempObj['Facebook']['count']++;
				}
				if(obj[index]['Service'] == "Twitter"){
					tempObj['Twitter']['count']++;
				}
				if(obj[index]['Service'] == "Instagram"){
					tempObj['Instagram']['count']++;
				}
				if(obj[index]['Service'] == "Linkedin"){
					tempObj['Linkedin']['count']++;
				}
			}

			var data = [];
			for (var thing in tempObj){
				var tmp = {"service" : thing,
							'count' : tempObj[thing]['count']
						}
				data.push(tmp);
			}

			var margin = {top: 20, right: 10, bottom: 100, left: 60},
			    //width = 800 - margin.left - margin.right,
			    //height = 500 - margin.top - margin.bottom;
			    width = this.domNode.offsetWidth - margin.left - margin.right;
			    height = this.domNode.offsetHeight - margin.top - margin.bottom;

			var formatPercent = d3.format("0");

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(formatPercent);

			this.div = domConstruct.create("div", {id: "oneTwo", style: "margin-top: 50px"});
			this.domNode.appendChild(this.div);

			this.svg = d3.select(this.div).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//	d3.tsv("app/userBarGraph/data.tsv", type, function(error, data) {
			  x.domain(data.map(function(d) { return d['service']; }));
			  y.domain([0, d3.max(data, function(d) { return d['count']; })]);

			  this.svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis)
			      .selectAll("text")  
		            .style("text-anchor", "end")
		            .attr("dx", "-.8em")
		            .attr("dy", ".15em")
		            .attr("transform", function(d) {
		                return "rotate(-65)" 
		            });			

			  this.svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)

			      this.svg.append("text")
				  .attr("x", width / 2 )
			      .attr("y", 0)
			      .style("text-anchor", "middle")
			      //.text("Title");

			      this.svg.append("text")
			      .attr("x", width / 2 )
			      .attr("y",  height + 75)
			      .style("text-anchor", "middle")
			      .text("Service");

			      this.svg.append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 0-margin.left)
			      .attr("x",0 - (height / 2))
			      .attr("dy", "1em")
			      .style("text-anchor", "middle")
			      .text("Number of Posts");

			  this.svg.selectAll(".bar")
			      .data(data)
			    .enter().append("rect")
			      .attr("class", "bar")
			      .attr("x", function(d) { return x(d['service']); })
			      .attr("width", x.rangeBand())
			      .attr("y", function(d) { return y(d['count']); })
			      .attr("height", function(d) { return height - y(d['count']); });

		//	});

			function type(d) {
			  d.frequency = +d.frequency;
			  return d;
			}
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}
	})
});