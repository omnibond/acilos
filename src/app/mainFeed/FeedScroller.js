/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the feedScroller for the mainFeed
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
		"dojo/dom-class",
		"dojo/DeferredList",

		"app/mainFeed/facebookFeedItem",
		"app/mainFeed/twitterFeedItem",
		"app/mainFeed/linkedinFeedItem",
		"app/mainFeed/instagramFeedItem",
		"app/mainFeed/googleFeedItem",
		'app/util/xhrManager',
		
		"app/SelEdgeToEdgeList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Accordion",
		"dojox/mobile/ContentPane",
		
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
		domClass,
		DeferredList,
		
		facebookFeedItem,
		twitterFeedItem,
		linkedinFeedItem,
		instagramFeedItem,
		googleFeedItem,
		xhrManager,
		
		EdgeToEdgeList,
		ListItem,
		Accordion,
		Pane,
		
		ready
	){
		return declare("DataObjFeedListScroller",[EdgeToEdgeList], {
			"class": "feedScrollerRoundRectClass",
			
			constructor: function(){	
				this.ListEnded = false;
			},
			
			getServiceCreds: function(){
				var params = {};
				return xhrManager.send('GET', 'rest/v1.0/Credentials/getServiceCreds');
			},
			
			searchStarred: function(star){
				var params = {star : star}; // var params = [star];
				console.log("searchStarred: ", params);
				return xhrManager.send('GET', 'rest/v1.0/Search/starred', params);
			},
			
			searchStarredClients: function(){
				var params = {};
				return xhrManager.send('GET', 'rest/v1.0/Search/starredClients');
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
					if(obj.success){
						this.feedDataObj = obj.success;
					}else{
						this.feedDataObj = obj;
					}
				})));
				this.arrayList.push(this.getServiceCreds().then(lang.hitch(this, function(obj){
					this.authObj = obj;
				})));
				
				var defList = new DeferredList(this.arrayList);
				defList.then(lang.hitch(this, this.buildView));
			},
			
			buildView: function(){
				var data = this.feedDataObj;
				
				if(data.error){
					var item = new ListItem({
						label: data.error,
						"class": "feedSearchErrorClass"
					});
					this.addChild(item);
				}else if(data.hits.hits.length === 0){
					if(this.ListEnded === false){
						this.ListEnded = true;
					}
				}else{
					console.log("hits", this.feedName);
					console.log(data.hits.hits);
					var item = new ListItem({
						style: "height:0px;border:none"
					});
					this.addChild(item);

					var feedListArray = {};
					feedListArray['Current'] = '';
					for(var j=0; j<data.hits.hits.length; j++){
						var pane = new Pane({	});
						if(this.postAddArray[data.hits.hits[j]._source.id]){
							console.log("skipping: " + data.hits.hits[j]._source);
						}else{
							switch(data.hits.hits[j]._source.service){
								case "Twitter":
									var item = new twitterFeedItem({
										data: data,
										counter: j,
										starClientObj: this.starClientObj,
										getDate: this.getDate,
										authObj: this.authObj,
										blastView: this.blastView,
										isURL: this.isURL,
										setStarred: this.setStarred,
										setStarredClient: this.setStarredClient
									});
									pane.addChild(item);
									//add this to the services global var so we know which cron to refresh
									kernel.global.feedCount[this.FeedViewID].services["Twitter"] = "true";
								break;
								case "Instagram":								
									var item = new instagramFeedItem({
										data: data,
										counter: j,
										starClientObj: this.starClientObj,
										getDate: this.getDate,
										authObj: this.authObj,
										blastView: this.blastView,
										removeEmoji: this.removeEmoji,
										isURL: this.isURL,
										setStarred: this.setStarred,
										setStarredClient: this.setStarredClient
									});
									pane.addChild(item);
									//add this to the services global var so we know which cron to refresh
									kernel.global.feedCount[this.FeedViewID].services["Instagram"] = "true";
								break;
								case "Facebook":
									var item = new facebookFeedItem({
										data: data,
										counter: j,
										starClientObj: this.starClientObj,
										getDate: this.getDate,
										authObj: this.authObj,
										blastView: this.blastView,
										isURL: this.isURL,
										setStarred: this.setStarred,
										setStarredClient: this.setStarredClient
									});
									pane.addChild(item);		
									//add this to the services global var so we know which cron to refresh
									kernel.global.feedCount[this.FeedViewID].services["Facebook"] = "true";									
								break;
								case "Google":
									var item = new googleFeedItem({
										data: data,
										counter: j,
										starClientObj: this.starClientObj,
										getDate: this.getDate,
										authObj: this.authObj,
										blastView: this.blastView,
										isURL: this.isURL,
										setStarred: this.setStarred,
										setStarredClient: this.setStarredClient
									});
									pane.addChild(item);		
									//add this to the services global var so we know which cron to refresh
									kernel.global.feedCount[this.FeedViewID].services["Google"] = "true";									
								break;
								case "Linkedin":
									var item = new linkedinFeedItem({
										data: data,
										counter: j,
										starClientObj: this.starClientObj,
										getDate: this.getDate,
										authObj: this.authObj,
										blastView: this.blastView,
										isURL: this.isURL,
										setStarred: this.setStarred,
										setStarredClient: this.setStarredClient
									});
									pane.addChild(item);		
									//add this to the services global var so we know which cron to refresh
									kernel.global.feedCount[this.FeedViewID].services["LinkedIn"] = "true";
								break;
								default:
									console.log("Default list item");
								break;
							}
							this.addChild(pane);
							var postID = data.hits.hits[j]._source.id;
							this.postAddArray[postID] = postID;
						}
					}
				}
				//set this variable when the list is done loading
				this.loading = false;
			},
			
			postAddToList: function(from){	
				this.loading = true;
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
					//this.feedDataObj = obj;
					if(obj.success){
						this.feedDataObj = obj.success;
					}else{
						this.feedDataObj = obj.error;
					}
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
				
				if(hours === 0){
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
