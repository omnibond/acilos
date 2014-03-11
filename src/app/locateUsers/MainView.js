define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/on',
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/TitleBar',
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory",
		"dojox/mobile/Heading",
		"dojox/mobile/TextBox"
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
		
		RoundRectList, 
		Button, 
		ListItem, 
		ToolBarButton, 
		EdgeToEdgeCategory,
		Heading,
		TextBox
) {
	return declare([ModuleScrollableView], {
		buildMap: function(){
			this.holder = domConstruct.create('div', {style:"width:500px;height:500px;margin-left:10px;margin-top:10px"});		//Was originally 200px by 200px
			this.domNode.appendChild(this.holder);
			
			this.mapDiv = domConstruct.create('div', {id:"map-canvas", style:"width:100%;height:100%"}); 
			this.holder.appendChild(this.mapDiv);
		},

		buildList: function(){
			this.mainList = new RoundRectList({
				variableHeight: true,
				"class": "borderlessListItemClass"
			});
			this.instaListItem = new ListItem({
				variableHeight: true,
				"class": "borderlessListItemClass"
			});
			this.locationListItem = new ListItem({
				variableHeight: true,
				"class": "borderlessListItemClass"
			});

			this.buildInstagramAroundMeButton();
			this.buildLocationBox();

			this.mainList.addChild(this.instaListItem);
			this.mainList.addChild(this.locationListItem);

			this.instaListItem.addChild(this.instaAroundButton);
			this.locationListItem.addChild(this.locationBox);
			
			this.addChild(this.mainList);
		},

		buildInstagramAroundMeButton: function(){
			this.instaAroundButton = new ToolBarButton({
				label: "Show Instagram users in area",
				style: "margin-left:10px;margin-top:10px",
				clickable: true,
				onClick: lang.hitch(this, function(){
					console.log("CLICK");
					if(this.locationBox.get("value") == ""){
						this.item.set("rightText", "You must enter a location");
					}else{
						var loc = this.locationBox.get("value");
						var location = loc.replace(" ", "+");
						//anything that gets put after the function in lang.hitch moves all args down one and puts itself at the begining.
						//so now obj will be the SECOND param and "Foursquare" will be the first
						this.getAroundMe("InstagramLocal", location).then(lang.hitch(this, this.populate, "InstagramLocal"));
					}
				})
			})
		},

		buildLocationBox: function(){
			this.locationBox = new TextBox({
				placeHolder: "Enter a location",
				style: "margin-left:9px"
			})
		},

		populate: function(call, obj){
			for(var f = 0; f < obj.length; f++){
				if(call == "InstagramLocal"){
					this.addMarkerWithClick(obj[f]['latlng'], obj[f]['user']['username']);
				}else if(call == "Foursquare"){
					this.addMarkerWithClick(obj[f]['latlng'], obj[f]['name']);
				}
			}
		},

		addMarkerWithClick: function(marker, name){
			var markerArray = [];

			var image = {
			    url: 'app/locateUsers/google_earth.png',
			    // This marker is 256 pixels wide by 256 pixels tall.
			    size: new google.maps.Size(24, 24),
			    // The origin for this image is 0,0.
			    origin: new google.maps.Point(0,0),
			    // The anchor for this image is the base of the flagpole at 0,32.
			    anchor: new google.maps.Point(12, 12)
 		    };

 		    var shape = {
			    coord: [1, 1, 1, 20, 18, 20, 18 , 1],
			    type: 'poly'
			};

			var arr = marker.split("#");
			var latlng = new google.maps.LatLng(arr[0], arr[1]);
			var marker = new google.maps.Marker({
				position: latlng,
				title: name,
				//draggable: true,
				icon: image,
				animation: google.maps.Animation.DROP
			})
			google.maps.event.addListener(marker, 'click', toggleBounce, function(event){

				console.log("clicked", name);
			});
			markerArray.push(marker);
			marker.setMap(this.map);

			function toggleBounce(){
				if(marker.getAnimation() != null){
				    marker.setAnimation(null);
				}else{
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			}
		},

		initialize: function() {
			var latlng = new google.maps.LatLng(39, -106);
			var mapOptions = {
				zoom: 3,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			this.map = new google.maps.Map(this.mapDiv, mapOptions);
			//google.maps.event.trigger(this.map, "resize");
			
		},
		
		postCreate: function(){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
				this.buildList();
			}else{
				this.buildList();
			}
				
			this.buildMap();	

			this.initialize();	
		},

		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/analytics', title: "User Locations"} );
		}		
	})
});