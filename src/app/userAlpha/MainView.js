define(['dojo/_base/declare',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		"dojo/_base/connect",
		"dojo/on",
		"dojo/_base/event",
		"dojo/mouse",
		'dojo/_base/kernel',
		'dojo/dom-geometry',
		'dojo/dom-class',
		
		'dojo-mama/views/ModuleScrollableView',
		
		'app/util/xhrManager',
		'app/SelectorBar',
		
		"dojox/mobile/sniff",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
	], function(	
		declare, 
		domConstruct, 
		topic, 
		lang, 
		connect,
		on,
		event,
		mouse,
		kernel,
		domGeom,
		domClass,
		
		ModuleScrollableView,
		
		xhrManager, 
		SelectorBar,
			
		has,
		RoundRectList, 
		ListItem, 
		Button, 
		ToolBarButton, 
		EdgeToEdgeCategory
		) {
			
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		
		deactivate: function(){
			//get rid of anything on transition out
			this.removeChild(this.list);
			this.list.destroyRecursive();
		},
		
		activate: function() {
			this.fromVar = 0;

			topic.publish("/dojo-mama/updateSubNav", {back: '/people', title: "People alphabetically"} );
			if(this.list){
				console.log("List exists, transitioning to last place now");
				
				this.list.destroyRecursive();
				this.selectorList.destroyRecursive();
				console.log("BOOM: made new list");
				this.getFriendContacts(this.fromVar).then(lang.hitch(this,this.buildList));
			}else{
				console.log("No list made, making one now");
			
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
				this.getFriendContacts(this.fromVar).then(lang.hitch(this,this.buildList));
			}
		},
		
		buildList: function(data){
			console.log(data);
			this.counter = 0;
			this.objects = data;
			
			this.selectorList = new RoundRectList({
				style: "margin-top:50px; border:none"
			})
			this.addChild(this.selectorList);
			
			if(!this.selectorItem){
				this.scrollButton = new Button({
					label: "Top",
					onClick: lang.hitch(this, function(){
						var scroller = lang.hitch(this, function(){
							if(this.domNode.scrollTop <= 0){
								this.domNode.scrollTop = 0;
							}else{
								this.domNode.scrollTop = this.domNode.scrollTop - (this.domNode.scrollTop*.08);
								if(this.domNode.scrollTop != 0){
									setTimeout(scroller, 20);
								}
							}
						});
						setTimeout(scroller, 20);
					})
				});
				this.selectButton = new Button({
					label: "View Users",
					onClick: lang.hitch(this, function(selectorItem){
						if(this.counter > 0){
							this.FeedView.users = [];
							var kids = this.list.getChildren();
						
							for(var g = 0; g < kids.length; g++){
								if(kids[g].checked == true){
									this.FeedView.users.push(kids[g].objID);
								}				
							}
							this.selectorItem.destroyRecursive();
							this.selectorItem = null;
							this.router.go("/FeedView");
						}else{
							console.log("Must have at least one user selected to view");
						}
					})
				});
				this.selectorItem = new SelectorBar({
					buttons: [this.scrollButton, this.selectButton]
				})
				this.selectorItem.placeAt(this.domNode.parentNode);
			}
			this.list = new RoundRectList({
				select: "multiple",
				onCheckStateChanged: lang.hitch(this, function(){
					this.counter = 0;
					if(arguments[1] == true){
						this.counter++;
					}else{
						this.counter--;
					}
					var kids = this.list.getChildren();
					for(var g = 0; g < kids.length; g++){
						if(kids[g].checked == true){
							this.counter++;
						}
					}
				})	
			})
			this.addChild(this.list);
			
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addListItems(k[i]);
			}
		
		},
		
		postAddListItems: function(obj){
			this.objects = obj;
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addListItems(k[i]);
			}
		},
		
		addListItems: function(name){
			var serviceStr = '';
			var services = {};
			var serviceObj = {};

			var mainID = this.objects[name].data.id.split("-----");
			services[mainID[0]] = 1;

			if(this.objects[name].data.owns.length > 0){
				for(var t = 0; t < this.objects[name].data.owns.length; t++){
					var tempArr = this.objects[name].data.owns[t].split("-----");
					services[tempArr[0]] = 1;
				}
			}

			var k = Object.keys(services);
			for(var f = 0; f < k.length; f++){
				serviceObj[k[f]] = "";
			}

			var item = new ListItem({
				variableHeight: true,
				label: name,
				"class": "contactsManItemClass",
				objID: this.objects[name].data.id
			})
			this.list.addChild(item);

			var iconDiv = domConstruct.create("div", {style: "float:right", "class": "serviceIcon1"});
			
			if('Facebook' in serviceObj){
				var divFacebook = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Facebook_logo.png>"});
				iconDiv.appendChild(divFacebook);
			}
			if('Twitter' in serviceObj){
				var divTwitter = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Twitter_logo_blue_small.png>"});
				iconDiv.appendChild(divTwitter);
			}
			if('Instagram' in serviceObj){
				var divInstagram = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/Instagram_logo.png>"});
				iconDiv.appendChild(divInstagram);
			}
			if('Linkedin' in serviceObj){
				var divLinkedIn = domConstruct.create("div", {style:"float:right", innerHTML: "<img src=app/resources/img/LinkedIn_logo.png>"});
				iconDiv.appendChild(divLinkedIn);
			}

			item.domNode.appendChild(iconDiv);
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);
			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			this.getFriendContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddListItems));
		}
	})
});
