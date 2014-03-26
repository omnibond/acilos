/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the searchScroller widget
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

		"dojo-mama/util/EdgeToEdgeList",
		"dojox/mobile/ListItem",

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

		ready
	){
		return declare("SearchScroller",[EdgeToEdgeList], {
			"class": "feedScrollerRoundRectClass",

			constructor: function(){
				this.ListEnded = false;
			},

			getServiceCreds: function(){
				var params = {};
				return xhrManager.send('GET', 'rest/v1.0/Credentials/getServiceCreds');
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
				this.arrayList = [];
				this.arrayList.push(this.searchStarredClients().then(lang.hitch(this, function(obj){
					console.log("STARCLIENTOBJ: ", obj);
					this.starClientObj = [];
					for(var t = 0; t < obj.hits.hits.length; t++){
						var tempArr = obj.hits.hits[t]._source.data.id.split("-----");
						this.starClientObj.push(tempArr[1]);
						for(var h = 0; h < obj.hits.hits[t]._source.data.owns.length; h++){
							var tempArray = obj.hits.hits[t]._source.data.owns[h].split("-----");
							this.starClientObj.push(tempArray[1]);
						}
					}
				})));
				this.arrayList.push(this.getFeedData(this.feedName, this.fromVar).then(lang.hitch(this, function(obj){
					this.feedDataObj = obj;
				})));
				this.arrayList.push(this.getServiceCreds().then(lang.hitch(this, function(obj){
					this.authObj = obj;
				})));

				var defList = new DeferredList(this.arrayList);
				defList.then(lang.hitch(this, this.buildView));		
			},

			buildView: function(data){
				var data = this.feedDataObj;
				if(data.error){
					if(this.ListEnded == false){
						this.errorItem = new ListItem({
							//label: data.error,
							label: "There was an error getting data from the server",
							"class": "feedSearchErrorClass"
						})
						this.addChild(this.errorItem);
						this.ListEnded = true;
					}
				}else if(data.hits.hits.length == 0){
					if(this.ListEnded == false){
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
						switch(data.hits.hits[j]._source.service){
							case "Twitter":
								var item = new twitterFeedItem({
									data: data,
									counter: j,
									authObj: this.authObj,
									blastView: this.blastView,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient
								})
								this.addChild(item);
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["Twitter"] = "true";
							break;
							case "Instagram":								
								var item = new instagramFeedItem({
									data: data,
									counter: j,
									authObj: this.authObj,
									blastView: this.blastView,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									removeEmoji: this.removeEmoji,
									isURL: this.isURL,							
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient									
								})
								this.addChild(item);
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["Instagram"] = "true";
							break;
							case "Facebook":
								var item = new facebookFeedItem({
									data: data,
									counter: j,
									authObj: this.authObj,
									blastView: this.blastView,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient
								})
								this.addChild(item);	
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["Facebook"] = "true";								
							break;
							case "Linkedin":
								var item = new linkedinFeedItem({
									data: data,
									counter: j,
									authObj: this.authObj,
									blastView: this.blastView,
									starClientObj: this.starClientObj,
									getDate: this.getDate,
									parseSpecialChars: this.parseSpecialChars,
									isURL: this.isURL,
									setStarred: this.setStarred,
									setStarredClient: this.setStarredClient
								})
								this.addChild(item);	
								//add this to the services global var so we know which cron to refresh
								kernel.global.feedCount[this.FeedViewID].services["LinkedIn"] = "true";								
							break;
							default:
								console.log("Default list item");
							break;
						}
					}

					this.resize();
				}
			},

			postAddToList: function(from){	
				if(from < 0){
					from = 0;
				}
				this.arrayList = [];
				this.arrayList.push(this.searchStarredClients().then(lang.hitch(this, function(obj){
					this.starClientObj = [];
					for(var t = 0; t < obj.hits.hits.length; t++){
						var tempArr = obj.hits.hits[t]._source.data.id.split("-----");
						this.starClientObj.push(tempArr[1]);
						for(var h = 0; h < obj.hits.hits[t]._source.data.owns.length; h++){
							var tempArray = obj.hits.hits[t]._source.data.owns[h].split("-----");
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
				//var stringArr = str.split(" ");
				var regex = /([ \n])/;
				var stringArr = str.split(regex);
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
						var word = stringArr[u];
						//pre - if the word begins with " ' (
						for(var e = 0; e < stringArr[u].length; e++){
							if(stringArr[u].charAt(e) == ":" || 
							stringArr[u].charAt(e) == "?" || 
							stringArr[u].charAt(e) == '"' || 
							stringArr[u].charAt(e) == "'" ||
							stringArr[u].charAt(e) == "." || 
							stringArr[u].charAt(e) == "," || 
							stringArr[u].charAt(e) == ")" || 
							stringArr[u].charAt(e) == "!" || 
							stringArr[u].charAt(e) == "(" || 
							stringArr[u].charAt(e) == ";"){
								pre = stringArr[u].slice(0, e + 1);
								word = stringArr[u].slice(e + 1, stringArr[u].length);
							}else{
								break;
							}
						}
						//post - if the word ends with : " ' ? ; , . )
						for(var e = 0; e < word.length; e++){
							if(word.charAt(word.length - 1) == ":" || 
							word.charAt(word.length - 1) == "?" || 
							word.charAt(word.length - 1) == '"' || 
							word.charAt(word.length - 1) == "'" ||
							word.charAt(word.length - 1) == "." || 
							word.charAt(word.length - 1) == "," || 
							word.charAt(word.length - 1) == ")" || 
							word.charAt(word.length - 1) == "!" || 
							word.charAt(word.length - 1) == ";"){
								post += word.slice(-1);
								word = word.slice(0, -1);
							}else{
								post = post.split("").reverse().join("");
								break;
							}
						}

						finalStr += pre + '<a style="color:#048bf4">'+word+'</a>' + post + " ";
					}else if(patternAt.test(stringArr[u])){						
						//@PEOPLE
						var pre = '';
						var post = '';
						var word = stringArr[u];
						//console.log("before@: " + word);
						//pre - if the word begins with " ' (
						for(var e = 0; e < stringArr[u].length; e++){
							if(stringArr[u].charAt(e) == ":" || 
							stringArr[u].charAt(e) == "?" || 
							stringArr[u].charAt(e) == '"' || 
							stringArr[u].charAt(e) == "'" ||
							stringArr[u].charAt(e) == "." || 
							stringArr[u].charAt(e) == "," || 
							stringArr[u].charAt(e) == "&" || 
							stringArr[u].charAt(e) == ")" || 
							stringArr[u].charAt(e) == "!" || 
							stringArr[u].charAt(e) == "(" || 
							stringArr[u].charAt(e) == ";"){
								pre = stringArr[u].slice(0, e + 1);
								word = stringArr[u].slice(e + 1, stringArr[u].length);
							}else{
								break;
							}
						}
						//console.log("middle@: " + word);	
						//post - if the word ends with : " ' ? ; , . ) !
						for(var e = 0; e < word.length; e++){
							if(word.charAt(word.length - 1) == ":" || 
							word.charAt(word.length - 1) == "?" || 
							word.charAt(word.length - 1) == '"' || 
							word.charAt(word.length - 1) == "'" ||
							word.charAt(word.length - 1) == "." || 
							word.charAt(word.length - 1) == "," || 
							word.charAt(word.length - 1) == "&" || 
							word.charAt(word.length - 1) == ")" || 
							word.charAt(word.length - 1) == "!" || 
							word.charAt(word.length - 1) == ";"){
								post += word.slice(-1);
								word = word.slice(0, -1);
							}else{
								post = post.split("").reverse().join("");
								break;
							}
						}
						//console.log("after@: " + word);
						finalStr += pre + '<a style="color:#ee4115">'+word+'</a>' + post + " ";
					}else{
						finalStr += stringArr[u] + " ";
					}
				}

				return finalStr;
			},

			removeEmoji: function(text) {
				return text.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
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