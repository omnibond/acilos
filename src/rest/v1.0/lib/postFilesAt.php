<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to posting using the linux at command
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

require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('authCalls.php');

//function postFilesAt(){
	/*$fileName = $argv[1];
	$fileType = $argv[2];
	$service = $argv[3];
	$msg = $argv[4];*/

	$saveObject = array();

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

	if(isset($argv[6]) && $argv[6] !== "?"){
		$date = $argv[6];
	}else{
		$date = "";
	}

	if(isset($argv[7]) && $argv[7] !== "?"){
		$time = str_replace("+", " ", $argv[7]);
	}else{
		$time = "";
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
	
	if($service == "facebook"){
		if(isset($argv[8])){
			$access_token = $argv[8];
		}else{
			$access_token = "";
		}
		if(isset($argv[9])){
			$app_id = $argv[9];
		}else{
			$app_id = "";
		}
		if(isset($argv[10])){
			$user_id = $argv[10];
		}else{
			$user_id = "";
		}
		if(isset($argv[11])){
			$postID = $argv[11];
		}
		if(isset($argv[12])){
			$name = $argv[12];
		}

		$saveObject['fileName'] = $fileName;
		$saveObject['fileType'] = $fileType;
		$saveObject['service'] = $service;
		$saveObject['msg'] = $msg;
		$saveObject['server'] = $server;
		$saveObject['facebook'] = array();
		$saveObject['facebook']['access_token'] = $access_token;
		$saveObject['facebook']['app_id'] = $app_id;
		$saveObject['facebook']['user_id'] = $user_id;
		$saveObject['date'] = $date;
		$saveObject['time'] = $time;
		$saveObject['name'] = $name;

		$photoURL = 'https://graph.facebook.com/me/photos?access_token='.$access_token;

		$statusURL = 'https://graph.facebook.com/me/feed';

		if($fileName == ""){
			$url = $statusURL;
		}else{
			$url = $photoURL;
		}

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

		for($faceCounter = 0; $faceCounter < 3; $faceCounter++){
			$saveObject = postToFacebook($url, $params, $saveObject, $name);

			if(isset($saveObject['facebook'])){
				if(isset($saveObject['facebook']['response'])){
					if(isset($saveObject['facebook']['response']['success'])){
						break;
					}
				}else{
					$saveObject['facebook']['response'] = array("failure" => "true", "msg" => "The Facebook status for " . $name . " could not be posted --> no response from Facebook");
				}
			}else{
				$saveObject['facebook']['response'] = array("failure" => "true", "msg" => "The Facebook status for " . $name . " could not be posted --> no response from Facebook");
			}
		}

		$saveObject['facebook']['faceCounter'] = $faceCounter;
	}

	if($service == "linkedin"){
		if(isset($argv[8])){
			$access_token = $argv[8];
		}else{
			$access_token = "";
		}
		if(isset($argv[9])){
			$postID = $argv[9];
		}
		if(isset($argv[10])){
			$name = $argv[10];
		}

		$saveObject['fileName'] = $fileName;
		$saveObject['fileType'] = $fileType;
		$saveObject['service'] = $service;
		$saveObject['msg'] = $msg;
		$saveObject['server'] = $server;
		$saveObject['linkedin'] = array();
		$saveObject['linkedin']['access_token'] = $access_token;
		$saveObject['date'] = $date;
		$saveObject['time'] = $time;
		$saveObject['name'] = $name;

		$headerOptions = array(
			"Content-Type: text/xml;charset=utf-8"
		);

		$imageURL = $server . 'app/post/tmpUpload/' . $fileName;
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

		$wallUrl = 'https://api.linkedin.com/v1/people/~/person-activities?oauth2_access_token='. $access_token;

		if($fileName == ""){
			$url = $wallUrl;
			$xml = $wallXML;
		}else{
			$url = $shareUrl;
			$xml = $shareXML;
		}

		for($linkCounter = 0; $linkCounter < 3; $linkCounter++){
			$saveObject = postToLinkedIn($url, $xml, $headerOptions, $saveObject, $name);

			if(isset($saveObject['linkedin'])){
				if(isset($saveObject['linkedin']['response'])){
					if(isset($saveObject['linkedin']['response']['success'])){
						break;
					}
				}else{
					$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted --> no response from LinkedIn");
				}
			}else{
				$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted --> no response from LinkedIn");
			}
		}

		$saveObject['linkedin']['linkCounter'] = $linkCounter;
	}

	if($service == "twitter"){
		if(isset($argv[8])){
			//accessToken
			$access_token = $argv[8];
		}else{
			$access_token = "";
		}
		if(isset($argv[9])){
			//accessSecret
			$access_secret = $argv[9];
		}else{
			$access_secret = "";
		}
		if(isset($argv[10])){
			//key
			$appKey = $argv[10];
		}else{
			$appKey = "";
		}
		if(isset($argv[11])){
			//secret
			$appSecret = $argv[11];
		}else{
			$appSecret = "";
		}
		if(isset($argv[12])){
			$postID = $argv[12];
		}
		if(isset($argv[13])){
			$name = $argv[13];
		}

		$saveObject['fileName'] = $fileName;
		$saveObject['fileType'] = $fileType;
		$saveObject['service'] = $service;
		$saveObject['msg'] = $msg;
		$saveObject['server'] = $server;
		$saveObject['twitter'] = array();
		$saveObject['twitter']['access_token'] = $access_token;
		$saveObject['twitter']['access_secret'] = $access_secret;
		$saveObject['twitter']['appKey'] = $appKey;
		$saveObject['twitter']['appSecret'] = $appSecret;
		$saveObject['date'] = $date;
		$saveObject['time'] = $time;
		$saveObject['name'] = $name;

		$path = $thing . "app/post/tmpUpload/" . $fileName;

		if($fileName != ""){
			$url = 'statuses/update_with_media';
			$stuff = array('status' => $msg, "media[]" => "@"."{$path}");
		}else{
			$url = 'statuses/update';
			$stuff = array('status' => $msg);
		}

		for($twitterCounter = 0; $twitterCounter < 3; $twitterCounter++){
			$saveObject = postToTwitter($appKey, $appSecret, $access_token, $access_secret, $url, $stuff, $saveObject, $name);
			if(isset($saveObject['twitter'])){
				if(isset($saveObject['twitter']['response'])){
					if(isset($saveObject['twitter']['response']['success'])){
						break;
					}
				}else{
					$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "The Twitter status for " . $name . " could not be posted --> no response from Twitter");
				}
			}else{
				$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "The Twitter status for " . $name . " could not be posted --> no response from Twitter");
			}
		}

		$saveObject['twitter']['twitterCounter'] = $twitterCounter;
	}

	//print_R($saveObject);

	try{
		$fileObj = file_get_contents("../../private/config/postLog.json");
		$fileObj = json_decode($fileObj, true);

		if(isset($fileObj[$postID])){
			if(isset($saveObject['facebook'])){
				$fileObj[$postID]['facebook'] = $saveObject['facebook'];

				$fileObj[$postID]['postStatus'] = "completed";
			}

			if(isset($saveObject['linkedin'])){
				$fileObj[$postID]['linkedin'] = $saveObject['linkedin'];

				$fileObj[$postID]['postStatus'] = "completed";
			}

			if(isset($saveObject['twitter'])){
				$fileObj[$postID]['twitter'] = $saveObject['twitter'];

				$fileObj[$postID]['postStatus'] = "completed";
			}
		}else{
			$fileObj[$postID] = $saveObject;
		}

		file_put_contents("../../private/config/postLog.json", json_encode($fileObj));
	}catch (Exception $e){
		$fileObj[$postID] = $saveObject;
		file_put_contents("../../private/config/postLog.json", json_encode($fileObj));
	}	

	//print_r(json_encode(array("returnArray" => $returnArray)));

	//get rid of the file after we try and do something with it
	if(isset($fileName) && $fileName != ""){
		//unlink("../../app/post/tmpUpload/" . $fileName);
	}

	function postToFacebook($url, $params, $saveObject, $name){
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);

		//print_r($response);
					
		if(isset($response)){
			$res = json_decode($response, true);
		}else{
			$saveObject['facebook']['response'] = array("failure" => 'true', "msg" => "The Facebook status for " . $name . " could not be posted --> no response from Facebook");

			return $saveObject;
		}

		if(isset($res)){
			if(isset($res['error'])){
				$saveObject['facebook']['response'] = array("failure" => 'true', "msg" => "The Facebook status for " . $name . " could not be posted --> " . $res['error']['message']);

				return $saveObject;
			}else{
				$saveObject['facebook']['response'] = array("success" => 'true', "msg" => "The Facebook status for " . $name . " was posted successfully");

				return $saveObject;
			}
		}else{
			$saveObject['facebook']['response'] = array("failure" => 'true', "msg" => "The Facebook status for " . $name . " could not be posted --> no response from Facebook");

			return $saveObject;
		}
	}

	function postToLinkedIn($url, $xml, $headerOptions, $saveObject, $name){
		$ch2 = curl_init($url);
		curl_setopt($ch2, CURLOPT_POST, 1);
		curl_setopt($ch2, CURLOPT_POSTFIELDS, $xml);
		curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch2, CURLOPT_HTTPHEADER, $headerOptions);
		$response = curl_exec($ch2);
		$code = curl_getinfo($ch2, CURLINFO_HTTP_CODE);

		curl_close($ch2);

		if(isset($response)){
			$xml = simplexml_load_string($response);
		}else{
			$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted --> no response from LinkedIn");

			return $saveObject;
		}

		if($code == "201"){
			$saveObject['linkedin']['response'] = array("success" => "true", "msg" => "The LinkedIn status for " . $name . " was posted successfully");

			return $saveObject;
		}else{
			if(isset($xml)){
				$xml = (array)($xml);
				if(isset($xml['error-code'])){
					$linkCode = $xml['error-code'];
					if($linkCode == "0"){
						$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted --> " . $xml['message']);

						return $saveObject;
					}else{
						$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted --> " . $xml['message']);

						return $saveObject;
					}
				}
			}else{
				$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "The LinkedIn status for " . $name . " could not be posted --> no response from LinkedIn");

				return $saveObject;
			}
		}
	}

	function postToTwitter($appKey, $appSecret, $access_token, $access_secret, $url, $stuff, $saveObject, $name){
		$connection = new TwitterOAuth($appKey, $appSecret, $access_token, $access_secret);

		if(isset($connection)){
			$status = $connection->upload($url, $stuff);
		}else{
			$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "Your Twitter status could not be posted - no response from Twitter");

			return $saveObject;
		}

		//print_r($status);

		if(isset($status)){
			if(isset($status->errors[0]->message)){
				$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "The Twitter status for " . $name . " could not be posted --> " . $status->errors[0]->message);

				return $saveObject;
			}else{
				$saveObject['twitter']['response'] =  array("success" => "true", "msg" => "The Twitter status for " . $name . " was posted successfully");

				return $saveObject;
			}
		}else{
			$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "The Twitter status for " . $name . " could not be posted --> no response from Twitter");

			return $saveObject;
		}
	}
//}

//postFilesAt();