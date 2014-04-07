/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the pieChart module
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
		"class": "pieChart",
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/analytics', title: "Service Pie Chart"} );	

			if(this.div){
				this.domNode.removeChild(this.div);
				this.div = null;
			}

			if(this.helpDiv){
				this.domNode.removeChild(this.helpDiv);
				this.helpDiv = null;
			}

			this.button = new Button({
				"left": "true",
				"name": "manualRefreshButton",
				onClick: lang.hitch(this, function(){
					if(this.div){
						this.domNode.removeChild(this.div);
						this.div = null;
					}

					if(this.helpDiv){
						this.domNode.removeChild(this.helpDiv);
						this.helpDiv = null;
					}
			
					this.getPieChartUsers().then(lang.hitch(this, this.buildPieChart));
				})
			});
			this.selectorItem = new SelectorBar({
				buttons: [this.button],
				style: "text-align: center"
			});
			this.selectorItem.placeAt(this.domNode.parentNode);

			this.getPieChartUsers().then(lang.hitch(this, this.buildPieChart));
		},

		buildPieChart: function(obj){
			var data = [];
			data.push(obj);

			for(x = 0; x < 4; x++){
				data[x] = {};
			}
			data[0]['Service'] = 'Facebook';
			data[1]['Service'] = 'Twitter';
			data[2]['Service'] = 'Instagram';
			data[3]['Service'] = 'LinkedIn';

			data[0]['NumUsers'] = obj['Facebook'];
			data[1]['NumUsers'] = obj['Twitter'];
			data[2]['NumUsers'] = obj['Instagram'];
			data[3]['NumUsers'] = obj['LinkedIn'];

			console.log("OUR DATA IS: ", data);

			var width = this.domNode.offsetWidth - 25,
			    height = this.domNode.offsetHeight - 25,
			    radius = Math.min(width, height) / 2;

			var color = d3.scale.ordinal()
			    .range(["#3B5998", "#55ACEE", "#4E433C", "#007bb6", "#", "#", "#"]);

			var arc = d3.svg.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			var pie = d3.layout.pie()
			    .sort(null)
			    .value(function(d) { return d.NumUsers; });

			this.helpDiv = domConstruct.create("div", {innerHTML: "Mouse over or tap and hold on a service to see the number of users", style: "font-weight: bold; color: #000000; text-align: center; margin-top: 40px"});
			this.domNode.appendChild(this.helpDiv);

			this.div = domConstruct.create("div", {id: "blah"});
			this.domNode.appendChild(this.div);

			var div = d3.select(this.div).append("div")   
				.attr("class", "tooltipDiv")               
				.style("opacity", 0);

			div[0][0].style.position = "absolute";

			var svg = d3.select(this.div).append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			//d3.csv("app/pieChart/data.csv", function(error, data) {
				console.log("DATA IS: ", data);

			  data.forEach(function(d) {
			    d.NumUsers = +d.NumUsers;
			  });

			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data.Service); })
			      .on("mouseover", function(d){
			      	var coords = d3.mouse(this);
	    		    var x = coords[0];
	    			var y = coords[1];
	    			
	    		    div.transition()        
	                   .duration(200)      
	                   .style("opacity", .9);      
			        div.html(d.data.Service + " - " + d.data.NumUsers + " users")  
			           .style("left", 75 + "px")   
			           .style("top", 75 + "px") 
			           .style("position", "absolute"); 
			           
			      })
					.on("mouseout", function(d) {       
		            div.transition()        
		                .duration(500)      
		                .style("opacity", 0);   
		          });

			  g.append("text")
			      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .style("text-anchor", "middle")
			      //.text(function(d) { return d.data.Service; });

			//});
		},

		deactivate: function(){
			if(this.selectorItem){
				this.selectorItem.destroyRecursive();
				this.selectorItem = null;
			}
		}	
	})
});