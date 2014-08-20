<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to posting to social media outlets
** 
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirementsl
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$s
*/

require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('authCalls.php');
require_once('saveServiceCalls.php');

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
		$access_token = $varObj['accessToken'];

		$likeURL =  'https://api.instagram.com/v1/media/'.$id.'/likes';
			
		$params = array(
			'access_token' => $access_token
		);
			
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		curl_close($ch);

		//print_R($response);

		$response = json_decode($response, true);

		//print_r($response['meta']['code']);

		if(isset($response['meta']['code'])){
			if($response['meta']['code'] == 200){
				return json_encode(array("Success" => "Your Instagram 'like' was successful."));
			}else{
				if(isset($response['meta']['error_message'])){
					return json_encode(array("Failure" => "Your Instagram 'like' was unsuccessful. Reason: " . $response['meta']['error_message']));	
				}else{
					return json_encode(array("Failure" => "Your Instagram 'like' was unsuccessful. Reason: unspecified"));
				}
			}
		}
	}
	
	function sendInstaUnLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];
		$access_token = $varObj['accessToken'];

		$likeURL = $likeURL =  'https://api.instagram.com/v1/media/'.$id.'/likes?access_token='.$access_token;
	
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);

		//print_R($response);

		$response = json_decode($response, true);

		if(isset($response['meta']['code'])){
			if($response['meta']['code'] == 200){
				return json_encode(array("Success" => "Your Instagram 'unlike' was successful."));
			}else{
				if(isset($response['meta']['error_message'])){
					return json_encode(array("Failure" => "Your Instagram 'unlike' was unsuccessful. Reason: " . $response['meta']['error_message']));
				}else{
					return json_encode(array("Failure" => "Your Instagram 'unlike' was unsuccessful. Reason: unspecified"));
				}
			}
		}
	}
	
	function sendInstaComment(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$postID = $varObj['id'];
		$access_token = $varObj['accessToken'];
		$message = $varObj['msg'];
		
		$params = array(
			"text" => $message,
			"access_token" => $access_token
		);

		$url = "https://api.instagram.com/v1/media/".$postID."/comments";
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		$response = curl_exec($ch);
		curl_close($ch);
		
		//print_r($response);
		
		return json_encode(array("success" => "Your 'post' was successful."));
	}
	
	function sendLinkedLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];
		$access_token = $varObj['accessToken'];
		
		$url = "https://api.linkedin.com/v1/people/~/network/updates/key=".$id."/is-liked?format=json&oauth2_access_token=".$access_token;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "<is-liked>true</is-liked>");
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		$response = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		$response = json_decode($response, true);
		
		//print_r($response);
		
		if($code == "201"){
			return json_encode(array("Success" => "Your LinkedIn 'like' was successful."));
		}else{
			if(isset($response['message'])){
				return json_encode(array("Failure" => "Your LinkedIn 'like' was unsuccessful. Reason: " . $response['message']));
			}else{
				return json_encode(array("Failure" => "Your LinkedIn 'like' was unsuccessful. Reason: unspecified"));
			}
		}
	}
	
	function sendLinkedUnLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];
		$access_token = $varObj['accessToken'];

		$url = "https://api.linkedin.com/v1/people/~/network/updates/key=".$id."/is-liked?format=json&oauth2_access_token=".$access_token;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "<is-liked>false</is-liked>");
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		$response = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		$response = json_decode($response, true);
		
		//print_r($response);
		
		if($code == "201"){
			return json_encode(array("Success" => "Your LinkedIn 'unlike' was successful."));
		}else{
			if(isset($response['message'])){
				return json_encode(array("Failure" => "Your LinkedIn 'unlike' was unsuccessful. Reason: " . $response['message']));
			}else{
				return json_encode(array("Failure" => "Your LinkedIn 'unlike' was unsuccessful. Reason: unspecified"));
			}
		}
	}
	
	function sendLinkedinComments(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$postID = $varObj['id'];
		$access_token = $varObj['accessToken'];
		$message = $varObj['msg'];
		
		$url = "https://api.linkedin.com/v1/people/~/network/updates/key=".$postID."/update-comments?format=json&oauth2_access_token=".$access_token;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:text/xml'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "<update-comment><comment>".$message."</comment></update-comment>");
		$response = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		$response = json_decode($response, true);

		//print_r($response);

		if($code == "201"){
			return json_encode(array("Success" => "Your LinkedIn 'comment' was successful."));
		}else{
			if(isset($response['message'])){
				return json_encode(array("Failure" => "Your LinkedIn 'comment' was unsuccessful. Reason: " . $response['message']));
			}else{
				return json_encode(array("Failure" => "Your LinkedIn 'comment' was unsuccessful. Reason: unspecified"));
			}
		}
	}
	
	function sendTwitterFav(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];
		$oauth_Token = $varObj['accessToken'];
		$consumer_key = $varObj['appKey'];
		$consumer_secret = $varObj['appSecret'];
		$access_secret = $varObj['accessSecret'];

		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
	
		$status = $connection->post('favorites/create', array('id' => $id));

		//print_r($status);

		if(isset($status->errors[0]->message)){
			return json_encode(array("Failure" => "Your Twitter 'favorite' was unsuccessful. Reason: " . $status->errors[0]->message));
		}else{
			if(isset($status->created_at)){
				return json_encode(array("Success" => "Your Twitter 'favorite' was successful."));
			}else{
				return json_encode(array("Failure" => "Your Twitter 'favorite' was unsuccessful. Reason: unspecified"));
			}
		}
	}
	
	function sendTwitterUnFav(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$id = $varObj['id'];
		$oauth_Token = $varObj['accessToken'];
		$consumer_key = $varObj['appKey'];
		$consumer_secret = $varObj['appSecret'];
		$access_secret = $varObj['accessSecret'];

		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
	
		$status = $connection->post('favorites/destroy', array('id' => $id));

		//print_r($status);

		if(isset($status->errors[0]->message)){
			return json_encode(array("Failure" => "Your Twitter 'unfavorite' was unsuccessful. Reason: " . $status->errors[0]->message));
		}else{
			if(isset($status->created_at)){
				return json_encode(array("Success" => "Your Twitter 'unfavorite' was successful."));
			}else{
				return json_encode(array("Failure" => "Your Twitter 'unfavorite' was unsuccessful. Reason: unspecified"));
			}
		}
	}

	function sendTwitRetweet(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$tweetID = $varObj['tweetID'];

		$oauth_Token = $varObj['accessToken'];
		$consumer_key = $varObj['appKey'];
		$consumer_secret = $varObj['appSecret'];
		$access_secret = $varObj['accessSecret'];

		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);

		$status = $connection->post('statuses/retweet/' . $tweetID);

		//print_R($status);

		if(isset($status->errors[0]->message)){
			return json_encode(array("Failure" => "Your Twitter 'retweet' was unsuccessful. Reason: " . $status->errors[0]->message));
		}else{
			if(isset($status->created_at)){
				return json_encode(array("Success" => "Your Twitter 'retweet' was successful."));
			}else{
				return json_encode(array("Failure" => "Your Twitter 'retweet' was unsuccessful. Reason: unspecified"));
			}
		}
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
			if($thingArr[$f] == "src" || $thingArr[$f] == "app-production"){
				$thing = $thing.$thingArr[$f]."/";
				$count = -1;
			}
			if($count >= 0){
				$thing = $thing.$thingArr[$f]."/";
				$count = $f;
			}
		}

		$message = "@" . $authorUsername . " " . $message;

		$oauth_Token = $varObj['accessToken'];
		$consumer_key = $varObj['appKey'];
		$consumer_secret = $varObj['appSecret'];
		$access_secret = $varObj['accessSecret'];

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

		//print_r($status->created_at);

		if(isset($status->errors[0]->message)){
			return json_encode(array("Failure" => "Your Twitter 'reply' was unsuccessful. Reason: " . $status->errors[0]->message));
		}else{
			if(isset($status->created_at)){
				return json_encode(array("Success" => "Your Twitter 'reply' was successful."));
			}else{
				return json_encode(array("Failure" => "Your Twitter 'reply' was unsuccessful. Reason: unspecified"));
			}
		}
	}
	
	function sendFaceLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$idFirstPart = $varObj['idFirstPart'];
		$idSecondPart = $varObj['idSecondPart'];
		$access_token = $varObj['accessToken'];

		$likeURL = 'https://graph.facebook.com/' . $idSecondPart . '/likes';
			
		$params = array(
			'access_token' => $access_token,
			"url" => 'https://graph.facebook.com/' . $idSecondPart . '/likes'
		);
			
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		$response = json_decode($response, true);

		//print_r($response);

		curl_close($ch);

		if(isset($response)){
			if($response === "true" || $response === 1 || $response === true){
				return json_encode(array("Success" => "Your Facebook 'like' was successful."));
			}else{
				if(isset($response['error']['message'])){
					return json_encode(array("Failure" => "Your Facebook 'like' was unsuccessful. Reason: " . $response['error']['message']));	
				}else{
					return json_encode(array("Failure" => "Your Facebook 'like' was unsuccessful. Reason: unspecified"));
				}
			}
		}else{
			return json_encode(array("Failure" => "Your Facebook 'like' was unsuccessful. Reason: unspecified"));
		}	
	}
	
	function sendFaceUnLike(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$idFirstPart = $varObj['idFirstPart'];
		$idSecondPart = $varObj['idSecondPart'];
		$access_token = $varObj['accessToken'];

		$likeURL = 'https://graph.facebook.com/' . $idSecondPart . '/likes?access_token='.$access_token;
	
		$ch = curl_init($likeURL);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		$response = json_decode($response, true);

		//print_r($response);

		curl_close($ch);
		
		if(isset($response)){
			if($response === "true" || $response === 1 || $response === true){
				return json_encode(array("Success" => "Your Facebook 'unlike' was successful."));
			}else{
				if(isset($response['error']['message'])){
					return json_encode(array("Failure" => "Your Facebook 'unlike' was unsuccessful. Reason: " . $response['error']['message']));	
				}else{
					return json_encode(array("Failure" => "Your Facebook 'unlike' was unsuccessful. Reason: unspecified"));
				}
			}
		}else{
			return json_encode(array("Failure" => "Your Facebook 'unlike' was unsuccessful. Reason: unspecified"));
		}
	}

	function sendFaceComment(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		$id = $varObj['id'];
		$comment = $varObj['comment'];
		$access_token = $varObj['accessToken'];

		$commentURL = 'https://graph.facebook.com/' . $id . '/comments';

		$params = array(
			'access_token' => $access_token,
			'message' => $comment
		);

		$ch = curl_init($commentURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);

		$response = json_decode($response, true);

		//print_r($response);

		curl_close($ch);

		if(isset($response)){
			if(isset($response['id'])){
				return json_encode(array("Success" => "Your Facebook 'comment' was successful."));
			}else{
				if(isset($response['error']['message'])){
					return json_encode(array("Failure" => "Your Facebook 'comment' was unsuccessful. Reason: " . $response['error']['message']));
				}else{
					return json_encode(array("Failure" => "Your Facebook 'comment' was unsuccessful. Reason: unspecified"));
				}
			}	
		}else{
			return json_encode(array("Failure" => "Your Facebook 'comment' was unsuccessful. Reason: unspecified"));
		}
	}
	
	function postFiles(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		if(isset($varObj['time']) && $varObj['time'] != "" && $varObj['time'] != "?"){
			$timeStamp = $varObj['time'];

			$cTime = @date('Y-m-d H:i:s e', $timeStamp);

			$timeArr1 = explode(" ", $cTime);
			$timeArr2 = explode("-", $timeArr1[0]);

			$month = $timeArr2[1];
			$day = $timeArr2[2];
			$year = $timeArr2[0];
			$preTime = $timeArr1[1];

			$hoursTimeArr = explode(":", $preTime);
			$preHours = $hoursTimeArr[0];
			$minutes = $hoursTimeArr[1];
			$seconds = $hoursTimeArr[2];

			if(intval($preHours) > 12 || intval($preHours) == 12){
	            $hours = intval($preHours) - 12;

	            if($hours == 0){
	                    $hours = 12;
	            }

	            $suffix = "pm";
		    }else{
	            $hours = intval($preHours);

	            if($hours == 0){
	                    $hours = 12;
	            }
	            
	            $suffix = "am";
		    }

			$time = $hours . ":" . $minutes . " " . $suffix;
			$date = $month . "/" . $day . "/" . $year;
		}else{
			$time = "?";
			$date = "?";
		}

		if(isset($varObj['msg']) && $varObj['msg'] !== " "){
			$msg = $varObj['msg'];
		}else{
			$msg = "";
		}


		if(isset($varObj['tokenArr'])){
			$tokenArr = $varObj['tokenArr'];
		}else{
			$tokenArr = "";
		}


		if(isset($varObj['file']) && $varObj['file'] !== "?"){
			$fileName = $varObj['file'];
		}else{
			$fileName = "";
		}


		if(isset($varObj['fileType']) && $varObj['fileType'] !== "?"){
			$fileType = $varObj['fileType'];
		}else{
			$fileType = "";
		}

		//print_r($tokenArr);

		$thing = getcwd();
		$thingArr = explode("/", $thing);
		$thing = '';
		$count = 0;
		for($f = 0; $f < count($thingArr); $f++){
			if($thingArr[$f] == "src" || $thingArr[$f] == "app-production"){
				$thing = $thing.$thingArr[$f]."/";
				$count = -1;
			}
			if($count >= 0){
				$thing = $thing.$thingArr[$f]."/";
				$count = $f;
			}
		}

		global $returnArray;

		$postID = uniqid();

		$server = $_SERVER['HTTP_REFERER'];

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
						if(isset($leStuff[3])){
							$name = $leStuff[3];
						}

						$photoURL = 'https://graph.facebook.com/me/photos?access_token='.$access_token;

						$statusURL = 'https://graph.facebook.com/me/feed';

						if(isset($fileName)){
							if($fileName == ""){
								$url = $statusURL;
							}else{
								$url = $photoURL;
							}
						}

						//print_r($url);

						$ch = curl_init($url);

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

						//var_dump($response);
										
						$res = json_decode($response, true);

						if(isset($res)){
							if(isset($res['error'])){
								$returnArray['Facebook'][$x] = array("failure" => 'true', "msg" => "The Facebook status for " . $name . " could not be posted - " . $res['error']['message'], "accessToken" => $access_token, "user" => $user_id, "name" => $name);
							}else{
								$returnArray['Facebook'][$x] = array("success" => 'true', "msg" => "The Facebook status for " . $name . " was posted successfully", "accessToken" => $access_token, "user" => $user_id, "name" => $name);
							}
						}else{
							$returnArray['Facebook'][$x] = array("failure" => 'true', "msg" => "The Facebook status for " . $name . " could not be posted - no response from Facebook", "accessToken" => $access_token, "user" => $user_id, "name" => $name);
						}

						saveFacebookPost($returnArray['Facebook'][$x], "normal", "completed", $postID, $fileName, $fileType, $msg, $server, $access_token, $app_id, $user_id, $date, $time, $name);
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
						if(isset($leStuff[4])){
							$user = $leStuff[4];
						}
						if(isset($leStuff[5])){
							$name = $leStuff[5];
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

						//var_dump($status);

						if(isset($status)){
							if(isset($status->errors[0]->message)){
								$returnArray['Twitter'][$x] =  array("failure" => "true", "msg" => "The Twitter status for " . $name . " could not be posted - " . $status->errors[0]->message, "accessToken" => $access_secret, "user" => $user, "name" => $name);
							}else{
								$returnArray['Twitter'][$x] =  array("success" => "true", "msg" => "The Twitter status for " . $name . " was posted successfully", "accessToken" => $access_secret, "user" => $user, "name" => $name);
							}
						}else{
							$returnArray['Twitter'][$x] =  array("failure" => "true", "msg" => "The Twitter status for " . $name . " could not be posted - no response from Twitter", "accessToken" => $access_secret, "user" => $user, "name" => $name);
						}

						saveTwitterPost($returnArray['Twitter'][$x], "normal", "completed", $postID, $fileName, $fileType, $msg, $server, $access_token, $access_secret, $appKey, $appSecret, $date, $time, $name);
					}

					break;
				case "instagram":
					//do stuff
					break;
				case "linkedin":
					for($x = 0; $x < count($tokenArr[$key]); $x++){
						$leStuff = explode(":", $tokenArr[$key][$x]);
						if(isset($leStuff[0])){
							$access_token = $leStuff[0];
						}
						if(isset($leStuff[1])){
							$user = $leStuff[1];
						}
						if(isset($leStuff[2])){
							$name = $leStuff[2];
						}

						/*$url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,site-standard-profile-request)?format=json&oauth2_access_token=' . $access_token;
						$ch = curl_init($url);
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
						curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output 
						$result = curl_exec($ch);
						curl_close ($ch);

						$result = json_decode($result, true);

						print_r($result);

						$profileLink = $result['siteStandardProfileRequest']['url'];*/

						$headerOptions = array(
							"Content-Type: text/xml;charset=utf-8"
						);

						$imageURL = $_SERVER['HTTP_REFERER'] . 'app/post/tmpUpload/' . $fileName;
						$title = "Title";
						$shareXML = "<share>
							<comment></comment>
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

						$wallXML = "<share>
							<comment>".$msg."</comment>
							<visibility>
								<code>anyone</code>
							</visibility>
							</share>";

						if($fileName == ""){
							$url = $shareUrl;
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
						$xml = simplexml_load_string($response);

						if($code == "201"){
							$returnArray['Linkedin'][$x] = array("success" => "true", "msg" => "The LinkedIn status for " . $name . " was posted successfully", "accessToken" => $access_token, "user" => $user, "name" => $name);
						}else{
							if(isset($xml)){
								$xml = (array)($xml);
								if(isset($xml['error-code'])){
									$linkCode = $xml['error-code'];
									if($linkCode == "0"){
										$returnArray['Linkedin'][$x] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted - Status is a duplicate.", "accessToken" => $access_token, "user" => $user, "name" => $name);
									}else{
										$returnArray['Linkedin'][$x] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted - " . $xml['message'], "accessToken" => $access_token, "user" => $user, "name" => $name);
									}
								}
							}else{
								$returnArray['Linkedin'][$x] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted - no response from LinkedIn.", "accessToken" => $access_token, "user" => $user, "name" => $name);
							}
						}

						saveLinkedInPost($returnArray['Linkedin'][$x], "normal", "completed", $postID, $fileName, $fileType, $msg, $server, $access_token, $date, $time, $name);
					}

					break;
				default:
					//woops
					break;
			}
		}

		return json_encode(array("returnArray" => $returnArray));
	}
}

function postFilesHandler($obj){
	if(isset($obj['time']) && $obj['time'] != "" && $obj['time'] != "?"){
		$timeStamp = $obj['time'];

		$cTime = @date('Y-m-d H:i:s e', $timeStamp);

		$timeArr1 = explode(" ", $cTime);
		$timeArr2 = explode("-", $timeArr1[0]);

		$month = $timeArr2[1];
		$day = $timeArr2[2];
		$year = $timeArr2[0];
		$preTime = $timeArr1[1];

		$hoursTimeArr = explode(":", $preTime);
		$preHours = $hoursTimeArr[0];
		$minutes = $hoursTimeArr[1];
		$seconds = $hoursTimeArr[2];

		if(intval($preHours) > 12 || intval($preHours) == 12){
            $hours = intval($preHours) - 12;

            if($hours == 0){
                    $hours = 12;
            }

            $suffix = "pm";
	    }else{
            $hours = intval($preHours);

            if($hours == 0){
                    $hours = 12;
            }
            
            $suffix = "am";
	    }

		$time = $hours . ":" . $minutes . " " . $suffix;
		$date = $month . "/" . $day . "/" . $year;
	}else{
		$time = "?";
		$date = "?";
	}
	if(isset($obj['file']) && $obj['file'] != "?"){
		$file = $obj['file'];
	}else{
		$file = "?";
	}
	if(isset($obj['fileType']) && $obj['fileType'] != "?"){
		$fileType = $obj['fileType'];
	}else{
		$fileType = "?";
	}
	if(isset($obj['tokenArr'])){
		$tokenArr = $obj['tokenArr'];
	}else{
		$tokenArr = "?";
	}
	if(isset($obj['msg']) && $obj['msg'] != "?"){
		$msg = $obj['msg'];
	}else{
		$msg = "Sent from acilos";
	}

	$msg = str_replace(" ", "+", $msg);

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

	$postID = uniqid();

	$saveTime = str_replace(" ", "+", $time);

	foreach($tokenArr as $key => $value){
		switch($key){
			case "facebook": 
				for($x = 0; $x < count($tokenArr[$key]); $x++){
					$leStuff = explode(":", $tokenArr[$key][$x]);

					if(isset($leStuff[0])){
						$access_token = $leStuff[0];
					}
					if(isset($leStuff[1])){
						$app_id = $leStuff[1];
					}
					if(isset($leStuff[2])){
						$user_id = $leStuff[2];
					}
					if(isset($leStuff[3])){
						$name = $leStuff[3];
					}

					$service = "facebook";

					$command = "php" . " $path" .  " $file" .  " $fileType" .  " $service" . " $msg" . " $server" . " $date" . " $saveTime" . " $access_token" . " $app_id" . " $user_id" . " $postID";

					$atCommand = "echo" . " \"$command\"" . " |" . " at" . " $time" . " $date";

					$atCommand = "$atCommand";

					$msgWithoutPlusSign = str_replace("+", " ", $msg);

					saveFacebookPost("", "scheduled", "pending", $postID, $file, $fileType, $msgWithoutPlusSign, $server, $access_token, $app_id, $user_id, $date, $time, $name);

					print_r($atCommand); ?><br/><?php

					exec($atCommand);
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
					if(isset($leStuff[4])){
						$user = $leStuff[4];
					}
					if(isset($leStuff[5])){
						$name = $leStuff[5];
					}

					$service = "twitter";

					$command = "php" . " $path" .  " $file" .  " $fileType" .  " $service" . " $msg" . " $server" . " $date" . " $saveTime" . " $access_token" . " $access_secret" . " $appKey" . " $appSecret" . " $postID";

					$atCommand = "echo" . " \"$command\"" . " |" . " at" . " $time" . " $date";

					$atCommand = "$atCommand";

					$msgWithoutPlusSign = str_replace("+", " ", $msg);

					saveTwitterPost("", "scheduled", "pending", $postID, $file, $fileType, $msgWithoutPlusSign, $server, $access_token, $access_secret, $appKey, $appSecret, $date, $time, $name);

					print_r($atCommand); ?><br/><?php

					exec($atCommand);
				}
			break;

			case "linkedin": 
				for($x = 0; $x < count($tokenArr[$key]); $x++){
					$leStuff = explode(":", $tokenArr[$key][$x]);
					if(isset($leStuff[0])){
						$access_token = $leStuff[0];
					}
					if(isset($leStuff[1])){
						$user = $leStuff[1];
					}
					if(isset($leStuff[2])){
						$name = $leStuff[2];
					}

					$service = "linkedin";

					$command = "php" . " $path" .  " $file" .  " $fileType" .  " $service" . " $msg" . " $server" . " $date" . " $saveTime" . " $access_token" . " $postID";

					$atCommand = "echo" . " \"$command\"" . " |" . " at" . " $time" . " $date";

					$atCommand = "$atCommand";

					$msgWithoutPlusSign = str_replace("+", " ", $msg);

					saveLinkedInPost("", "scheduled", "pending", $postID, $file, $fileType, $msgWithoutPlusSign, $server, $access_token, $date, $time, $name);

					print_r($atCommand); ?><br/><?php

					exec($atCommand);
				}
			break;

			case "instagram": 
				//Can't post to instagram without permission
			break;
		}
	}

	return json_encode(array("success" => "true"));
}



