/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the BlastView of the mainFeed module
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
define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		"dojo/_base/lang",
		"dojo/dom-class",
		"dojo/dom-style",

		"app/SelRoundRectList",
		"app/SelEdgeToEdgeList",
		"dojox/mobile/CheckBox",
		'dojox/mobile/TextArea',
		'dojox/mobile/Button',
		"dojox/mobile/ListItem",
		"dojox/mobile/TextBox",
		"dijit/Calendar",
		"dojox/mobile/RadioButton",
		
		"dojox/form/Uploader",
		//"dojox/form/FileInputAuto",
		
		"app/post/FileList",
		"dijit/Dialog",

		'dojo/dom-construct',
		'dojo/topic'
], function(
	declare, 
	ModuleScrollableView,
	lang, 
	domClass,
	domStyle,

	RoundRectList, 
	EdgeToEdgeList,
	CheckBox,
	TextArea,
	Button,
	ListItem,
	TextBox,
	Calendar,
	RadioButton,
	
	Uploader,
	
	FileList,
	Dialog,
	
	domConstruct, 
	topic
) {
	return declare([ModuleScrollableView], {		
		buildMainList: function(){
			this.mainList = new RoundRectList({
				style: "margin:none;border:none"
			});

			this.buildUploadBar();

			this.addChild(this.mainList);
			this.resize();
		},
		
		buildUploadBar: function(){
			var item = new ListItem({
				variableHeight: true,
				style: "border:none"
			});
			this.mainList.addChild(item);
			
			this.checkArray = [];
			for(var key in this.authObj){
				if(key !== "login"){
					if(this.authObj[key].length > 0){
						var accountArr = this.authObj[key][0]['accounts'];
						for(var d = 0; d < accountArr.length; d++){	
							if(accountArr[d].accessToken != undefined){
								var divHolder = domConstruct.create("span", {style: "float: left"});
								if(key == "twitter"){
									var checkBox = new CheckBox({
										leToken: accountArr[d]['accessToken']+":"+accountArr[d]['accessSecret']+":"+accountArr[d]['key']+":"+accountArr[d]['secret'],
										leKey: key,
										style:"width:20px;height:20px"
									});
									//var picUrl = accountArr[d].image;
									var serviceUrl = "app/resources/img/Twitter_logo_blue_small.png";

									checkBox.onClick = lang.hitch(this, function(checkBox){
										if(checkBox.domNode.checked == true){
											if(this.textArea.get('value').length > 140){
												this.textAreaCountDiv.style.color = "red";
											}else{
												this.textAreaCountDiv.style.color = "black";
											}

											this.textAreaCountDiv.innerHTML = this.textArea.get("value").length + "/140 characters";

											checkBox.domNode.checked = false;
										}else{
											this.textAreaCountDiv.style.color = "black";
											this.textAreaCountDiv.innerHTML = this.textArea.get("value").length + " characters";

											checkBox.domNode.checked = true;
										}
									}, checkBox);
								}
								if(key == "facebook"){
									var checkBox = new CheckBox({
										leToken: accountArr[d]['accessToken']+":"+accountArr[d]['key']+":"+accountArr[d]['user'],
										leKey: key,
										style:"width:20px;height:20px"
									});
									//var picUrl = "https://graph.facebook.com/"+accountArr[d].image+"/picture";
									serviceUrl = "app/resources/img/Facebook_logo.png";
								}if(key == "linkedin"){
									var checkBox = new CheckBox({
										leToken: accountArr[d]['accessToken'],
										leKey: key,
										style:"width:20px;height:20px"
									});
									
									serviceUrl = "app/resources/img/LinkedIn_logo.png";
									
								}if(key == "google"){
									break;
								}if(key == "instagram"){
									break;
								}	
								
								divHolder.appendChild(checkBox.domNode);
								//For profile picture
								/*var picSpan = domConstruct.create("span", {innerHTML: '<img src='+serviceUrl+' height=20px width=20px/>', style: "margin-left: 10px; margin-right: 5px; height: 20px; width: 20px"});*/
								var picSpan = domConstruct.create("span", {innerHTML: '<img src='+serviceUrl+'>', style: "margin-left: 10px; margin-right: 5px; height: 20px; width: 24px"});
								var div = domConstruct.create("span", {style:"margin-right: 5px; float:left;border-left:5px solid "+accountArr[d]['color'], innerHTML: accountArr[d]['name']});
								div.appendChild(picSpan);
								div.appendChild(divHolder);
								this.checkArray.push(checkBox);
								this.mainList.domNode.appendChild(div);
							}
						}
					}
				}
			}
			
			var textHolder = new ListItem({
				variableHeight: true,
				style: "border:none; margin-top: -12px; margin-bottom: -14px; margin-left: -1px"
			});
			this.mainList.addChild(textHolder);
			
			this.textArea = new TextArea({
				trim: true,
				style: "height:100px;width:99%",
				value: "BL: " + this.blastObj.msg + " - " + this.blastObj.poster
			});

			this.textAreaCountDiv = domConstruct.create("div", {innerHTML: this.textArea.get("value").length + " characters"});

			textHolder.addChild(this.textArea);
			textHolder.domNode.appendChild(this.textAreaCountDiv);

			console.log("this.checkArray is: ", this.checkArray);

			document.body.onkeyup = lang.hitch(this, function(event){
				var flag = 0;
				for(var x = 0; x < this.checkArray.length; x++){
					if((this.checkArray[x].params.leKey == "twitter") && (this.checkArray[x].checked == true)){
						console.log("it's 1");
						flag = 1;
					}
				}

				if(flag == 1){
					this.textAreaCountDiv.innerHTML = this.textArea.get("value").length + "/140 characters";
				}else{
					this.textAreaCountDiv.innerHTML = this.textArea.get("value").length + " characters";
				}

				if((this.textArea.get('value').length > 140) && (flag == 1)){
					this.textAreaCountDiv.style.color = "red";
				}else{
					this.textAreaCountDiv.style.color = "black";
				}
			});

			console.log("this.blastObj.finalUrl in BlastView is: ", this.blastObj.finalUrl);


			if(this.blastObj.finalUrl == undefined || this.blastObj.finalUrl == null){
				var fileHolder = new ListItem({
					variableHeight: true,
					"class": "feedPicContentItemClass"
				});
				var div = domConstruct.create("div", {style: "margin: 10px 10px 10px 10px", innerHTML: 'Sorry, there was a problem retrieving the photo.'});
				fileHolder.domNode.appendChild(div);
				this.mainList.addChild(fileHolder);
			}else{
				if(this.blastObj.finalUrl != ""){
					var fileHolder = new ListItem({
						variableHeight: true,
						"class": "feedPicContentItemClass"
					});
					var div = domConstruct.create("div", {style: "margin: 10px 10px 10px 10px", innerHTML: '<img src="'+this.blastObj.finalUrl+'"style="max-width:90%;max-height:90%;"></img>'});
					fileHolder.domNode.appendChild(div);
					this.mainList.addChild(fileHolder);
				}
			}

			this.submitButton = new Button({
				label: "Blast",
				style: "margin-left: 0px;margin-top:20px",
				onClick: lang.hitch(this, function(){
					document.body.onkeyup = ""; 
					var msg = this.textArea.get("value");
					
					var tokenArr = {};
					for(x=0; x<this.checkArray.length; x++){
						if(this.checkArray[x].checked == true){
							if(tokenArr[this.checkArray[x]['leKey']]){
								tokenArr[this.checkArray[x]['leKey']].push(this.checkArray[x]['leToken']);
							}else{
								tokenArr[this.checkArray[x]['leKey']] = [];
								tokenArr[this.checkArray[x]['leKey']].push(this.checkArray[x]['leToken']);
							}
						}
					}

					if(this.blastObj.url == "" || this.blastObj.finalUrl != ""){
						this.blastObj.imgName = "";
					}
						
					console.log("tokenArr is: ", tokenArr);
					
					this.sendPostFile(this.blastObj.imgName, tokenArr, msg).then(lang.hitch(this, function(obj){
						console.log("obj is: ", obj);

						var returnStuff = obj['returnArray'];

						this.failureFlag = "false";

						console.log("this.failureFlag first is: ", this.failureFlag);

						for(var key in returnStuff){
							for(var x = 0; x < returnStuff[key].length; x++){
								if(returnStuff[key][x]['failure']){
									this.failureFlag = "true";
								}
							}								
						}

						console.log("this.failureFlag second is: ", this.failureFlag);

						if(this.failureFlag == "false"){
							window.location = "#/mainFeed";
						}

						var responseListItem = new ListItem({
							variableHeight: true,
							style: "border:none"
						});

						var div = domConstruct.create("div", {});

						this.errorDialog = new Dialog({
							title: "Error",
							"class": "errorDijitDialog",
							style: "top: 105px !important; width: 520px !important; padding: 10px !important; background-color: #FFE6E6",
							draggable: false
						});

						this.errorHolderDiv = domConstruct.create("div", {style: "background-color: #FFE6E6"});

						for(var key in returnStuff){
							for(var x = 0; x < returnStuff[key].length; x++){
								if(returnStuff[key][x]['failure']){
									var errorDiv = domConstruct.create("div", {innerHTML: returnStuff[key][x]['msg'] + "<br/><br/>", style: "background-color: #FFE6E6"});

									this.errorHolderDiv.appendChild(errorDiv);
								}
							}
						}

						for(var g = 0; g < this.errorDialog.domNode.children.length; g++){
							if(domClass.contains(this.errorDialog.domNode.children[g], "dijitDialogPaneContent")){
								domStyle.set(this.errorDialog.domNode.children[g], "padding", "0px");
							}
						}

						if(errorDiv){
							this.errorDialog.set("content", this.errorHolderDiv);
							this.errorDialog.show();
						}
					}));
				})
			});
			this.mainList.addChild(this.submitButton);
		},
		
		handleResponse: function(obj){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
			this.buildMainList();
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: "/"+this.mod, title: "Blast this post to your friends"} );
			
			console.log("my Obj is: ", this.blastObj);
			if(!this.blastObj){
				window.location = "#/mainFeed";
			}else{
				if(this.mainList){
					this.mainList.destroyRecursive();
					this.mainList = null;
				}
				this.getServiceCreds().then(lang.hitch(this, function(obj){
					console.log(obj);
					this.authObj = obj;
					this.buildMainList();
				}));
			}
		},

		deactivate: function(){
			document.body.onkeyup = "";

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
		}
	});
});