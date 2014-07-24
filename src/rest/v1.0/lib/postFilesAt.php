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
		if(isset($argv[9])){
			$postID = $argv[9];
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

		$photoURL = 'https://graph.facebook.com/me/photos?access_token='.$access_token;

		$statusURL = 'https://graph.facebook.com/me/feed';

		if($fileName == ""){
			$url = $statusURL;
		}else{
			$url = $photoURL;
		}

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

		//print_r($response);
					
		if(isset($response))	{
			$res = json_decode($response, true);
		}else{
			$saveObject['facebook']['response'] = array("failure" => 'true', "msg" => "Your Facebook status could not be posted - no response from Facebook");
		}

		if(isset($res)){
			if(isset($res['error'])){
				$saveObject['facebook']['response'] = array("failure" => 'true', "msg" => "Your Facebook status could not be posted - " . $res['error']['message']);
			}else{
				$saveObject['facebook']['response'] = array("success" => 'true', "msg" => "Your Facebook status was posted successfully");
			}
		}else{
			$saveObject['facebook']['response'] = array("failure" => 'true', "msg" => "Your Facebook status could not be posted - no response from Facebook");
		}
	}

	if($service == "linkedin"){
		if(isset($argv[6])){
			$access_token = $argv[6];
		}else{
			$access_token = "";
		}
		if(isset($argv[7])){
			$postID = $argv[7];
		}

		$saveObject['fileName'] = $fileName;
		$saveObject['fileType'] = $fileType;
		$saveObject['service'] = $service;
		$saveObject['msg'] = $msg;
		$saveObject['server'] = $server;
		$saveObject['linkedin'] = array();
		$saveObject['linkedin']['access_token'] = $access_token;

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
			$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "Your LinkedIn update could not be posted - no response from LinkedIn.");
		}

		if($code == "201"){
			$saveObject['linkedin']['response'] = array("success" => "true", "msg" => "Your LinkedIn status was posted successfully");
		}else{
			if(isset($xml)){
				$xml = (array)($xml);
				if(isset($xml['error-code'])){
					$linkCode = $xml['error-code'];
					if($linkCode == "0"){
						$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "Your LinkedIn update could not be posted - Status is a duplicate.");
					}else{
						$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "Your LinkedIn update could not be posted - " . $xml['message']);
					}
				}
			}else{
				$saveObject['linkedin']['response'] = array("failure" => "true", "msg" => "Your LinkedIn update could not be posted - no response from LinkedIn.");
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
		if(isset($argv[10])){
			$postID = $argv[10];
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

		$path = $thing . "app/post/tmpUpload/" . $fileName;

		$connection = new TwitterOAuth($appKey, $appSecret, $access_token, $access_secret);

		if($fileName != ""){
			$url = 'statuses/update_with_media';
			$stuff = array('status' => $msg, "media[]" => "@"."{$path}");
		}else{
			$url = 'statuses/update';
			$stuff = array('status' => $msg);
		}

		if(isset($connection)){
			$status = $connection->upload($url, $stuff);
		}else{
			$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "Your Twitter status could not be posted - no response from Twitter");
		}

		//print_r($status);

		if(isset($status)){
			if(isset($status->errors[0]->message)){
				$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "Your Twitter status could not be posted - " . $status->errors[0]->message);
			}else{
				$saveObject['twitter']['response'] =  array("success" => "true", "msg" => "Your Twitter status was posted successfully");
			}
		}else{
			$saveObject['twitter']['response'] =  array("failure" => "true", "msg" => "Your Twitter status could not be posted - no response from Twitter");
		}
	}

	print_R($saveObject);

	try{
		$fileObj = file_get_contents("../../private/config/postLog.json");
		$fileObj = json_decode($fileObj, true);

		if(isset($fileObj[$postID])){
			if(isset($saveObject['facebook'])){
				$fileObj[$postID]['facebook'] = $saveObject['facebook'];

				if(isset($saveObject['facebook']['response'])){
					if(isset($saveObject['facebook']['response']['failure'])){
						$fileObj[$postID]['facebook']['result'] = 'failure';
					}
				}
			}

			if(isset($saveObject['linkedin'])){
				$fileObj[$postID]['linkedin'] = $saveObject['linkedin'];

				if(isset($saveObject['linkedin']['response'])){
					if(isset($saveObject['linkedin']['response']['failure'])){
						$fileObj[$postID]['linkedin']['result'] = 'failure';
					}
				}
			}

			if(isset($saveObject['twitter'])){
				$fileObj[$postID]['twitter'] = $saveObject['twitter'];

				if(isset($saveObject['twitter']['response'])){
					if(isset($saveObject['twitter']['response']['failure'])){
						$fileObj[$postID]['twitter']['result'] = 'failure';
					}
				}
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
//}

//postFilesAt();