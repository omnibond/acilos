<?php

require_once('../../oAuth/twitteroauth/twitteroauth.php');

use \ElasticSearch\Client;

Class Post{

	function GetXMLTemplate(){
		$string = '<?xml version="1.0" encoding="UTF-8"?><activity locale="en_US">
		<content-type>linkedin-html</content-type>
		<body>xml_content</body>
		</activity>';
		return $string;
	}

	function runAtCommand(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		postFilesHandler($varObj);
	}
	
	function sendInstaLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];

		$fileToken = "../../oAuth/instaToken.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$likeURL =  'https://api.instagram.com/v1/media/'.$id.'/likes';
			
		$params = array(
			'access_token' => $obj['access_token']
		);
			
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		curl_close($ch);

		return json_encode(array("success" => "Your 'like' was successful."));
	}
	
	function sendInstaUnLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];

		$fileToken = "../../oAuth/instaToken.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$likeURL = $likeURL =  'https://api.instagram.com/v1/media/'.$id.'/likes?access_token='.$obj['access_token'];
	
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		$response = curl_exec($ch);
		curl_close($ch);

		return json_encode(array("success" => "Your 'unlike' was successful."));
	}
	
	function sendLinkedLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];

		$fileToken = "../../oAuth/linkedinUserCreds.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$url = "https://api.linkedin.com/v1/posts/".$id."/relation-to-viewer/is-liked?oauth2_access_token=".$obj['access_token'];
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "<is-liked>true</is-liked>");
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		$response = curl_exec($ch);
		curl_close($ch);
	
		return json_encode(array("success" => "Your 'like' was successful."));
	}
	
	function sendLinkedUnLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];

		$fileToken = "../../oAuth/linkedinUserCreds.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$url = "https://api.linkedin.com/v1/posts/".$id."/relation-to-viewer/is-liked?oauth2_access_token=".$obj['access_token'];
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "<is-liked>false</is-liked>");
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		$response = curl_exec($ch);
		curl_close($ch);

		return json_encode(array("success" => "Your 'unlike' was successful."));
	}
	
	function sendTwitterFav(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];

		$filename = "../../oAuth/twitterClientInfo.txt";
		$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
		$obj = json_decode($file, true);
		$oauth_Token = $obj['accessToken'];
		$oauth_TokenSecret = $obj['oauthSecret'];
		$consumer_key = $obj['appKey'];
		$consumer_secret = $obj['appSecret'];
		$access_token = $obj['accessToken'];
		$access_secret = $obj['accessSecret'];

		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
	
		$status = $connection->post('favorites/create', array('id' => $id));

		return json_encode(array("success" => "Your 'like' was successful."));
	}
	
	function sendTwitterUnFav(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];
		
		$filename = "../../oAuth/twitterClientInfo.txt";
		$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
		$obj = json_decode($file, true);
		$oauth_Token = $obj['accessToken'];
		$oauth_TokenSecret = $obj['oauthSecret'];
		$consumer_key = $obj['appKey'];
		$consumer_secret = $obj['appSecret'];
		$access_token = $obj['accessToken'];
		$access_secret = $obj['accessSecret'];

		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
	
		$status = $connection->post('favorites/destroy', array('id' => $id));

		return json_encode(array("success" => "Your 'unlike' was successful."));
	}
	
	function sendFaceLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$idFirstPart = $varObj['idFirstPart'];
		$idSecondPart = $varObj['idSecondPart'];

		$fileToken = "../../oAuth/facebookToken.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$likeURL = 'https://graph.facebook.com/' . $idSecondPart . '/likes?access_token';
			
		$params = array(
			'access_token' => $obj['access_token']
		);
			
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		curl_close($ch);

		return json_encode(array("success" => "Your 'like' was successful."));
	}
	
	function sendFaceUnLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$idFirstPart = $varObj['idFirstPart'];
		$idSecondPart = $varObj['idSecondPart'];

		$fileToken = "../../oAuth/facebookToken.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$likeURL = 'https://graph.facebook.com/' . $idSecondPart . '/likes?access_token='.$obj['access_token'];
	
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		$response = curl_exec($ch);
		curl_close($ch);

		return json_encode(array("success" => "Your 'unlike' was successful."));
	}

	function sendFaceComment(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		$id = $varObj['id'];
		$comment = $varObj['comment'];

		$fileToken = "../../oAuth/facebookToken.txt";
		$file = file_get_contents($fileToken);

		$obj = json_decode($file, true);

		$commentURL = 'https://graph.facebook.com/' . $id . '/comments';

		$params = array(
			'access_token' => $obj['access_token'],
			'message' => $comment
		);

		$ch = curl_init($commentURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		curl_close($ch);

		return json_encode(array("success" => "Your 'comment' was posted successfully"));
	}
	
	function sendTwitReply(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		$authorUsername = $varObj['authorUsername'];
		$tweetID = $varObj['tweetID'];
		$message = $varObj['message'];

		if(isset($varObj['file'])){
			$fileName = $varObj['file'];
		}else{
			$fileName = "";
		}
		
		if(isset($varObj['fileType'])){
			$fileType = $varObj['fileType'];
		}else{
			$fileType = "";
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

		$message = "@" . $authorUsername . " " . $message;

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
			$stuff = array(
				'status' => $message, 
				"media[]" => "@"."{$path}",
				'in_reply_to_status_id' => $tweetID
			);
		}else{
			$url = 'statuses/update';
			$stuff = array(
				'status' => $message,
				'in_reply_to_status_id' => $tweetID
			);
		}

		$status = $connection->post('statuses/update', $stuff);
		//$status = $connection->upload($url, $stuff);

		print_r($status);

		/*if(isset($status->errors[0]->message)){
			return json_encode(array("error" => "Your reply could not be posted. Twitter said: " . $status->errors[0]->message));
		}else{
			return json_encode(array("success" => "Your reply was posted successfully"));
		}*/
	}

	function sendTwitRetweet(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$tweetID = $varObj['tweetID'];

		$filename = "../../oAuth/twitterClientInfo.txt";
		$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
		$obj = json_decode($file, true);
		$oauth_Token = $obj['accessToken'];
		$oauth_TokenSecret = $obj['oauthSecret'];
		$consumer_key = $obj['appKey'];
		$consumer_secret = $obj['appSecret'];
		$access_token = $obj['accessToken'];
		$access_secret = $obj['accessSecret'];

		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);

		$status = $connection->post('statuses/retweet/' . $tweetID);

		if(isset($status->errors)){
			return json_encode(array("error" => "The tweet could not be retweeted. Twitter said: " . $status->errors));
		}else{
			return json_encode(array("success" => "The tweet was retweeted successfully"));
		}
	}
	
	function postFiles(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$msg = $varObj['msg'];
		$tokenArr = $varObj['tokenArr'];
		$fileName = $varObj['file'];
		$fileType = $varObj['fileType'];

		//print_r($tokenArr);

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

		//print_r($thing);

		foreach($tokenArr as $key => $value){
			switch($key){
				case "facebook":
					for($x = 0; $x < count($tokenArr[$key]); $x++){
						//print_r($tokenArr[$key][$x]);
						$leStuff = explode(":", $tokenArr[$key][$x]);
						//print_r($leStuff);
						if(isset($leStuff[0])){
							$access_token = $leStuff[0];
						}
						if(isset($leStuff[1])){
							$app_id = $leStuff[1];
						}
						if(isset($leStuff[2])){
							$user_id = $leStuff[2];
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

					break;
				case "twitter":
					for($x = 0; $x < count($tokenArr[$key]); $x++){
						$leStuff = explode(":", $tokenArr[$key][$x]);
						if(isset($leStuff[0])){
							//accessToken
							$access_token = $leStuff[0];
						}
						if(isset($leStuff[1])){
							//accessSecret
							$access_secret = $leStuff[1];
						}
						if(isset($leStuff[2])){
							//key
							$appKey = $leStuff[2];
						}
						if(isset($leStuff[3])){
							//secret
							$appSecret = $leStuff[3];
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

					break;
				case "instagram":
					//do stuff
					break;
				case "linkedin":
					for($x = 0; $x < count($tokenArr[$key]); $x++){
						if(isset($tokenArr[$key][$x])){
							$access_token = $tokenArr[$key][$x];
						}

						$url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,site-standard-profile-request)?format=json&oauth2_access_token=' . $access_token;
						$ch = curl_init($url);
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
						curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output 
						$result = curl_exec($ch);
						curl_close ($ch);

						$result = json_decode($result, true);

						//print_r($result);

						$profileLink = $result['siteStandardProfileRequest']['url'];

						$headerOptions = array(
							"Content-Type: text/xml;charset=utf-8"
						);

						$imageURL = $_SERVER['HTTP_REFERER'] . 'app/post/tmpUpload/' . $fileName;
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

					break;
				default:
					//woops
					break;
			}
		}
	}
	
	function whichService(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$msg = $varObj['msg'];
		$service = $varObj['service'];
		
		$returnArray = array(
		
		);

		if(isset($varObj['service']['facebook'])){
			if($varObj['service']['facebook'] == "true"){
				
				$filename = "../../oAuth/facebookToken.txt";
				$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
				$obj = json_decode($file, true);

				//$url = 'https://graph.facebook.com/me/home?&access_token=' . $obj['access_token'];
				$token = $obj['access_token'];

					
				$attachment =  array(
					'access_token' => $obj['access_token'],
					'message' => $msg
				);

				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL,'https://graph.facebook.com/me/feed');
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
				curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $attachment);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output 
				$result = curl_exec($ch);
				curl_close ($ch);

				$var = json_decode($result, true);

				//print_r($result);

				if(isset($var['id'])){
					global $returnArray;
					$returnArray['facebookSuccess'] =  "Your Facebook message was posted successfully";
				}else{
					global $returnArray;
					$returnArray['facebookFailure'] =  "Your message could not be posted. Facebook said: " . $var['error']['message'];
				}	
			}

			if(isset($varObj['service']['twitter'])){
				if($varObj['service']['twitter']== "true"){

					$filename = "../../oAuth/twitterClientInfo.txt";
					$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
					$obj = json_decode($file, true);
					$oauth_Token = $obj['accessToken'];
					$oauth_TokenSecret = $obj['oauthSecret'];
					$consumer_key = $obj['appKey'];
					$consumer_secret = $obj['appSecret'];
					$access_token = $obj['accessToken'];
					$access_secret = $obj['accessSecret'];

					
				
					$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
				
					$status = $connection->post('statuses/update', array('status' => $msg));

					//print_r($status);

					
					if(isset($status->errors[0]->message)){
						global $returnArray;
						$returnArray['twitterFailure'] =  "Your message could not be posted. Twitter said: " . $status->errors[0]->message;
					}else{
						global $returnArray;
						$returnArray['twitterSuccess'] =  "Your Twitter message was posted successfully";
					}
					
					/*if(isset($status->errors[0]->message)){
						return json_encode(array('failure' => "Your message could not be posted. Twitter said: " . $status->errors[0]->message));
					}else{
						return json_encode(array('success'=>'Your message was posted successfully'));
					}*/

				}
			}
			if(isset($varObj['service']['linkedin'])){
				if($varObj['service']['linkedin'] == "true"){
					$filename = "../../oAuth/linkedinUserCreds.txt";
					$file = file_get_contents($filename) or die("Cannot open the file " . $filename);
					$obj = json_decode($file, true);
					$access_token = $obj['access_token'];
					$api_Key = $obj['apiKey'];
					$api_Secret = $obj['apiSecret'];
					$user_Id = $obj['userId'];

					//You can now use this access_token to make API calls on behalf of this user 
					//by appending "oauth2_access_token=access_token" at the end of the API call that you wish to make.

					//http://api.linkedin.com/v1/people/~:(id,first-name,last-name,site-standard-profile-request)

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
						//"x-li-format :  json",
						"Content-Type: text/xml;charset=utf-8",
						//"Content-Type" => "text/xml"
					);

					$shareXML = "<share>
					      <comment>Test Comment Linkedin</comment>
					      <content>
					         <title>Title</title>
					         <submitted-url>".urlencode($profileLink)."</submitted-url>
					         <submitted-image-url></submitted-image-url>
					         <description>Test Post Linkedin</description>
					      </content>
					      <visibility>
					      	<code>connections-only</code>
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
					
					$ch2 = curl_init($wallUrl);
					curl_setopt($ch2, CURLOPT_POST, 1);
					curl_setopt($ch2, CURLOPT_POSTFIELDS, $wallXML);
					curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
					curl_setopt($ch2, CURLOPT_HTTPHEADER, $headerOptions);
					$response = curl_exec($ch2);
					$code = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
					curl_close($ch2);
					
					if(isset($code)){
						if($code == "201"){
							global $returnArray;
							$returnArray['linkedinSuccess'] = "Your LinkedIn message was posted successfully";
						}else{
							global $returnArray;
							$returnArray['linkedinFailure'] = "Your LinkedIn message could not be posted";
						}
					}
				}
			}
		}
		
		return json_encode($returnArray);
		
	}
}

function postFilesHandler($obj){
	$date = $obj['date'];
	$time = $obj['time'];
	$file = $obj['file'];
	$fileType = $obj['fileType'];
	$service = $obj['service'];
	$msg = $obj['msg'];

	$msg = str_replace(" ", "+", $msg);

	$dateArr = explode("-", $date);

	$date = "";

	for($i = 0; $i < count($dateArr); $i++){
		$date = $date.$dateArr[$i]."/";
	}

	$date = rtrim($date, "/");

	$dir = getcwd();

	$dirArr = explode("/", $dir);
	$dir = '';
	$count = 0;

	for($x = 0; $x < count($dirArr); $x++){
		if($dirArr[$x] != 'v1.0'){
			$dir = $dir.$dirArr[$x]."/";
		}
		if($dirArr[$x] == 'v1.0'){
			$dir = $dir.$dirArr[$x];
		}
	}

	$path = $dir."/lib/postFilesAt.php";

	$server = $_SERVER['HTTP_REFERER'];

	$command = "php" . " $path" .  " $file" .  " $fileType" .  " $service" . " $msg" . " $server";

	$atCommand = "echo" . " \"$command\"" . " |" . " at" . " $time" . " $date";

	$atCommand = "$atCommand";

	//$atCommand = "echo" . " \"touch bob.php\"" . " |" . " at" . " $time" . " $date"; <--- JUST FOR TESTING

	print_r($atCommand);

	exec($atCommand);

	return json_encode(array("success" => "true"));
}


