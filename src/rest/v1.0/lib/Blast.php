<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to queries for Blasting posts
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

class Blast{

	function downloadImage(){
		$var = file_get_contents("php://input");
		$imgURL = json_decode($var, true);
		
		if(isset($imgURL['imgName'])){
			$imgName = $imgURL['imgName'];
		}else{
			$imgName = '';
		}
		if(isset($imgURL['url'])){
			$url = $imgURL['url'];
		}else{
			$url = '';
		}
		
		if($url == '' || $imgName == ''){
			return;
		}
		
		$path = "../../app/post/tmpUpload/" . $imgName;
		
		$file = fopen ($url, "rb");
		if ($file) {
			$newf = fopen ($path, "wb");

			if ($newf){
				while(!feof($file)) {
					fwrite($newf, fread($file, 1024 * 8 ), 1024 * 8 );
				}
			}
		}

		if ($file) {
			fclose($file);
		}

		if ($newf) {
			fclose($newf);
		}
	}
	
	function blastFiles(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		if(isset($varObj['msg'])){
			$msg = $varObj['msg'];
		}else{
			$msg = "Posted from acilos";
		}

		if(isset($varObj['tokenArr'])){
			$tokenArr = $varObj['tokenArr'];
		}else{
			$tokenArr = "";
		}

		if(isset($varObj['file']) && $varObj['file'] != ""){
			$fileName = $varObj['file'];
		}else{
			$fileName = "";
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
						
						#print_r($response);
						
						curl_close($ch2);
						
						if(isset($code)){
							if($code == "201"){
								$returnArray['linkedinSuccess'] = "Your LinkedIn message was posted successfully";
							}else{
								$returnArray['linkedinFailure'] = "Your LinkedIn message could not be posted: " . $response;
							}
						}
						return json_encode($returnArray);
					}

					break;
				default:
					//woops
					break;
			}
		}
	}
}

?>
