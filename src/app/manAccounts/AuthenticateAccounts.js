define(['dojo/_base/declare',
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		'dojo/_base/kernel',
		"dojo/_base/lang",
		"dojo/DeferredList",
		
		"dojox/mobile/RoundRectList",
		"dojox/mobile/EdgeToEdgeList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
		"dojox/mobile/RadioButton",
		
		'app/util/xhrManager'
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		topic, 
		kernel, 
		lang, 
		DeferredList, 
		
		RoundRectList, 
		EdgeToEdgeList,
		ListItem, 
		Button, 
		RadioButton, 
		
		xhrManager
) {
	return declare([ModuleScrollableView], {						
		
		buildView: function(){								
			this.obj = kernel.global.notifications.credObj;
			
			this.mainList = new RoundRectList({
				style: "border:none; height: auto"
			})
			
			var infoList = new RoundRectList({
				style: "border:none;margin-bottom:0px"
			})
			var item = new ListItem({
				label: "Log in to more services to get more content for the @pp! </br> Clicking on a service's icon will allow you to refresh or generate a token.",
				variableHeight: true
			})
			infoList.addChild(item);
			this.mainList.addChild(infoList);
			
			console.log(this.authCreds);	
			for(var key in this.authCreds){
				this.buttonsNitems(key);
			}
			
			var item = new ListItem({
				style: "margin-bottom: -10px; border: none"
			})
			this.mainList.addChild(item);
			var logButton = new Button({
				label: "Log Out of App",
				style: "margin-left: -6px",
				onClick: lang.hitch(this, function(){
					window.location = "login.php?logout=true";
				})
			});
			item.addChild(logButton);
			var accountReset = new Button({
				label: "Reset Accounts",
				onClick: lang.hitch(this, function(){
					this.accountReset().then(function(){
						window.location = "login.php?logout=true";
					})
				})
			});
			item.addChild(accountReset);
				
			this.addChild(this.mainList);
				
			this.resize();
		},

		capitalizeFirstLetter: function(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		
		buttonsNitems: function(param){	
					
			for(var d = 0; d < this.authCreds[param].length; d++){
				var list = new EdgeToEdgeList({
					style: "height: auto; border-bottom: 1px solid #e7e7de; border-left: 2px solid " + this.authCreds[param][d].color
				})
				if(d == 0){
					var nub = "yes";
				}else{
					var nub = "no";
				}
				var radio = new RadioButton({
					name: param,
					checked: nub,
					style: "position:absolute;margin-left:30%;width:20px;height:20px",
					onChange: lang.hitch(this, function(param, d){
						this.authCreds[param][d].param = param;
						this.setMainLogin(this.authCreds[param][d]);
					}, param, d)
				});
				var radioLabel = domConstruct.create("div", {style:"position:absolute;margin-left:34%; margin-top: 4px", innerHTML:"Main " + this.capitalizeFirstLetter(param) + " login"});
				if(this.authCreds[param][d]['status'] !== "null"){
					item = new ListItem({
						style: "border:none; height: 70px",
						variableHeight: true
					})				
					if(param === "facebook"){
						if(this.authCreds[param][d]['status'] === "unauthorized"){
							statusItem = new ListItem({
								label: "This account has not been authenticated yet",
								style: "border: none;margin-left:5px;margin-bottom: 5px; overflow: visible; margin-top: 5px",
								variableHeight: true
							})
							var logDiv = domConstruct.create("div", {style: "float:left"});
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px; display: block",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var faceDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/facebookLoginHalfSize.png>"});
							refresh.domNode.appendChild(faceDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://facebook.com/";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);
							item.domNode.appendChild(logDiv);
							list.addChild(item);
							list.addChild(statusItem);
						}else{
							item.addChild(radio);
							item.domNode.appendChild(radioLabel);
							if(this.authCreds[param][d]['status'] === "good"){
								var date = new Date(this.authCreds[param][d]['expiresAt'] * 1000);
								var str = "Token Expires: " + date;
							}else{
								var str = "Token is expired";
							}
							statusItem = new ListItem({
								label: str,
								style: "border: none;margin-left:5px;margin-bottom: 5px; overflow: visible; margin-top: 5px",
								variableHeight: true
							})
						
							var logDiv = domConstruct.create("div", {style: "float:left"});
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px; display: block",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var faceDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/facebookLoginHalfSize.png>"});
							refresh.domNode.appendChild(faceDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://facebook.com/";
								}, param)
							});

							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);
							var userDiv = domConstruct.create("div", {style: "margin-left:40px;float:left"});
							var pictureDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML:  '<img src="https://graph.facebook.com/'+this.authCreds[param][d]['image']+'/picture" width="50px" height="50px" />'}); 
							var nameDiv = domConstruct.create("div", {style: "margin-top:20px", innerHTML: this.authCreds[param][d].name});
							userDiv.appendChild(pictureDiv);
							userDiv.appendChild(nameDiv);
							
							item.domNode.appendChild(logDiv);
							item.domNode.appendChild(userDiv);
							
							list.addChild(item);
							list.addChild(statusItem);	
						}
					}
					if(param === "twitter"){
						if(this.authCreds[param][d]['status'] === "unauthorized"){
							statusItem = new ListItem({
								label: "This account has not been authenticated yet",
								style: "border: none;margin-left:5px;margin-bottom: 5px; overflow: visible; margin-top: 5px",
								variableHeight: true
							})
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px; display: block",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var twitDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/twitterLoginHalfSize.png>"});
							
							var logDiv = domConstruct.create("div", {style: "float:left"});
							refresh.domNode.appendChild(twitDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://twitter.com";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);							
							item.domNode.appendChild(logDiv);							
							list.addChild(item);
							list.addChild(statusItem);
						}else{
							item.addChild(radio);
							item.domNode.appendChild(radioLabel);
							if(this.authCreds[param][d]['status'] === "good"){
								var str = " and expires when revoked";
							}else{
								var str = " please refresh";
							}
							statusItem = new ListItem({
								label: "Token is: " + this.authCreds[param][d]['status'] + str,
								style: "border: none;margin-left:5px;margin-bottom: 5px; margin-top: 5px",
								variableHeight: true
							})
							
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px; display: block",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var twitDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/twitterLoginHalfSize.png>"});
							
							var logDiv = domConstruct.create("div", {style: "float:left"});
							refresh.domNode.appendChild(twitDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://twitter.com";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);
							var userDiv = domConstruct.create("div", {style: "margin-left:40px;float:left"});
							var pictureDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML:  '<img src="'+this.authCreds[param][d].image+'" width="50px" height="50px">'}); 
							var nameDiv = domConstruct.create("div", {style: "margin-top:20px", innerHTML: this.authCreds[param][d].name});
							userDiv.appendChild(pictureDiv);
							userDiv.appendChild(nameDiv);
							
							item.domNode.appendChild(logDiv);
							item.domNode.appendChild(userDiv);
							
							list.addChild(item);
							list.addChild(statusItem);
						}
					}
					if(param === "instagram"){
						if(this.authCreds[param][d]['status'] === "unauthorized"){
							statusItem = new ListItem({
								label: "This account has not been authenticated yet",
								style: "border: none;margin-left:5px;margin-bottom: 5px; overflow: visible; margin-top: 5px",
								variableHeight: true
							})
							var logDiv = domConstruct.create("div", {style: "float:left"});
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var instaDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/instagramLoginHalfSize.png>"});
							refresh.domNode.appendChild(instaDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px; display: block",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://instagram.com";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);
							item.domNode.appendChild(logDiv);							
							list.addChild(item);
							list.addChild(statusItem);
						}else{
							item.addChild(radio);
							item.domNode.appendChild(radioLabel);
							if(this.authCreds[param][d]['status'] === "good"){
								var str = " and expires when revoked";
							}else{
								var str = " please refresh";
							}
							statusItem = new ListItem({
								label: "Token is: " + this.authCreds[param][d]['status'] + str,
								style: "border: none;margin-left:5px;margin-bottom: 5px; margin-top: 5px",
								variableHeight: true
							})
							
							var logDiv = domConstruct.create("div", {style: "float:left"});
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var instaDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/instagramLoginHalfSize.png>"});
							refresh.domNode.appendChild(instaDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px; display: block",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://instagram.com";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);
							var userDiv = domConstruct.create("div", {style: "margin-left:40px;float:left"});
							var pictureDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML:  '<img src="'+this.authCreds[param][d].image+'" width="50px" height="50px" />'}); 
							var nameDiv = domConstruct.create("div", {style: "margin-top:20px", innerHTML: this.authCreds[param][d].name});
							userDiv.appendChild(pictureDiv);
							userDiv.appendChild(nameDiv);
							
							item.domNode.appendChild(logDiv);
							item.domNode.appendChild(userDiv);
							
							list.addChild(item);
							list.addChild(statusItem);
						}
					}
					if(param === "linkedin"){
						if(this.authCreds[param][d]['status'] === "unauthorized"){
							statusItem = new ListItem({
								label: "This account has not been authenticated yet",
								style: "border: none;margin-left:5px;margin-bottom: 5px; overflow: visible; margin-top: 5px",
								variableHeight: true
							})
							var logDiv = domConstruct.create("div", {style: "float:left"});
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px; display: block",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var linkDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/linkedinLoginHalfSize.png>"});
							refresh.domNode.appendChild(linkDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://linkedin.com/";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);							
							item.domNode.appendChild(logDiv);							
							list.addChild(item);
							list.addChild(statusItem);
						}else{
							item.addChild(radio);
							item.domNode.appendChild(radioLabel);
							if(this.authCreds[param][d]['status'] === "bad"){
								statusItem = new ListItem({
									label: "Token is expired",
									style: "border: none;margin-left:5px;margin-bottom: 5px; margin-top: 5px",
									variableHeight: true
								})
							}else{
								var date = new Date(this.authCreds[param][d]['expiresAt'] * 1000);
								statusItem = new ListItem({
									label: "Token Expires: " + date,
									style: "border: none;margin-left:5px;margin-bottom: 5px; margin-top: 5px",
									variableHeight: true
								})
							}
							
							var logDiv = domConstruct.create("div", {style: "float:left"});
							var refresh = new Button({
								style: "width:60px;height:50px;margin-right:10px; display: block",
								onClick: lang.hitch(this, function(param, d){
									window.location = this.authCreds[param][d]["auth"];
								}, param, d)
							});
							var linkDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML: "<img src=app/resources/img/linkedinLoginHalfSize.png>"});
							refresh.domNode.appendChild(linkDiv);
							var logout = new Button({
								label: "Website",
								style: "height:50px;position:absolute; height: 25px; line-height: 25px; margin-top: 5px; margin-left: 0px",
								onClick: lang.hitch(this, function(param){
									var iAuth = window.open();
									iAuth.location = "https://linkedin.com/";
								}, param)
							});
							logDiv.appendChild(refresh.domNode);
							logDiv.appendChild(logout.domNode);
							var userDiv = domConstruct.create("div", {style: "margin-left:40px;float:left"});
							var pictureDiv = domConstruct.create("div", {"class":"accountLogo", innerHTML:  '<img src="'+this.authCreds[param][d].image+'" width="50px" height="50px" />'}); 
							var nameDiv = domConstruct.create("div", {style: "margin-top:20px", innerHTML: this.authCreds[param][d].name});
							userDiv.appendChild(pictureDiv);
							userDiv.appendChild(nameDiv);
							
							item.domNode.appendChild(logDiv);
							item.domNode.appendChild(userDiv);
							
							list.addChild(item);
							list.addChild(statusItem);
						}
					}
				}
				this.mainList.addChild(list);
			}
		},

		activate: function(e){
			topic.publish("/dojo-mama/updateSubNav", {back: '/manAccounts', title: "Manage your accounts"} );
			
			if(this.mainList){
				this.mainList.destroy();
				this.mainList = null;
			}
			
			this.arrayList = [];
			this.arrayList.push(this.getAuthCreds().then(lang.hitch(this, function(obj){
				this.authCreds = obj;
			})));
			var defList = new DeferredList(this.arrayList);
			defList.then(lang.hitch(this, this.buildView));
		}		
	})
});