<?php

require_once('../../oAuth/twitteroauth/twitteroauth.php');

//function postFilesAt(){
	/*$fileName = $argv[1];
	$fileType = $argv[2];
	$service = $argv[3];
	$msg = $argv[4];*/

	if(isset($argv[1]) && $argv[1] !== "?"){
		$fileName = $argv[1];
	}else{
		$fileName = "";
	}
	if(isset($argv[2]) && $argv[2] !=="?"){
		$fileType = $argv[2];
	}else{
		$fileType = "";
	}
	if(isset($argv[3]) && $argv[3] !== "?"){
		$service = $argv[3];
	}else{
		$service = "";
	}
	if(isset($argv[4]) && $argv[4] !== "?"){
		$msg = $argv[4];
		$msg = str_replace("+", " ", $msg);
	}else{
		$msg = "";
	}
	if(isset($argv[5]) && $argv[5] !== "?"){
		$server = $argv[5];
	}else{
		$server = "";
	}

	$returnArr = array();
	
	$thing = getcwd();
	$thingArr = explode("/", $thing);
	$thing = '';
	$count = 0;
	for($f = 0; $f < count($thingArr); $f++){
		if($thingArr[$f] == "src"){
			$thing = $thing.$thingArr[$f]."/";
			$count = -1;
		}
		if($count >= 0){
			$thing = $thing.$thingArr[$f]."/";
			$count = $f;
		}
	}
	
	if($service == "facebook"){
		if(isset($argv[6])){
			$access_token = $argv[6];
		}else{
			$access_token = "";
		}
		if(isset($argv[7])){
			$app_id = $argv[7];
		}else{
			$app_id = "";
		}
		if(isset($argv[8])){
			$user_id = $argv[8];
		}else{
			$user_id = "";
		}

		$photoURL = 'https://graph.facebook.com/me/photos?access_token='.$access_token;

		$statusURL = 'https://graph.facebook.com/me/feed';

		if($fileName == ""){
			$url = $statusURL;
		}else{
			$url = $photoURL;
		}

		$ch = curl_init($url);

		$returnArr = array();

		$params = array();

		if(isset($fileName) && $fileName != ""){
			$path = $thing . "app/post/tmpUpload/" . $fileName;
			$params = array(
				"message" => $msg,
				"source" => "@" . $path
			);
		}else{
			$params = array(
				"message" => $msg,
				'access_token' => $access_token
			);
		}

		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);

		//print_r($response);
						
		$res = json_decode($response, true);

		if(isset($res['error'])){
			$returnArr['Facebook'] = array("success" => 'false', "msg" => $res['error']['message']);
		}else{
			$returnArr['Facebook'] = array("success" => 'true', "msg" => $res['id']);
		}
	}

	if($service == "linkedin"){
		if(isset($argv[6])){
			$access_token = $argv[6];
		}else{
			$access_token = "";
		}

		$headerOptions = array(
			"Content-Type: text/xml;charset=utf-8"
		);

		$imageURL = $server . 'app/post/tmpUpload/' . $fileName;
		$title = "Title";
		$shareXML = "<share>
			<comment>Test Comment Linkedin</comment>
			<content>
				<title>".$msg."</title>
				<submitted-url>".$imageURL."</submitted-url>
				<submitted-image-url>".$imageURL."</submitted-image-url>
			</content>
			<visibility>
				<code>anyone</code>
			</visibility>
			</share>";

		$shareUrl = 'https://api.linkedin.com/v1/people/~/shares?oauth2_access_token='.$access_token;

		$wallXML = "<activity>
			<content-type>linkedin-html</content-type>
				<body>
					".$msg."
				</body>
			</activity>";

		$wallUrl = 'https://api.linkedin.com/v1/people/~/person-activities?oauth2_access_token='. $access_token;

		if($fileName == ""){
			$url = $wallUrl;
			$xml = $wallXML;
		}else{
			$url = $shareUrl;
			$xml = $shareXML;
		}

		$ch2 = curl_init($url);
		curl_setopt($ch2, CURLOPT_POST, 1);
		curl_setopt($ch2, CURLOPT_POSTFIELDS, $xml);
		curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch2, CURLOPT_HTTPHEADER, $headerOptions);
		$response = curl_exec($ch2);
		$code = curl_getinfo($ch2, CURLINFO_HTTP_CODE);

		curl_close($ch2);
		
		if(isset($code)){
			if($code == "201"){
				$returnArray['linkedinSuccess'] = "Your LinkedIn message was posted successfully";
			}else{
				$returnArray['linkedinFailure'] = "Your LinkedIn message could not be posted";
			}
		}
	}

	if($service == "twitter"){
		if(isset($argv[6])){
			//accessToken
			$access_token = $argv[6];
		}else{
			$access_token = "";
		}
		if(isset($argv[7])){
			//accessSecret
			$access_secret = $argv[7];
		}else{
			$access_secret = "";
		}
		if(isset($argv[8])){
			//key
			$appKey = $argv[8];
		}else{
			$appKey = "";
		}
		if(isset($argv[9])){
			//secret
			$appSecret = $argv[9];
		}else{
			$appSecret = "";
		}

		$path = $thing . "app/post/tmpUpload/" . $fileName;

		$connection = new TwitterOAuth($appKey, $appSecret, $access_token, $access_secret);

		if($fileName != ""){
			$url = 'statuses/update_with_media';
			$stuff = array('status' => $msg, "media[]" => "@"."{$path}");
		}else{
			$url = 'statuses/update';
			$stuff = array('status' => $msg);
		}

		$status = $connection->upload($url, $stuff);

		//print_r($status);

		if(isset($status->errors[0]->message)){
			global $returnArray;
			$returnArray['twitterFailure'] =  "Your message could not be posted. Twitter said: " . $status->errors[0]->message;
		}else{
			global $returnArray;
			$returnArray['twitterSuccess'] =  "Your Twitter message was posted successfully";
		}
	}

	if($service == "instagram"){
		$response = "";
		
		$res = json_decode($response, true);
		if(isset($res['error'])){
			$returnArr['Instagram'] = array("success" => 'false', "msg" => $res['error']['message']);
		}else{
			$returnArr['Instagram'] = array("success" => 'true', "msg" => $res['id']);
		} 
	}

	//get rid of the file after we try and do something with it
	if(isset($fileName) && $fileName != ""){
		//unlink("../../app/post/tmpUpload/" . $fileName);
	}
//}

//postFilesAt();