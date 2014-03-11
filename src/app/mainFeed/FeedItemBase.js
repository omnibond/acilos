define([
	"dojo/_base/array"
	,"dojo/_base/declare"
	,"dojo/_base/lang"
	,"dojo/_base/window"
	
	,"dojo/dom-class"
	,"dojo/touch"
	
	,"dijit/registry"
	,"dijit/_Contained"
	,"dijit/_Container"
	,"dijit/_WidgetBase"
	
	,"dojox/mobile/_ItemBase"
	
	,"dojox/mobile/TransitionEvent"
	,"dojox/mobile/iconUtils"
	,"dojox/mobile/sniff"
	
], function(
	
	array
	,declare
	,lang
	,win
	,domClass
	,touch
	,registry
	,Contained
	,Container
	,WidgetBase
	,ItemBase
	,TransitionEvent
	,iconUtils
	,has
	
	){

	// module:
	//		dojox/mobile/_ItemBase

	return declare("app.FeedReaders.DataObjItemBase", [ItemBase],{
		// labelTop: String **NEW
		//		A label of the item. If the label is not specified, innerHTML is
		//		used as a label.
		labelUser: "",
			labelUserLeft: "",
			labelUserRight: "",
		labelTop: "",
			labelTopLeft: "",
			labelTopRight: "",
		labelBottom: "",
		
		_setLabelUserAttr: function(/*String*/text){
			// tags:
			//		private
			this._set("labelUser", text);
			this.labelNodeU.innerHTML = this._cv ? this._cv(text) : text;
		},
		
			_setLabelUserRightAttr: function(/*String*/text){
				// tags:
				//		private
				this._set("labelUserRight", text);
				this.labelNodeUR.innerHTML = this._cv ? this._cv(text) : text;
			},
			
			_setLabelUserLeftAttr: function(/*String*/text){
				// tags:
				//		private
				this._set("labelUserLeft", text);
				this.labelNodeUL.innerHTML = this._cv ? this._cv(text) : text;
			},
		
		_setLabelTopAttr: function(/*String*/text){
			// tags:
			//		private
			this._set("labelTop", text);
			this.labelNodeT.innerHTML = this._cv ? this._cv(text) : text;
		},
		
			_setLabelTopLeftAttr: function(/*String*/text){
				// tags:
				//		private
				this._set("labelTopLeft", text);
				this.labelNodeTL.innerHTML = this._cv ? this._cv(text) : text;
			},
			
			_setLabelTopRightAttr: function(/*String*/text){
				// tags:
				//		private
				this._set("labelTopRight", text);
				this.labelNodeTR.innerHTML = this._cv ? this._cv(text) : text;
			},
		
		_setLabelBottomAttr: function(/*String*/text){
			// tags:
			//		private
			this._set("labelBottom", text);
			this.labelNodeB.innerHTML = this._cv ? this._cv(text) : text;
		},
		
		getDate: function(epoch){
			var date = new Date(parseFloat(epoch*1000));
			
			var str = '';
			var month = date.getMonth();
			var day = date.getDate();
			var year = date.getFullYear();
			var minutes;
			var pm = "false";
			var am = "false";

			if(date.getMinutes() < 10){
				minutes = ("0" + date.getMinutes());
			}else{
				minutes = date.getMinutes();
			}
			var hours = '';
			if(date.getHours() < 12){
				hours = date.getHours();
				am = "true";
			}else{
				hours = (date.getHours() - 12);
				pm = "true";
			}
			
			if(hours == 0){
				hours = 12;
			}
			
			month = month + 1;
			
			str = month + "/" + day + "/" + year + " @ " + hours + ":" + minutes;
			
			if(am == "true"){
				str += "am";
			}else if(pm == "true"){
				str += "pm";
			}
			
			return str;
		}
		
	});
});
