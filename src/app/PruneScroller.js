define([
		"dojo/_base/declare",
		"dojo/dom",
		'dojo/_base/kernel',
		"dojo/dom-construct",
		"dojo/_base/window",
		"dojo/dom-style",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/DeferredList",
		
		"app/mainFeed/facebookFeedItem",
		"app/mainFeed/twitterFeedItem",
		"app/mainFeed/linkedinFeedItem",
		"app/mainFeed/instagramFeedItem",
		'app/util/xhrManager',

		"dojox/mobile/EdgeToEdgeList",
		"dojox/mobile/ListItem",
		"dojox/mobile/ToolBarButton",
		
		"dojo/ready"

	], function(
		declare,
		dom,
		kernel,
		domConstruct,
		domWindow,
		domStyle,
		domAttr,
		lang,
		DeferredList,

		facebookFeedItem,
		twitterFeedItem,
		linkedinFeedItem,
		instagramFeedItem,
		xhrManager,
		
		EdgeToEdgeList,
		ListItem,
		ToolBarButton,
		
		ready
	){
		return declare("SearchScroller",[EdgeToEdgeList], {
			"class": "feedScrollerRoundRectClass",
			itemList: {},
			
			constructor: function(){
				this.ListEnded = false;
			},
			
			searchStarred: function(star){
				var params = {star : star};
				return xhrManager.send('GET', 'rest/v1.0/Search/starred', params);
			},
			
			searchStarredClients: function(){
				var params = [];
				return xhrManager.send('GET', 'rest/v1.0/Search/starredClients', params);
			},
			
			postCreate: function(){
				console.log("HERE");
				this.arrayList = [];
				this.arrayList.push(this.searchStarredClients().then(lang.hitch(this, function(obj){
					console.log("STARCLIENTOBJ: ", obj);
					this.starClientObj = [];
					for(var t = 0; t < obj.hits.hits.length; t++){
						var tempArr = obj.hits.hits[t]._source.data.id.split("-");
						this.starClientObj.push(tempArr[1]);
						for(var h = 0; h < obj.hits.hits[t]._source.data.owns.length; h++){
							var tempArray = obj.hits.hits[t]._source.data.owns[h].split("-");
							this.starClientObj.push(tempArray[1]);
						}
					}
				})));
				this.arrayList.push(this.getFeedData(this.feedName, this.fromVar).then(lang.hitch(this, function(obj){
					this.feedDataObj = obj;
				})));
				
				var defList = new DeferredList(this.arrayList);
				defList.then(lang.hitch(this, this.buildView));			
			},
			
			buildView: function(data){
				if(!this.deleteEverything){
					this.deleteEverything = new ToolBarButton({
						label: "Delete Everything",
						style: "margin-left: 0px",
						onClick: lang.hitch(this, function(){
							this.deleteAll(this.itemList);
							this.view.router.go("/");
						}, data, j, list)
					});
					this.addChild(this.deleteEverything);
				}				
				var data = this.feedDataObj;
				if(data.error){
					if(this.ListEnded == false){
						this.errorItem = new ListItem({
							//label: data.error,
							label: "There is no more data, make more friends",
							"class": "feedSearchErrorClass"
						})
						this.addChild(this.errorItem);
						this.ListEnded = true;
					}
				}else if(data.hits.hits.length == 0){
					if(this.ListEnded == false){
						var item = new ListItem({
							label: "There is no more data, make more friends",
							"class": "feedSearchErrorClass"
						})
						this.addChild(item);
						this.ListEnded = true;
					}
				}else{					
					console.log("hits", this.feedName);
					console.log(data.hits.hits);
					var feedListArray = {};
					feedListArray['Current'] = '';	
					//invisible list item so that the scroll into view (0) will always scroll to the top
					var item = new ListItem({
						style: "height:0px"
					});
					this.addChild(item);
					for(var j=0; j<data.hits.hits.length; j++){
						this.itemList[data.hits.hits[j]._source.id] = 1;
						
						var list = new EdgeToEdgeList({
							style: "border:none"
						});
						var keepDestroy = new ListItem({
							style: "border:none"
						});
						var keep = new ToolBarButton({
							label: "Keep this post",
							style: "margin-left: 0px",
							onClick: lang.hitch(this, function(data, j, list){
								console.log("this ID is: ", data.hits.hits[j]._source.id);
								console.log("this name is: ", data.hits.hits[j]._source.actor.displayName);
								if(this.itemList[data.hits.hits[j]._source.id]){
									delete this.itemList[data.hits.hits[j]._source.id];
								}
								list.destroyRecursive();
							}, data, j, list)
						});
						var destroy = new ToolBarButton({
							label: "Delete this post",
							onClick: lang.hitch(this, function(data, j, list){
								console.log("tis name is: ", data.hits.hits[j]._source.actor.displayName);
								if(this.itemList[data.hits.hits[j]._source.id]){
									delete this.itemList[data.hits.hits[j]._source.id];
								}	
								this.deleteItem(data.hits.hits[j]._source.id);
								list.destroyRecursive();
							}, data, j, list)
						});
						keepDestroy.addChild(keep);
						keepDestroy.addChild(destroy);
						list.addChild(keepDestroy);
						switch(data.hits.hits[j]._source.service){
							case "Twitter":
								var item = new twitterFeedItem({
									data: data,
									counter: j,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient
								})
								list.addChild(item);
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["Twitter"] = "true";
							break;
							case "Instagram":								
								var item = new instagramFeedItem({
									data: data,
									counter: j,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,							
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient									
								})
								list.addChild(item);
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["Instagram"] = "true";
							break;
							case "Facebook":
								var item = new facebookFeedItem({
									data: data,
									counter: j,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient
								})
								list.addChild(item);
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["Facebook"] = "true";								
							break;
							case "LinkedIn":
								var item = new linkedinFeedItem({
									data: data,
									counter: j,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient
								})
								list.addChild(item);
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["LinkedIn"] = "true";								
							break;
							default:
								console.log("Default list item");
							break;
						}
						this.addChild(list);
					}
					
					this.resize();
				}
			},
			
			postAddToList: function(from){	
				if(from < 0){
					from = 0;
				}
				this.arrayList = [];
				this.arrayList.push(this.searchStarred("all").then(lang.hitch(this, function(obj){
					this.starObj = obj;
				})));
				this.arrayList.push(this.searchStarredClients().then(lang.hitch(this, function(obj){
					this.starClientObj = [];
					for(var t = 0; t < obj.hits.hits.length; t++){
						var tempArr = obj.hits.hits[t]._source.data.id.split("-");
						this.starClientObj.push(tempArr[1]);
						for(var h = 0; h < obj.hits.hits[t]._source.data.owns.length; h++){
							var tempArray = obj.hits.hits[t]._source.data.owns[h].split("-");
							this.starClientObj.push(tempArray[1]);
						}
					}
				})));
				this.arrayList.push(this.getFeedData(this.feedName, from).then(lang.hitch(this, function(obj){
					this.feedDataObj = obj;
				})));
				
				var defList = new DeferredList(this.arrayList);
				defList.then(lang.hitch(this, this.buildView));
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
			},
			
			parseSpecialChars: function(str) {
				var stringArr = str.split(" ");
				var finalStr = '';
				
				var patternURL = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
				var patternHashTag = new RegExp(/\B#\w*[a-zA-Z]+\w*/);
				var patternAt = new RegExp(/\B@\w*[a-zA-Z]+\w*/);
				
				for(var u = 0; u < stringArr.length; u++){
					if(patternURL.test(stringArr[u])) {
						if(str.indexOf('...') === -1 && str.indexOf('..') === -1){
							finalStr += '<a href="'+stringArr[u]+'" target="_blank">'+stringArr[u]+'</a>' + " ";
						}else{
							finalStr += stringArr[u] + " ";
						}
					}else if(patternHashTag.test(stringArr[u])){
						//#HASTAGS
						var pre = '';
						var post = '';
						var word = '';
						//pre - if the word begins with " ' (
						if(stringArr[u].substring(0,1) == '"' || 
						stringArr[u].substring(0,1) == "(" ||
						stringArr[u].substring(0,1) == "'"){
							pre = stringArr[u].slice(0,1);
							//word here will include any post words until further edited below
							word = stringArr[u].slice(1);
							if(word.slice(word.length -1) == ":" || 
							word.slice(word.length -1) == "?" || 
							word.slice(word.length -1) == '"' || 
							word.slice(word.length -1) == "'" ||
							word.slice(word.length -1) == "." || 
							word.slice(word.length -1) == "," || 
							word.slice(word.length -1) == ")" || 
							word.slice(word.length -1) == ";"){
								post =word.slice(word.length -1);
								word = word.slice(0, -1);
							}
						}else{
							//post - if the word ends with : " ' ? ; , . )
							if(stringArr[u].slice(stringArr[u].length -1) == ":" || 
							stringArr[u].slice(stringArr[u].length -1) == "?" || 
							stringArr[u].slice(stringArr[u].length -1) == '"' || 
							stringArr[u].slice(stringArr[u].length -1) == "'" ||
							stringArr[u].slice(stringArr[u].length -1) == "." || 
							stringArr[u].slice(stringArr[u].length -1) == "," || 
							stringArr[u].slice(stringArr[u].length -1) == ")" || 
							stringArr[u].slice(stringArr[u].length -1) == ";"){
								post = stringArr[u].slice(stringArr[u].length -1);
								word = stringArr[u].slice(0, -1);
							}
						}
						finalStr += pre + '<a style="color:#048bf4">'+word+'</a>' + post + " ";
					}else if(patternAt.test(stringArr[u])){
						//@PEOPLE
						var pre = '';
						var post = '';
						var word = '';
						//pre - if the word begins with " ' (
						if(stringArr[u].substring(0,1) == '"' || 
						stringArr[u].substring(0,1) == "(" ||
						stringArr[u].substring(0,1) == "'"){
							pre = stringArr[u].slice(0,1);
							//word here will include any post words until further edited below
							word = stringArr[u].slice(1);
							if(word.slice(word.length -1) == ":" || 
							word.slice(word.length -1) == "?" || 
							word.slice(word.length -1) == '"' || 
							word.slice(word.length -1) == "'" ||
							word.slice(word.length -1) == "." || 
							word.slice(word.length -1) == "," || 
							word.slice(word.length -1) == ")" || 
							word.slice(word.length -1) == ";"){
								post =word.slice(word.length -1);
								word = word.slice(0, -1);
							}
						}else{
							//post - if the word ends with : " ' ? ; , . )
							if(stringArr[u].slice(stringArr[u].length -1) == ":" || 
							stringArr[u].slice(stringArr[u].length -1) == "?" || 
							stringArr[u].slice(stringArr[u].length -1) == '"' || 
							stringArr[u].slice(stringArr[u].length -1) == "'" ||
							stringArr[u].slice(stringArr[u].length -1) == "." || 
							stringArr[u].slice(stringArr[u].length -1) == "," || 
							stringArr[u].slice(stringArr[u].length -1) == ")" || 
							stringArr[u].slice(stringArr[u].length -1) == ";"){
								post = stringArr[u].slice(stringArr[u].length -1);
								word = stringArr[u].slice(0, -1);
							}
						}
						finalStr += pre + '<a style="color:#ee4115">'+word+'</a>' + post + " ";
					}else{
						finalStr += stringArr[u] + " ";
					}
				}
				
				return finalStr;
			},
			
			isURL: function(str) {
				var pattern = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);

				if(!pattern.test(str)) {
					return false;
				} else {
					//get rid of all ellipses as they flag almost every regEX for URLs
					if(str.indexOf('...') === -1){
						return true;
					}else{
						return false;
					}
				}
			}
			
		});
	}
);
