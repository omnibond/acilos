define(['dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/dom-construct',
		'dojo/keys',
		'dojo/on',
		'dijit/_WidgetBase'
], function(declare, lang, domConstruct, keys, on, WidgetBase) {
	return declare([WidgetBase], {
		baseClass: "titleBar",
		buttons: [],
		
		buildRendering: function() {
			this.inherited(arguments);

			if(this.buttons.length > 0){
				for(var x = 0; x < this.buttons.length; x++){
					this.buttons[x].placeAt(this.domNode);
				}
			}
		}
			
	});
});