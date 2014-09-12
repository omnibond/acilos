/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the userLineChart for the lineChart module
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
		'dojo/on',
		'dojo/dom-geometry',
		
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
		"class": "lineGraph",
		
		activate: function(e){			
			topic.publish("/dojo-mama/updateSubNav", {back: '/lineChart/selectUsersView', title: "User Line Chart"} );	

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
			
					this.getLineChartUsers(this.users).then(lang.hitch(this, this.buildLineChart));
				})
			});
			this.selectorItem = new SelectorBar({
				buttons: [this.button],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);

			console.log("userLineChart: ", this.users);

			this.getLineChartUsers(this.users).then(lang.hitch(this, this.buildLineChart));
		},

		buildLineChart: function(obj){
			console.log("our data is: ", obj);
			var data = [];
			var highestNum = 0;
			var dateArr = [];
			this.nameArr = [];
			this.timeObj = {};
			var keyArr = {};
			// this.increment;
			this.nameCounter = 0;

			/*for(var userName in obj){
				//we are finding the guy with the most datapoints here and getting all the dates from him
				//and setting them into an array to fake data points in the other users
				if(obj[userName].length > highestNum){
					dateArr = [];
					highestNum = obj[userName].length;
					for(var z=0; z<obj[userName].length; z++){
						dateArr.push(obj[userName][z]['time']);
					}
				}
			}*/

			for(var userName in obj){
				for(var d = 0; d < obj[userName].length; d++){
					this.timeObj[obj[userName][d]['time']] = obj[userName][d]['time'];
				}
			}

			for(var userName in obj){
				this.nameArr.push(userName);
			}
			for(var userName in obj){
				this.increment = 0;
				var values = [];
				this.tmpTimeObj = {};
				for(var g = 0; g < obj[userName].length; g++){
					this.tmpTimeObj[obj[userName][g]['time']] = obj[userName][g]['time'];
				}

				for(var key in this.timeObj){
					if(this.tmpTimeObj.hasOwnProperty(key)){
						tmp = {
							"count" : obj[this.nameArr[this.nameCounter]][this.increment]['count'],
							"date" : obj[this.nameArr[this.nameCounter]][this.increment]['time']
						}
						this.increment += 1;
					}else{
						tmp = {
							"count" : 0,
							"date" : key
						}
					}

					values.push(tmp);
				}

				if(values.length){
					data.push({
						"userName": userName,
					 	"values": values
					})
				}

				this.nameCounter += 1;
			}

			/*for(var userName in obj){
				var values = [];
				console.log("userName is: ", userName);

				for(x=0; x<highestNum; x++){
					console.log("x is: ", x);
					
					var tmp = {};
					if(obj[userName].length > x){
						tmp = {
							"count" : obj[userName][x]['count'],
							"date" : obj[userName][x]['time']
						}
					}else{
						tmp = {
							"count" : 0,
							"date" : dateArr[x]
						}
					}
					
					values.push(tmp)
				}
				// 0 is false
				if(values.length){
					data.push({
						"userName": userName,
					 	"values": values
					})
				}
			}*/

			console.log("our modified data is: ", data);

			var margin = {top: 20, right: 90, bottom: 90, left: 50},
			    //width = 960 - margin.left - margin.right,
			    //height = 500 - margin.top - margin.bottom;
			    width = this.domNode.offsetWidth - margin.left - margin.right;
			    height = this.domNode.offsetHeight - margin.top - margin.bottom;

			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var color = d3.scale.category10();

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			var line = d3.svg.line()
			    .interpolate("basis")
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.count); });

			this.div = domConstruct.create("div", {id: "oneTwo", style: "margin-top: 50px"});
			this.domNode.appendChild(this.div);

			var div = d3.select(this.div).append("div")   
				.attr("class", "tooltipDiv")               
				.style("opacity", 0);

			div[0][0].style.position = "absolute";

			this.svg = d3.select(this.div).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//d3.tsv("app/lineChart/data.tsv", lang.hitch(this, function(error, data) {
			  //finds the min and max of the data sets to set the min and max of the graph for X
			  x.domain([
			    d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.date; }); }),
			    d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.date; }); })
			  ]);
			  //finds the min and max of the data sets to set the min and max of the graph for Y
			  y.domain([
			    0,
			    d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.count; }); })
			  ]);

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
		      .attr("y",  height + margin.bottom)
		      .style("text-anchor", "middle")
		      .text("Time");

		      this.svg.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0-margin.left)
		      .attr("x",0 - (height / 2))
		      .attr("dy", "1em")
		      .style("text-anchor", "middle")
		      .text("Number of Posts");

			  //new data becomes this userLine
			  var userLine = this.svg.selectAll(".userLine")
			      .data(data)
			    .enter().append("g")
			      .attr("class", "userLine");
			  //each append happens on new userLine
			  userLine.append("path")
			      .attr("class", "line")
			      .attr("d", function(d) { return line(d.values); })
			      .style("stroke", function(d) { return color(d.userName); })
			      .style({ 'fill': 'none', 'stroke-width': '3px'})
			      .on("mouseover", function(d) {
	    		
	    			 var coords = d3.mouse(this);
	    			 var x = coords[0];
	    			 var y = coords[1];
	    			
	    			 div.transition()        
	                	.duration(200)      
	                	.style("opacity", .9);      
			         div.html(d.userName)  
			            .style("left", (x + 20) + "px")     
			            .style("top", (y - 10) + "px"); 
				  })
				  .on("mouseout", function(d) {       
		            div.transition()        
		                .duration(500)      
		                .style("opacity", 0);   
		          });
			  //each append happens on new userLine
			  userLine.append("text")
			      .datum(function(d) { return {name: d.userName, value: d.values[d.values.length - 1]}; })
			      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.count) + ")"; })
			      .attr("x", 3)
			      .attr("dy", ".35em")
			      .text(function(d) { return d.name; });
			//}));
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}	
	})
});
