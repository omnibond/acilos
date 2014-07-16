/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView of the post module
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
		"dojox/form/uploader/_IFrame",
		
		"app/post/FileList",
		"dijit/Dialog",

		'dojo/dom-construct',
		'dojo/topic',
		'dojo/has'
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
	iFramePlugin,
	
	FileList,
	Dialog,
	
	domConstruct, 
	topic,
	has
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
			

			console.log("THIS.AUTHOBJ IS: ", this.authObj);
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
								}if(key == "facebook"){
									var checkBox = new CheckBox({
										leToken: accountArr[d]['accessToken']+":"+this.authObj[key][0]['key']+":"+accountArr[d]['user'],
										leKey: key,
										style:"width:20px;height:20px"
									});
									//var picUrl = "https://graph.facebook.com/"+accountArr[d].image+"/picture";
									var serviceUrl = "app/resources/img/Facebook_logo.png";
								}if(key == "linkedin"){
									var checkBox = new CheckBox({
										leToken: accountArr[d]['accessToken'],
										leKey: key,
										style:"width:20px;height:20px"
									});
									var serviceUrl = "app/resources/img/LinkedIn_logo.png";
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
				style: "height:100px;width:99%"
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

			var fUploader = domConstruct.create("div", {});

			var fileHolder = domConstruct.create("div", {style: "border:none; margin-left: 7px; margin-top: 14px; height: auto"});
			this.mainList.domNode.appendChild(fileHolder);
			
			this.getDomain().then(lang.hitch(this, function(obj){
				this.domain = obj.domain;
				console.log("http://"+this.domain+"/app/post/UploadFiles.php");

				var iframe = document.createElement("IFRAME");
				iframe.setAttribute("src", "http://"+this.domain+"/upLoadPage.php");
				iframe.setAttribute("name", "iframe");
				iframe.style.width = 250+"px";
				iframe.style.height = 110+"px";
				fileHolder.appendChild(iframe);

				this.iframeElements = '';

				iframe.onload = lang.hitch(this, function(){
					this.iframeElements = iframe.contentWindow.document.body.getElementsByTagName("*");

					console.log("THE IFRAME ELEMENTS ARE: ", this.iframeElements);

					var postNow = new RadioButton({
						checked: true,
						name: "post",
						onClick: lang.hitch(this, function(){
							if(this.atDate){
								this.atDate.destroyRecursive();
								this.atDate = null;
							}
							if(this.nowList){
								this.nowList.destroyRecursive();
								this.nowList = null;
							}
							if(this.laterList){
								this.laterList.destroyRecursive();
								this.laterList = null;
							}
							if(this.calendarDialog){
								this.calendarDialog.destroy();
								this.calendarDialog = null;
							}
							this.nowList = new EdgeToEdgeList({style: "margin-top: 3px; margin-left: 8px"})

							this.submitButton = new Button({
								label: "Post",
								style: "margin-left: 0px",
								onClick: lang.hitch(this, function(){
									if(this.errorDialog){
										this.errorDialog.destroyRecursive();
										this.errorDialog = null;
									}

									document.body.onkeyup = ""; 
									var msg = this.textArea.get("value");
									var file = '';
									
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
										
									console.log("tokenArr is: ", tokenArr);

									this.fileToUpload = this.iframeElements[2].files[0].name;

									console.log("the file to upload isssssssssssssss: ", this.iframeElements[2].files[0]);

									if(this.iframeElements[2].files[0]){
										if(this.iframeElements[2].files[0] != '' && this.iframeElements[2].files[0] != 'undefined' && this.iframeElements[2].files[0] != null){
											fileType = this.iframeElements[2].files[0].type;
										}else{
											fileType = '?';
										}
										console.log("this.fileToUpload: ", this.fileToUpload);
									}

									this.sendPostFile(this.fileToUpload, fileType, tokenArr, msg).then(lang.hitch(this, function(obj){
										console.log("obj is: ", obj);

										this.fileToUpload = "";

										var returnStuff = obj['returnArray'];

										this.failureFlag = "false";

										for(var key in returnStuff){
											for(var x = 0; x < returnStuff[key].length; x++){
												if(returnStuff[key][x]['failure']){
													this.failureFlag = "true";
												}
											}								
										}

										if(this.failureFlag == "false"){
											if(this.mainList){
												this.fileToUpload = "";
												fUploader.destroyRecursive();
												fUploader = null;
												this.mainList.destroyRecursive();
												this.mainList = null;
											}
											this.getServiceCreds().then(lang.hitch(this, function(obj){
												console.log(obj);
												this.authObj = obj;
												this.buildMainList();
											}));
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
								}, fUploader)
							});
							this.nowList.addChild(this.submitButton);
							this.mainList.addChild(this.nowList);
						})
					});

					postNow.onClick();

					var postLater = new RadioButton({
						checked: false,
						name: "post",
						"style": "margin-left: 6px",
						onClick: lang.hitch(this, function(){
							if(this.laterList){
								this.laterList.destroyRecursive();
								this.laterList = null;
							}
							if(this.nowList){
								this.nowList.destroyRecursive();
								this.nowList = null;
							}
							this.laterList = new EdgeToEdgeList({style: "margin-top: 3px; margin-left: 8px"})

							this.atCommandButton = new Button({
								label: "Post",
								style: "margin-left: 0px",
								onClick: lang.hitch(this, function(){
									if(this.errorDialog){
										this.errorDialog.destroyRecursive();
										this.errorDialog = null;
									}

									if(chooseDateTextBox.get("value") != ""){
										var date = this.formatDateAtCommand(chooseDateTextBox.get("value"));
										console.log("DATE: ", date);

										if(atBox.get("value") != "Example: 7:00 pm"){
											var time = atBox.get("value");
											console.log("TIME: ", time);
										}

										var msg = this.textArea.get("value");

										var file = '';
										if(this.iframeElements[2].files[0] != '' && this.iframeElements[2].files[0] != 'undefined' && this.iframeElements[2].files[0] != null){
											var file = this.iframeElements[2].files[0].name;
										}
										
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
										
										console.log(tokenArr);
										
										if(this.iframeElements[2].files[0] != '' && this.iframeElements[2].files[0] != 'undefined' && this.iframeElements[2].files[0] != null){
											fileType = this.iframeElements[2].files[0].type;
										}else{
											fileType = '?';
											file = '?';
										}

										if(msg == ""){
											msg = " ";
										}

										var slashDate = date.split("-");
										slashDate = slashDate[2] + "/" + slashDate[0] + "/" + slashDate[1];

										var postTime = atBox.get("value");
										console.log("postTime is: ", postTime);

										var d = new Date(slashDate + " " + postTime);
										var selectedTime = d.getTime();
										selectedTime = selectedTime/1000;
										console.log("selected time is: ", selectedTime);

										this.runAtCommand(selectedTime, file, fileType, tokenArr, msg).then(lang.hitch(this, this.handleResponse));
									}else{
										console.log("You must select a date first");
									}
								})
							});

							var chooseDateTextBox = new TextBox({
								style: "height: 24px; vertical-align: top",
								placeHolder: "mm/dd/yyyy"
							});

							chooseDateTextBox.on("click", lang.hitch(this, function(){
								if(this.atDate){
									var formatAtDate = this.formatDate(this.atDate.get("value"));
									chooseDateTextBox.set("value", formatAtDate);
									this.atDate.destroyRecursive();
									this.atDate = null;
									this.calendarDialog.destroy();
									this.calendarDialog = null;
								}

								if(!this.atDate){
									this.atDate = new Calendar({

									});

									this.calendarDialog = new Dialog({
										//title: "Select a date",
										"class": "calendarDialog",
										draggable: false
									});

									this.calendarDialog.set("content", this.atDate);
									this.calendarDialog.show();

									this.atDate.startup();

									this.atDate.dateRowsNode.onclick = lang.hitch(this, function(){
										console.log("atDate's value is: ", this.atDate.get("value"));

										var formatStartDate = this.formatDate(this.atDate.get("value"));

										chooseDateTextBox.set("value", formatStartDate);

										this.atDate.destroyRecursive();
										this.atDate = null;
										this.calendarDialog.destroy();
										this.calendarDialog = null;
									});
								}
							}));

							var atBox = new TextBox({
								style: "height: 24px; vertical-align: top",
								placeHolder: "Example: 7:00 pm"
							});
							this.laterList.addChild(this.atCommandButton);
							this.laterList.addChild(chooseDateTextBox);
							this.laterList.addChild(atBox);
							this.mainList.addChild(this.laterList);
						})
					});
					
					var postNowLabel = domConstruct.create("span", {innerHTML: "Post Now", "class": "radioButtonLabel"});
					var postLaterLabel = domConstruct.create("span", {innerHTML: "Post Later", "class": "radioButtonLabel"});

					postNowLabel.onclick = lang.hitch(this, function(){
						if(postNow.get("checked") == false){
							postNow.set("checked", true);
						}
						postNow.onClick();
					});

					postLaterLabel.onclick = lang.hitch(this, function(){
						if(postLater.get("checked") == false){
							postLater.set("checked", true);
						}
						postLater.onClick();
					});

					var myListItem = new ListItem({
						variableHeight: true,
						style: "border:none; padding: 0; margin-left: 2px; margin-bottom: -2px"
					});

					myListItem.addChild(postNow);
					myListItem.domNode.appendChild(postNowLabel);
					myListItem.addChild(postLater);
					myListItem.domNode.appendChild(postLaterLabel);
					
					this.mainList.addChild(myListItem);
					dojo.place(myListItem.domNode, this.nowList.domNode, "before");
				});
			}));
		},

		formatDate: function(date){
			var formatDate = new Date(date);

			formatDate = (formatDate.getMonth() + 1) + "/" + formatDate.getDate() + "/" + formatDate.getFullYear();

			return formatDate;
		},

		formatDateAtCommand: function(date){
			var formatDateAtCommand = new Date(date);

			formatDateAtCommand = (formatDateAtCommand.getMonth()+1) + "-" + formatDateAtCommand.getDate() + "-" + formatDateAtCommand.getFullYear();

			return formatDateAtCommand;
		},
		
		handleResponse: function(obj){
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
			this.buildMainList();
		},
		
		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: "/", title: "Post, Tweet, Blog"} );
			
			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}
			this.getServiceCreds().then(lang.hitch(this, function(obj){
				console.log(obj);
				this.authObj = obj;
				this.buildMainList();
			}));
		},

		deactivate: function(){
			document.body.onkeyup = "";

			if(this.errorDialog){
				this.errorDialog.destroyRecursive();
				this.errorDialog = null;
			}

			if(this.mainList){
				this.mainList.destroyRecursive();
				this.mainList = null;
			}

			if(this.atDate){
				this.atDate.destroyRecursive();
				this.atDate = null;
			}

			if(this.calendarDialog){
				this.calendarDialog.destroy();
				this.calendarDialog = null;
			}
		}
	});
});