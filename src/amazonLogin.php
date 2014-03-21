<?php	

	/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the app login page
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
	
	if(isset($_GET['logout']) && $_GET['logout'] == "true"){
		setcookie("facebookCook", $_COOKIE['PHPSESSID'], time()-3600, '/', 'amazonaws.com', false, false);
		setcookie("linkedinCook", $_COOKIE['PHPSESSID'], time()-3600, '/', 'amazonaws.com', false, false);
		setcookie("twitterCook", $_COOKIE['PHPSESSID'], time()-3600, '/', 'amazonaws.com', false, false);
		setcookie("instagramCook", $_COOKIE['PHPSESSID'], time()-3600, '/', 'amazonaws.com', false, false);
		header('Location: /auth.php');
	}
	
	#print_r($_COOKIE);
	$var = getData();
	$fCount = (string)count($var['facebook']);
	$lCount = (string)count($var['twitter']);
	$iCount = (string)count($var['linkedin']);
	$tCount = (string)count($var['instagram']);
	
	if(isset($_GET['facebook']) && $_GET['facebook'] == "true"){
		setcookie("facebookCook", $_COOKIE['PHPSESSID'], time()+ (604800), '/', 'amazonaws.com', false, false);
		if(isset($_GET['login']) && $_GET['login'] !== "second"){
			header('Location: /#/ManAccounts');
		}else{
			$ctx = stream_context_create(array(
			    'http' => array(
				'timeout' => 1
				)
			    )
			);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php", 0, $ctx);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php", 0, $ctx);
				
			header('Location: /#/mainFeed');
		}
	}
	if(isset($_GET['linkedin']) && $_GET['linkedin'] == "true"){
		setcookie("linkedinCook", $_COOKIE['PHPSESSID'], time()+ (604800), '/', 'amazonaws.com', false, false);
		if(isset($_GET['login']) && $_GET['login'] !== "second"){
			header('Location: /#/ManAccounts');
		}else{
			$ctx = stream_context_create(array(
			    'http' => array(
				'timeout' => 1
				)
			    )
			);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php", 0, $ctx);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php", 0, $ctx);
				
			header('Location: /#/mainFeed');
		}
	}
	if(isset($_GET['twitter']) && $_GET['twitter'] == "true"){
		setcookie("twitterCook", $_COOKIE['PHPSESSID'], time()+ (604800), '/', 'amazonaws.com', false, false);
		if(isset($_GET['login']) && $_GET['login'] !== "second"){
			header('Location: /#/ManAccounts');
		}else{
			$ctx = stream_context_create(array(
			    'http' => array(
				'timeout' => 1
				)
			    )
			);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php", 0, $ctx);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php", 0, $ctx);
				
			header('Location: /#/mainFeed');
		}
	}
	if(isset($_GET['instagram']) && $_GET['instagram'] == "true"){
		setcookie("instagramCook", $_COOKIE['PHPSESSID'], time()+ (604800), '/', 'amazonaws.com', false, false);
		if(isset($_GET['login']) && $_GET['login'] !== "second"){
			header('Location: /#/ManAccounts');
		}else{
			$ctx = stream_context_create(array(
			    'http' => array(
				'timeout' => 1
				)
			    )
			);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php", 0, $ctx);
			file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php", 0, $ctx);
				
			header('Location: /#/mainFeed');
		}
	}
	
	if(isset($_GET['error'])){
		$errorCode = $_GET['error'];
		$errorService = $_GET['service'];
	}else{
		$errorCode = "";
	}
	if(isset($_GET['login']) && $_GET['login'] !== "second"){
		$login = "first";
	}else{
		$login = "second";
	}
	if(count($var['facebook']) > 0){
		$fCook = "true";
	}else{
		$fCook = "false";
	}
	if(count($var['linkedin']) > 0){
		$lCook = "true";
	}else{
		$lCook = "false";
	}
	if(count($var['instagram']) > 0){
		$iCook = "true";
	}else{
		$iCook = "false";
	}
	if(count($var['twitter']) > 0){
		$tCook = "true";
	}else{
		$tCook = "false";
	}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Please Login</title>	
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache">
	
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
			'dojo/_base/kernel',
			"dojo/_base/lang",
			"dojo/DeferredList",
			
			"dojox/mobile/RoundRectList",
			"dojox/mobile/TextBox",
			"dojox/mobile/ListItem",
			"dojox/mobile/Button",
			"dojox/mobile/Container",
			"dojox/mobile/GridLayout",
			"dojox/mobile/Pane",
			
			"dojo/_base/xhr",
			"../app/util/xhrManager",
		], function(
			declare, 
			domWindow,
			domConstruct, 
			topic, 
			has,
			kernel, 
			lang, 
			DeferredList, 
			
			RoundRectList, 
			TextBox, 
			ListItem, 
			Button, 
			Container, 
			Grid, 
			Pane, 
			
			xhr,
			xhrManager			
		){
		
			buildLoginView = function(){
				
				if('<?php echo $fCount; ?>' == 0 &&
					'<?php echo $iCount; ?>' == 0 &&
					'<?php echo $lCount; ?>' == 0 &&
					'<?php echo $tCount; ?>' == 0
				){
					window.location = "credentials.php";
				}else{
					xhr.get({
						url: 'serviceCreds.json',
						handleAs: 'json',
						async: false,
						preventCache: true,
						content: { },
						error: function(error){
							console.log("Error has occurred: " + error);
						}
					}).then(lang.hitch(this, function(serviceCreds){
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

						console.log("document.body: ", document.body.style);
						
						var item = new ListItem({
							label: "Welcome to",
							style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; background-color: #d0d3d4"
						});
						leftPane.addChild(item);

						var acilosLoginDiv = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/acilosLoginLogo.png>"});
						leftPane.domNode.appendChild(acilosLoginDiv);

						var item = new ListItem({
							label: "Please Log In To Continue",
							style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; background-color: #d0d3d4"
						});
						leftPane.addChild(item);
						
						if('<?php echo $errorCode; ?>' != ""){
							var list = new RoundRectList({	})
							if('<?php echo $errorCode; ?>' == "1"){
								var item = new ListItem({
									variableHeight: true,
									label: "Failed to authenticate user",
									style: "border:none;height:30px;padding-left:4px"
								});
								var button = new Button({
									label: "Change accounts",
									style: "margin-left:5px;margin-bottom:10px",
									onClick: function(){
										var newWin = window.open();
										newWin.location = "https://"+'<?php echo $errorService; ?>'+".com";
									}
								});
								leftPane.addChild(item);
								leftPane.addChild(button);
							}
							if('<?php echo $errorCode; ?>' == "2"){
								var item = new ListItem({
									label: "Error logging in to " + '<?php echo $errorService; ?>',
									style: "background: #e7e7de"
								});
								leftPane.addChild(item);
							}						
						}

						loginPart(leftPane, serviceCreds);
					}));
				}
			},
			
			loginButtonsNitems = function(param, div, serviceCreds, mainDiv){
				if(param == "facebook"){
					var button = new Button({
						"class": "loginLogoButton",
						onClick: lang.hitch(null, function(){
							window.location = serviceCreds[param][0]["auth"];
						},serviceCreds, param)
					});
					var faceDiv = domConstruct.create("div", {"class":"loginLogo", innerHTML: "<img src=app/resources/img/facebookLogin.png>"});
					button.domNode.appendChild(faceDiv);
					div.appendChild(button.domNode);
				}
				if(param == "twitter"){
					var button = new Button({
						"class": "loginLogoButton",
						onClick: lang.hitch(null, function(){
							window.location = serviceCreds[param][0]["auth"];
						},serviceCreds, param)
					});
					var twitDiv = domConstruct.create("div", {"class":"loginLogo", innerHTML: "<img src=app/resources/img/twitterLogin.png>"});
					button.domNode.appendChild(twitDiv);
					div.appendChild(button.domNode);	
				}
				if(param == "instagram"){
					var button = new Button({
						"class": "loginLogoButton",
						onClick: lang.hitch(null, function(){
							window.location = serviceCreds[param][0]["auth"];
						},serviceCreds, param)
					});
					var instaDiv = domConstruct.create("div", {"class":"loginLogo", innerHTML: "<img src=app/resources/img/instagramLogin.png>"});
					button.domNode.appendChild(instaDiv);
					div.appendChild(button.domNode);
				}
				if(param == "linkedin"){
					var button = new Button({
						"class": "loginLogoButton",
						onClick: lang.hitch(null, function(){
							window.location = serviceCreds[param][0]["auth"];
						},serviceCreds, param)
					});
					var linkDiv = domConstruct.create("div", {"class":"loginLogo", innerHTML: "<img src=app/resources/img/linkedinLogin.png>"});
					button.domNode.appendChild(linkDiv);
					div.appendChild(button.domNode);						
				}
				mainDiv.appendChild(div);
			},
			
			loginPart = function(leftPane, serviceCreds){
				var mainDiv = domConstruct.create("div", {style: "width: 304px; margin-top: auto; margin-left: auto; margin-right: auto; margin-bottom: auto"});
				
				if(	'<?php echo $fCook; ?>' != "true" &&
					'<?php echo $tCook; ?>' != "true" &&
					'<?php echo $lCook; ?>' != "true" &&
					'<?php echo $iCook; ?>' != "true" 
				){
					var item = new ListItem({
						label: "You have not authorized any apps yet",
						style: "border:none"
					});
					leftPane.addChild(item);
				}else{
					if('<?php echo $tCook; ?>' == "true"){
						var div1 = domConstruct.create("span", {});
						loginButtonsNitems("twitter", div1, serviceCreds, mainDiv);
					}
					if('<?php echo $fCook; ?>' == "true"){
						var div2 = domConstruct.create("span", {});
						loginButtonsNitems("facebook", div2, serviceCreds, mainDiv);
					}
					if('<?php echo $lCook; ?>' == "true"){
						var div3 = domConstruct.create("span", {});
						loginButtonsNitems("linkedin", div3, serviceCreds, mainDiv);
					}
					if('<?php echo $iCook; ?>' == "true"){
						var div4 = domConstruct.create("span", {});
						loginButtonsNitems("instagram", div4, serviceCreds, mainDiv);
					}
				}

				leftPane.domNode.appendChild(mainDiv);
			},
			
			buildLoginView();
		})
	</script>
</body>
</html>
