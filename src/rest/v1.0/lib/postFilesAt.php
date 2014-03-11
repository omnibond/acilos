<?php

require_once('../../oAuth/twitteroauth/twitteroauth.php');

//function postFilesAt(){
	/*$fileName = $argv[1];
	$fileType = $argv[2];
	$service = $argv[3];
	$msg = $argv[4];*/

	if(isset($argv[1])){
		$fileName = $argv[1];
	}else{
		$fileName = "";
	}
	if(isset($argv[2])){
		$fileType = $argv[2];
	}else{
		$fileType = "";
	}
	if(isset($argv[3])){
		$service = $argv[3];
	}else{
		$service = "";
	}
	if(isset($argv[4])){
		$msg = $argv[4];
		$msg = str_replace("+", " ", $msg);
	}else{
		$msg = "";
	}
	if(isset($argv[5])){
		$server = $argv[5];
	}else{
		$server = "";
	}
	
	$methodArr = explode(":", $service);

	$returnArr = array();
	
	$dir = getcwd();
	$dirArr = explode("/", $dir);
	$dir = '';
	$count = 0;
	for($d = 0; $d < count($dirArr); $d++){
		if($dirArr[$d] == "src"){
			$dir = $dir.$dirArr[$d]."/";
			$count = 0;
		}
		if($count > 0){
			$dir = $dir.$dirArr[$d]."/";
		}
		if($dirArr[$d] == "socialreader"){
			$dir = $dir.$dirArr[$d]."/";
			$count = $d;
		}
	}
	
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
	
	for($p = 0; $p < count($methodArr); $p++){
		if($methodArr[$p]  == "Facebook"){
			$fileToken = "../../oAuth/facebookToken.txt";
			$file = file_get_contents($fileToken);

			$obj = json_decode($file, true);

			$photoURL = 'https://graph.facebook.com/'.$obj['userID'].'/photos?access_token='.$obj['access_token'].'&app_id='.$obj['appID'];

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
				$path = $thing."app/post/tmpUpload/" . $fileName;
				$params = array(
					"message" => $msg,
					"source" => "@" . $path
				);
			}else{
				$params = array(
					"message" => $msg,
					'access_token' => $obj['access_token']
				);
			}

			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response = curl_exec($ch);
			curl_close($ch);
							
			$res = json_decode($response, true);

			if(isset($res['error'])){
				$returnArr['Facebook'] = array("success" => 'false', "msg" => $res['error']['message']);
			}else{
				$returnArr['Facebook'] = array("success" => 'true', "msg" => $res['id']);
			} 
		}
		if($methodArr[$p]  == "Linkedin"){
			$filename = "../../oAuth/linkedinUserCreds.txt";
			$file = file_get_contents($filename) or die("Cannot open the file " . $filename);
			$obj = json_decode($file, true);
			$access_token = $obj['access_token'];
			$api_Key = $obj['apiKey'];
			$api_Secret = $obj['apiSecret'];
			$user_Id = $obj['userId'];
			
			$url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,site-standard-profile-request)?format=json&oauth2_access_token=' . $access_token;
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output 
			$result = curl_exec($ch);
			curl_close ($ch);

			$result = json_decode($result, true);
			
			$profileLink = $result['siteStandardProfileRequest']['url'];

			$headerOptions = array(
				"Content-Type: text/xml;charset=utf-8"
			);

			$imageURL = $server . 'app/post/tmpUpload/' . $fileName;
			$title = "Ferrari!";
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
		if($methodArr[$p]  == "Twitter"){
			$filename = "../../oAuth/twitterClientInfo.txt";
			$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
			$obj = json_decode($file, true);
			$oauth_Token = $obj['accessToken'];
			$oauth_TokenSecret = $obj['oauthSecret'];
			$consumer_key = $obj['appKey'];
			$consumer_secret = $obj['appSecret'];
			$access_token = $obj['accessToken'];
			$access_secret = $obj['accessSecret'];

			$path = $thing."app/post/tmpUpload/" . $fileName;
		
			$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
	
			if($fileName != ""){
				$url = 'statuses/update_with_media';
				$stuff = array('status' => $msg, "media[]" => "@"."{$path}");
			}else{
				$url = 'statuses/update';
				$stuff = array('status' => $msg);
			}

			$status = $connection->upload($url, $stuff);

			if(isset($status->errors[0]->message)){
				global $returnArray;
				$returnArray['twitterFailure'] =  "Your message could not be posted. Twitter said: " . $status->errors[0]->message;
			}else{
				global $returnArray;
				$returnArray['twitterSuccess'] =  "Your Twitter message was posted successfully";
			}
		}
		if($methodArr[$p]  == "Instagram"){
			$response = "";
			
			$res = json_decode($response, true);
			if(isset($res['error'])){
				$returnArr['Instagram'] = array("success" => 'false', "msg" => $res['error']['message']);
			}else{
				$returnArr['Instagram'] = array("success" => 'true', "msg" => $res['id']);
			} 
		}
	}
	//get rid of the file after we try and do something with it
	if(isset($fileName) && $fileName != ""){
		//unlink("../../app/post/tmpUpload/" . $fileName);
	}
//}

//postFilesAt();