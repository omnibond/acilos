<?php	
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
			
			"dojo/_base/xhr",
			"../app/util/xhrManager",
		], function(
			declare, 
			domWindow,
			domConstruct, 
			topic, 
			has,
			domStyle,
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
			ColorPicker, 
			
			Dialog,
			
			xhr,
			xhrManager			
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
					
					var item = new ListItem({
						label: "Welcome to",
						style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; text-align: center"
					});
					leftPane.addChild(item);
					/*var item = new ListItem({
						label: "Please enter social media app accounts",
						style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
					});*/

					var acilosLoginDiv = domConstruct.create("div", {innerHTML: "<img src=app/resources/img/acilosLoginLogo.png>", style: "width: 304px; margin-left: auto; margin-right: auto; margin-top: auto; margin-bottom: auto"});
					leftPane.domNode.appendChild(acilosLoginDiv);

					var item = domConstruct.create("div", {innerHTML: "Please enter social media app accounts", style: "border:none;height:35px;font-size;font-family:arial;font-size:20px; text-align: center; height: auto"});
					leftPane.domNode.appendChild(item);
					var errorItem = new ListItem({
						label: "",
						style: "border:none;height:35px;font-size;font-family:arial;font-size:20px"
					});
					leftPane.addChild(errorItem);
					
					buildPage(leftPane, errorItem);
				}else{
					window.location = "login.php";
				}
			},
			
			buildPage = function(leftPane, errorItem){
				domWindow.body().style.overflow = "scroll";

				var list = new RoundRectList({
					style: "border:none"
				});
				
				//--------------------------------------------------------------------------------
				var item = new ListItem({
					"class": "credentialListItem"
				});
				var twitterKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox"
				});
				var twitterSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox"
				});
				var twitterRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "twitterAccess.php",
					disabled: true,
					"class": "credentialTextBox"
				});
				var twitterLogoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/twitterLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {style:"float:left"});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(twitterKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(twitterSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(twitterRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				item.domNode.appendChild(twitterLogoDiv);
				item.domNode.appendChild(textBoxDiv);

				var containerDiv = domConstruct.create("div", {});

				containerDiv.appendChild(item.domNode);
				
				list.domNode.appendChild(containerDiv);
				
				//--------------------------------------------------------------------------------
				var item = new ListItem({
					"class": "credentialListItem"
				});				
				var faceKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox"
				});
				var faceSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox"
				});
				var faceRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "facebookAccess.php",
					disabled: true,
					"class": "credentialTextBox"
				});
				var faceLogoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/facebookLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {style:"float:left"});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(faceKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(faceSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(faceRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				item.domNode.appendChild(faceLogoDiv);
				item.domNode.appendChild(textBoxDiv);
				
				var containerDiv = domConstruct.create("div", {});

				containerDiv.appendChild(item.domNode);
				
				list.domNode.appendChild(containerDiv);
				
				//--------------------------------------------------------------------------------
				var item = new ListItem({
					"class": "credentialListItem"
				});
				var instaKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox"
				});
				var instaSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox"
				});
				var instaRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "instaAccess.php",
					disabled: true,
					"class": "credentialTextBox"
				});
				var instaLogoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/instagramLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {style:"float:left"});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(instaKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(instaSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(instaRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				item.domNode.appendChild(instaLogoDiv);
				item.domNode.appendChild(textBoxDiv);
				
				var containerDiv = domConstruct.create("div", {});

				containerDiv.appendChild(item.domNode);
				
				list.domNode.appendChild(containerDiv);
				
				//--------------------------------------------------------------------------------
				var item = new ListItem({
					"class": "credentialListItem"
				});
				var linkedKey = new TextBox({
					placeHolder: "App Id/Key",
					"class": "credentialTextBox"
				});
				var linkedSecret = new TextBox({
					placeHolder: "App Secret",
					"class": "credentialTextBox"
				});
				var linkedRedirect = new TextBox({
					value: "http://" + '<?php echo $redirect; ?>' + "linkedinAccess.php",
					disabled: true,
					"class": "credentialTextBox"
				});
				var linkedLogoDiv = domConstruct.create("span", {style: "margin-top:25px;float:left;width:100px;height:100px", "class":"loginLogo", innerHTML: "<img src=app/resources/img/linkedinLogin.png>"});
				var textBoxDiv = domConstruct.create("span", {style:"float:left"});
				var holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(linkedKey.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(linkedSecret.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				holderDiv = domConstruct.create("div", {});
				holderDiv.appendChild(linkedRedirect.domNode);
				textBoxDiv.appendChild(holderDiv);
				
				item.domNode.appendChild(linkedLogoDiv);
				item.domNode.appendChild(textBoxDiv);
				
				var containerDiv = domConstruct.create("div", {});

				containerDiv.appendChild(item.domNode);
				
				list.domNode.appendChild(containerDiv);

				leftPane.addChild(list);
				
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
			},
			
			saveServiceCreds = function(obj){
				var params = {obj:obj};
				return xhrManager.send('POST', 'rest/v1.0/Database/saveServiceCredsFirstTime', params);
			},
			
			buildCredView();
		})
	</script>
</body>
</html>