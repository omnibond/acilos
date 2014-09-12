/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the serviceLineChart for the lineChart module
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
			topic.publish("/dojo-mama/updateSubNav", {back: '/lineChart', title: "Service Line Chart"} );	

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
			
					this.getLineChartServices().then(lang.hitch(this, this.buildLineChart));
				})
			});
			this.selectorItem = new SelectorBar({
				buttons: [this.button],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);

			this.getLineChartServices().then(lang.hitch(this, this.buildLineChart));
		},

		buildLineChart: function(obj){
			console.log("our data is: ", obj);
			var keyArr = {};
			for(var g = 0; g < obj.length; g++){
				for(var thing in obj[g]){
					if(!keyArr[thing]){
						keyArr[thing] = 1;
					}
				}
			}
			/*var data = [];

			data.push(obj);*/
			var data = obj;
			for(var g = 0; g < data.length; g++){
				for(var thing in keyArr){
					if(!data[g][thing]){
						data[g][thing] = 0;
					}
				}
			}

			var margin = {top: 20, right: 70, bottom: 70, left: 70},
			    //width = 960 - margin.left - margin.right,
			    //height = 500 - margin.top - margin.bottom;
			    width = this.domNode.offsetWidth - margin.left - margin.right;
			    height = this.domNode.offsetHeight - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y%m%d").parse;

			var x = d3.scale.linear()
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
			    .x(function(d) { return x(d.TotalPosts); })
			    .y(function(d) { return y(d.service); });

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

			console.log("DATA IS: ", data);
		  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TotalPosts"; }));

		//  data.forEach(function(d) {
		 //   d.date = parseDate(d.date);
		//  });

		  var cities = color.domain().map(function(name) {
		    return {
		      name: name,
		      values: data.map(function(d) {
		        return {TotalPosts: d.TotalPosts, service: +d[name]};
		      })
		    };
		  });

		  x.domain([
		    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.TotalPosts; }); }),
		    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.TotalPosts; }); })
		  ]);

		  y.domain([
		    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.service; }); }),
		    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.service; }); })
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
	      .text("Number of Posts");

	      this.svg.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0-margin.left)
	      .attr("x",0 - (height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Number of Users");

		  var city = this.svg.selectAll(".city")
		      .data(cities)
		    .enter().append("g")
		      .attr("class", "city");

		  city.append("path")
		      .attr("class", "line")
		      .attr("d", function(d) { return line(d.values); })
		      .style("stroke", function(d) { return color(d.name); })
		      .style({ 'fill': 'none', 'stroke-width': '4px'})
		      .on("mouseover", function(d) {
    		
    			 var coords = d3.mouse(this);
    			 var x = coords[0];
    			 var y = coords[1];
    			
    			 div.transition()        
                	.duration(200)      
                	.style("opacity", .9);      
		         div.html(d.name)  
		            .style("left", (x + 20) + "px")     
		            .style("top", (y - 10) + "px"); 
			  })
			  .on("mouseout", function(d) {       
	            div.transition()        
	                .duration(500)      
	                .style("opacity", 0);   
	          });

		  city.append("text")
		      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
		      .attr("transform", function(d) { return "translate(" + x(d.value.TotalPosts) + "," + y(d.value.service) + ")"; })
		      .attr("x", 3)
		      .attr("dy", ".35em")
		      .text(function(d) { return d.name; });
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}	
	})
});