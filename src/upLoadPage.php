<?php

	if(isset($_GET['message'])){
		$message = $_GET['message'];
	}else{
		$message = "";
	}

	if(isset($_GET['token'])){
		$tokenArr = explode(",", $_GET['token']);
	}else{
		$token = array();
	}

	$redirect = $_SERVER['HTTP_HOST'];
?>
<!DOCTYPE html>
<html>
<head>
	<title>Upload a photo and message</title>	
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
			"dojo/_base/json"
			
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
			json					
		){
		
			buildLoginView = function(){
				var leftPane = new Container({
					style: "text-align: center"
				});
				domWindow.body().appendChild(leftPane.domNode);

				var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+

				console.log("isFirefox is: ", isFirefox);

				this.fUploader = document.createElement("input");
				this.fUploader.setAttribute("type", "file");
				this.fUploader.setAttribute("accept", "image/*");
				this.fUploader.setAttribute("name", "file[]");
				this.fUploader.style.class = "roundedBorder5pxClass";

				if(isFirefox === true){
					this.fUploader.style.marginLeft = "5px";
				}else{
					this.fUploader.style.marginLeft = "-5px";
				}

				leftPane.domNode.appendChild(this.fUploader);

				this.response = '';
				this.responseDiv = '';

				var myButton = new Button({
					label: "Upload",
					style: "float: left; margin-top: 10px; margin-left: 7px",
					onClick: lang.hitch(this, function(){
						if(this.responseDiv){
							this.responseDiv.innerHTML = '';
							this.responseDiv = null;

						}
						console.log("THE FILE IS: ", this.fUploader.files[0]);

						var fd = new FormData();
						fd.append("fUploader", fUploader.files[0]);
						var xhr = new XMLHttpRequest();

						xhr.onreadystatechange = lang.hitch(this, function(){
						    if(xhr.readyState == 4){
						        this.response = xhr.responseText;

						        this.response = JSON.parse(this.response);

						        if(this.response){
						        	if(this.response['success']){
						        		this.responseDiv = domConstruct.create("div", {innerHTML: this.response['success'], style: "margin-top: 5px"});

						        		leftPane.domNode.appendChild(this.responseDiv);
						        	}else if(this.response['error']){
						        		this.responseDiv = domConstruct.create("div", {innerHTML: this.response['error'], style: "margin-top: 5px"});

						        		leftPane.domNode.appendChild(this.responseDiv);
						        	}
						        }
						    }
						});

						xhr.open("POST", "app/post/UploadFiles.php");
						xhr.send(fd);
					})
				});

				leftPane.domNode.appendChild(myButton.domNode);
			}
			
			buildLoginView();
		})
	</script>
</body>
</html>