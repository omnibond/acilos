define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		"dojo/_base/lang",
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button"
], function(declare, ModuleScrollableView, domConstruct, topic, lang, RoundRectList, ListItem, Button) {
	return declare([ModuleScrollableView], {		
		postCreate: function(){
			this.list = new RoundRectList({
					
			})
			this.item = new ListItem({
				variableHeight: true,
				"class": "helpItemClass"
			})				
			this.dbRestartButton = new Button({
				label: "Restart Database",
				style: "float: center",
				onClick: lang.hitch(this, function(){
					if(this.responseItem){
						this.responseItem.destroyRecursive();
					}
					this.restartDB().then(lang.hitch(this, function(obj){
						this.populateResponse(obj);
					}));
				})
			})
			this.item.addChild(this.dbRestartButton);
			this.list.addChild(this.item);
			this.addChild(this.list);			
		},
		
		populateResponse: function(obj){
			console.log(obj);
			this.responseItem = new ListItem({
				style: "border:none"
			})
			this.addChild(this.responseItem);
			if(obj['success']){
				switch(obj['success']){
					case "running":
						this.responseItem.set("label", "Database is running already");
					break;
					case "started":
						this.responseItem.set("label", "Database is starting, give it just a moment");
					break;
				}
			}else if(obj['error']){
				this.responseItem.set("label", "Error starting Database: ");
			}
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/help', title: "Restart the database"} );
			
			if(this.responseItem){
				this.responseItem.destroyRecursive();
			}
		}
	})
});