define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		'dojo/on',
		'dojo/dom-geometry',
		
		'app/util/xhrManager',
		'app/TitleBar',
		'app/SelectorBar',
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/Button",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		"dojox/mobile/EdgeToEdgeCategory"
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
		EdgeToEdgeCategory
) {
	return declare([ModuleScrollableView], {		
		style: "overflow:scroll",
		
		constructor: function(){
			//this.fromVar = 0;
			//this.built = false;
		},
		
		buildView: function(obj){
			console.log(obj);
			this.objects = obj;
			this.list = new RoundRectList({
				style: "margin-top:40px"
			});
			this.addChild(this.list);
			
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				if(k[i] != ""){
					this.addDelButtons(k[i]);
				}
			}
		},

		getSize: function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		},
		
		dataPoints: function(){
			var pos= domGeom.position(this.list.domNode,true);
			
			if(Math.abs(pos.y) > Math.abs(pos.h) - 1500){
				this.getNextGroup();
			}
		},
		
		getNextGroup: function(){
			this.getContacts(this.fromVar+=20).then(lang.hitch(this,this.postAddDelButtons));
		},
		
		postAddDelButtons: function(obj){
			this.objects = obj;
			var k = Object.keys(this.objects);
			for(var i=0; i<k.length; i++){
				this.addDelButtons(k[i]);
			}
		},
		
		addDelButtons: function(name){
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

			//var item = new ListItem({
				/*rightIcon2: logo,*/
			//	variableHeight: true,
			//	clickable: true,
			//	label: name/* + " (" + serviceStr + ")"*/,
			//	"class": "contactsManItemClass",
			//	objID: objID,
			//	onClick: lang.hitch(this, function(objID){
			//		this.contactView.users = [];
			//		this.contactView.users.push(objID);
			//		this.router.go("/ContactView");
			//	}, objID)
			//});

			var item = domConstruct.create("div", {innerHTML: name, "class": "divListItem"});

			var objID = this.objects[name].data.id;

			this.list.domNode.appendChild(item);

			var iconDiv = domConstruct.create("div", {style: "float:right", "class": "serviceIcon2"});
			
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

			item.appendChild(iconDiv);

			item.onclick = lang.hitch(this, function(){
				this.contactView.users = [];
				this.contactView.users.push(objID);
				this.router.go("/ContactView");
			});
		},
		
		deactivate: function(){
			if(this.selectorBar){
				this.selectorBar.destroyRecursive();
				this.selectorBar = null;
			}
		},

		buildIt: function(){
			this.scrollButton = new Button({
				"name": "scrollButton",
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
			//title bar takes array of buttons that it puts one after another
			this.selectorBar = new SelectorBar({
				buttons: [this.scrollButton]
			});				
			this.selectorBar.placeAt(this.domNode.parentNode);
			
			if(this.list){
				console.log("BOOM: made new list");
				this.list.destroyRecursive();
				this.getContacts(this.fromVar).then(lang.hitch(this,this.buildView));
			}else{
				console.log("No list made, making one now");
				
				on(this.domNode, "scroll", lang.hitch(this, this.dataPoints));
				
				console.log("made new list");
				this.getContacts(this.fromVar).then(lang.hitch(this,this.buildView));
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/settings', title: "Select a contact to manage"} );
			
			//if(this.built == false){
			//	this.built = true;
			//	this.buildIt();
			//}
			this.fromVar = 0;
			this.buildIt();

		}		
	})
});