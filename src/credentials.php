<?php

	/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the main app credential page
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

	require_once('vendor/autoload.php');
	
	$redirect = $_SERVER['HTTP_HOST'] . "/oAuth/";	
	
	function getData(){
		try{
			$credObj = file_get_contents("serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"login" => ""
			);
			file_put_contents("serviceCreds.json", json_encode($credObj));
		}
		return $credObj;
	}
	
	$var = getData();
	$fCount = (string)count($var['facebook']);
	$lCount = (string)count($var['twitter']);
	$iCount = (string)count($var['linkedin']);
	$tCount = (string)count($var['instagram']);
	
	if(isset($_GET['error'])){
		$errorCode = $_GET['error'];
		$errorService = $_GET['service'];
	}else{
		$errorCode = "";
	}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Please Authenticate</title>	
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache">
	
	<link rel="stylesheet" href="dojox/widget/ColorPicker/ColorPicker.css" />
	<link rel="stylesheet" href="app/resources/css/app.css">
	 <script data-dojo-config="async: 1, tlmSiblingOfDojo: 0, isDebug: 1, cacheBust: 1" src="dojo/dojo.js"></script>
	
</head>
<body class="bodyCSS">
   
	<script type="text/javascript">
		require([
			'dojo/_base/declare',
			"dojo/_base/window",
			'dojo/dom-construct',
			'dojo/topic',
			'dojo/has',
			'dojo/dom-style',
			'dojo/_base/kernel',
			"dojo/_base/lang",
			"dojo/_base/json",
			"dojo/DeferredList",
			
			"dojox/mobile/RoundRectList",
			"dojox/mobile/TextBox",
			"dojox/mobile/ListItem",
			"dojox/mobile/Button",
			"dojox/mobile/Container",
			"dojox/mobile/GridLayout",
			"dojox/mobile/Pane",
			"dojox/widget/ColorPicker",
			
			"dijit/Dialog",
			
			"dojo/_base/xhr"
		], function(
			declare, 
			domWindow,
			domConstruct, 
			topic, 
			has,
			domStyle,
			kernel, 
			lang, 
			json,
			DeferredList, 
			
			RoundRectList, 
			TextBox, 
			ListItem, 
			Button, 
			Container, 
			Grid, 
			Pane, 
			ColorPicker, 
			
			Dialog,
			
			xhr		
		){
			buildCredView = function(){		
				if('<?php echo $fCount; ?>' == 0 &&
					'<?php echo $iCount; ?>' == 0 &&
					'<?php echo $lCount; ?>' == 0 &&
					'<?php echo $tCount; ?>' == 0
				){
					var leftPane = new Container({
						style: "text-align: center"
					});
					domWindow.body().appendChild(leftPane.domNode);
					
					if(has('iphone') != undefined){
						domWindow.body().style.overflow = "scroll";
					}

					if(has('android' < 4)){
						domWindow.body().style.overflow = "scroll";
					}

					document.body.style.backgroundColor = "#d0d3d4";
					
					var item = new ListItem({
						label: "Welcome to",
						style: "background-color:inherit;border:none;height:35px;font-size;font-family:arial;font-size:20px; text-align: center"
					});
					leftPane.addChild(item);
					/*var item = new ListItem({
						label: "Please enter social media app accounts",
						style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
					});*/

					var acilosLoginDiv = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/acilosLoginLogo.png>", style: "width: 304px; margin-left: auto; margin-right: auto; margin-top: auto; margin-bottom: auto"});
					leftPane.domNode.appendChild(acilosLoginDiv);

					var item1 = domConstruct.create("div", {innerHTML: "To set up Acilos for the first time you will need to go to each social media website and set up an app as if you were a developer.", style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; text-align: center; height: auto"});
					var item2 = domConstruct.create("div", {innerHTML: "Please enter the app keys and secrets obtained by following the walkthrough below.", style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; text-align: center; height: auto"});
					var item3 = domConstruct.create("div", {innerHTML: 'You can enter one or more accounts now, and more later from the settings tab in the app.', style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; text-align: center; height: auto"});
					var item4 = domConstruct.create("div", {innerHTML: '<span><a href="http://www.acilos.com/apphelp" target="_blank">App creation walkthrough</a></span>'});
					leftPane.domNode.appendChild(item1);
					leftPane.domNode.appendChild(item3);
					leftPane.domNode.appendChild(item2);
					leftPane.domNode.appendChild(item4);
					var errorItem = new ListItem({
						style: "border:none;height:auto;font-size;font-family:arial;font-size:20px;background-color:inherit"
					});
					leftPane.addChild(errorItem);
					
					buildPage(leftPane, errorItem);
				}else{
					window.location = "login.php";
				}
			},
			
			buildPage = function(leftPane, errorItem){
				domWindow.body().style.overflow = "scroll";
				
				//--------------------------------------------------------------------------------
				var twitterKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var twitterSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var twitterRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "twitterAccess.php",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				//var twitterRedirect = domConstruct.create("div", {style: "font-family:arial;text-align: center", innerHTML: "http://" + '<?php echo $redirect; ?>' + "twitterAccess.php"});
				var twitterLogoDiv = domConstruct.create("div", {style: "margin-top:25px;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/twitterLogin.png>"});
				var textBoxDiv = domConstruct.create("div", {});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(twitterKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(twitterSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(twitterRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				var siteLink = domConstruct.create("div", {innerHTML: '<span><a href="https://dev.twitter.com/" target="_blank">Open Twitter\'s developer site</a></span>'});
				var spacer = domConstruct.create("div", {style: "visibility:hidden", innerHTML: 'acilos'});
				
				leftPane.domNode.appendChild(twitterLogoDiv);
				leftPane.domNode.appendChild(textBoxDiv);
				leftPane.domNode.appendChild(siteLink);
				leftPane.domNode.appendChild(spacer);
				
				//--------------------------------------------------------------------------------				
				var faceKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var faceSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var faceRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "facebookAccess.php",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				//var faceRedirect = domConstruct.create("div", {style: "font-family:arial;text-align: center", innerHTML: "http://" + '<?php echo $redirect; ?>' + "facebookAccess.php"});
				var faceLogoDiv = domConstruct.create("span", {style: "margin-top:25px;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/facebookLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(faceKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(faceSecret.domNode);
				textBoxDiv.appendChild(holderDiv);

				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(faceRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);

				var siteLink = domConstruct.create("div", {innerHTML: '<span><a href="https://developers.facebook.com/" target="_blank">Open Facebook\'s developer site</a></span>'});
				var spacer = domConstruct.create("div", {style: "visibility:hidden", innerHTML: 'acilos'});
				
				leftPane.domNode.appendChild(faceLogoDiv);
				leftPane.domNode.appendChild(textBoxDiv);
				leftPane.domNode.appendChild(siteLink);
				leftPane.domNode.appendChild(spacer);
				
				//--------------------------------------------------------------------------------
				var instaKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var instaSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var instaRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "instaAccess.php",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				//var instaRedirect = domConstruct.create("div", {style: "font-family:arial;text-align: center", innerHTML: "http://" + '<?php echo $redirect; ?>' + "instaAccess.php"});
				var instaLogoDiv = domConstruct.create("span", {style: "margin-top:25px;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/instagramLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(instaKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(instaSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
			
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(instaRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				var siteLink = domConstruct.create("div", {innerHTML: '<span><a href="http://instagram.com/developer/" target="_blank">Open Instagram\'s developer site</a></span>'});
				var spacer = domConstruct.create("div", {style: "visibility:hidden", innerHTML: 'acilos'});
				
				leftPane.domNode.appendChild(instaLogoDiv);
				leftPane.domNode.appendChild(textBoxDiv);
				leftPane.domNode.appendChild(siteLink);
				leftPane.domNode.appendChild(spacer);
				
				//--------------------------------------------------------------------------------
				var linkedKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var linkedSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				var linkedRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "linkedinAccess.php",
					"class": "credentialTextBox, roundTextBoxClass",
					style: "width:250px"
				});
				//var linkedRedirect = domConstruct.create("div", {style: "font-family:arial;text-align: center", innerHTML: "http://" + '<?php echo $redirect; ?>' + "linkedinAccess.php"});
				var linkedLogoDiv = domConstruct.create("span", {style: "margin-top:25px;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/linkedinLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(linkedKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(linkedSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(linkedRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				var siteLink = domConstruct.create("div", {innerHTML: '<span><a href="http://developer.linkedin.com/" target="_blank">Open Linkedin\'s developer site</a></span>'});
				var spacer = domConstruct.create("div", {style: "visibility:hidden", innerHTML: 'acilos'});
				
				leftPane.domNode.appendChild(linkedLogoDiv);
				leftPane.domNode.appendChild(textBoxDiv);
				leftPane.domNode.appendChild(siteLink);
				leftPane.domNode.appendChild(spacer);
				
				var save = new Button({
					label: "Save",
					style: "width: 60px; margin-left: auto; margin-right: auto",
					onClick: lang.hitch(null, function(){
						errorItem.set("label", "");
						if(	(faceKey.get("value") != "" && faceSecret.get("value") == "" ||
							faceKey.get("value") == "" && faceSecret.get("value") != "") ||
							(linkedKey.get("value") != "" && linkedSecret.get("value") == "" ||
							linkedKey.get("value") == "" && linkedSecret.get("value") != "") ||
							(twitterKey.get("value") != "" && twitterSecret.get("value") == "" ||
							twitterKey.get("value") == "" && twitterSecret.get("value") != "") ||
							(instaKey.get("value") != "" && instaSecret.get("value") == "" ||
							instaKey.get("value") == "" && instaSecret.get("value") != "")
						){
							errorItem.set("label", "Please be sure to enter both a key and secret for the apps you choose");
						}else{
							var obj = {};
							if(faceKey.get("value") != "" && faceSecret.get("value") != ""){
								obj['facebook'] = {};
								obj['facebook']['key'] = faceKey.get("value");
								obj['facebook']['secret'] = faceSecret.get("value");
								obj['facebook']['redir'] = faceRedirect.get("value");
								obj['facebook']['color'] = "#0066FF";							
								obj['facebook']['login'] = "first";							
							}
							
							if(linkedKey.get("value") != "" && linkedSecret.get("value") != ""){
								obj['linkedin'] = {};
								obj['linkedin']['key'] = linkedKey.get("value");
								obj['linkedin']['secret'] = linkedSecret.get("value");
								obj['linkedin']['redir'] = linkedRedirect.get("value");
								obj['linkedin']['color'] = "#B33DA5";	
								obj['linkedin']['login'] = "first";			
							}
							
							if(twitterKey.get("value") != "" && twitterSecret.get("value") != ""){
								obj['twitter'] = {};
								obj['twitter']['key'] = twitterKey.get("value");
								obj['twitter']['secret'] = twitterSecret.get("value");
								obj['twitter']['redir'] = twitterRedirect.get("value");
								obj['twitter']['color'] = "#E32252";	
								obj['twitter']['login'] = "first";			
							}
							
							if(instaKey.get("value") != "" && instaSecret.get("value") != ""){
								obj['instagram'] = {};
								obj['instagram']['key'] = instaKey.get("value");
								obj['instagram']['secret'] = instaSecret.get("value");
								obj['instagram']['redir'] = instaRedirect.get("value");
								obj['instagram']['color'] = "#F66733";	
								obj['instagram']['login'] = "first";		
							}
							
							saveServiceCreds(obj).then(lang.hitch(null, function(errorItem, obj){
								console.log(obj);
								if(obj['error']){
									errorItem.set("label", obj['error']);
								}else{
									window.location = "login.php?login=first";
								}
							}, errorItem));
						}
					})
				})
				leftPane.addChild(save);
				var spaceItem = new ListItem({
					label: "I make space at the bottom",
					style: "visibility:hidden;border:none"
				})
				leftPane.addChild(spaceItem);
			},
			
			saveServiceCreds = function(obj){
				var params = json.toJson({obj:obj});
				var dfd = xhr.post({
					url: 'rest/v1.0/Database/saveServiceCredsFirstTime',
					handleAs: 'json',
					preventCache: true,
					headers: {
						"Content-Type": "application/json"
					},
					postData: params,
					error: function(error){
						console.log("Error has occurred: " + error);
					}
				})
				return dfd;
			},
			
			buildCredView();
		})
	</script>
</body>
</html>
