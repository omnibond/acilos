define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojox/mobile/EdgeToEdgeList"
], function(declare, lang, array, EdgeToEdgeList){

	// module:
	//		dojo-mama/util/EdgeToEdgeList

	return declare([EdgeToEdgeList], {
		// summary:
		//		An edge-to-edge layout list.
		// description:
		//		EdgeToEdgeList is an edge-to-edge layout list, which displays
		//		all items in equally-sized rows. Each item must be a
		//		dojox/mobile/ListItem.
		
		postCreate: function(){
			if(this.editable){
				require([this.editableMixinClass], lang.hitch(this, function(module){
					declare.safeMixin(this, new module());
				}));
			}

			//start edit
			//	we made this whole class just to comment out this one line!!! wtf dojo!!
			//	the rest of this function comes directly from dojox/mobile/RoundRectList
			//
			//	SCREW THIS LINE --> this.connect(this.domNode, "onselectstart", event.stop);
			//end edit

			if(this.syncWithViews){ // see also TabBar#postCreate
				var f = function(view, moveTo, dir, transition, context, method){
					var child = array.filter(this.getChildren(), function(w){
						return w.moveTo === "#" + view.id || w.moveTo === view.id; })[0];
					if(child){ child.set("selected", true); }
				};
				this.subscribe("/dojox/mobile/afterTransitionIn", f);
				this.subscribe("/dojox/mobile/startView", f);
			}
		}
	});
});
