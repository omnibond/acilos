<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the redirect script that saves tokens and user data for logged in accounts to the app
** This is DEPRECATED
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
require_once 'Google/Client.php';
require_once 'Google/Service/Plus.php';

if(isset($_GET['apiKey']) && isset($_GET['secretKey']) && isset($_GET['redirect_uri'])){

$client = new Google_Client();
$client->setClientId($_GET['apiKey']);
$client->setClientSecret($_GET['secretKey']);
$client->setRedirectUri($_GET['redirect_uri']);
$client->setAccessType('offline');
//need this line to get a new refresh token
//$client->setApprovalPrompt('force');
$scopeArr = explode(",", $_GET['scope']);
$client->setScopes($scopeArr);

$param = array(
	"apiKey" => $_GET['apiKey'],
	"secretKey" => $_GET['secretKey'],
	"redirect_uri" => $_GET['redirect_uri'],
	'scope' => $_GET['scope'],
	'state' => $_GET['state']
);

$obj = json_encode($param);

$filename = "googleStep1.txt";
$fp = fopen($filename, 'w') or die("Cannot open file " . $filename);
fwrite($fp, $obj);
fclose($fp);

/*
$client->addScope('https://www.googleapis.com/auth/plus.stream.read');
$client->addScope('https://www.googleapis.com/auth/plus.stream.write');
$client->addScope('https://www.googleapis.com/auth/plus.media.upload');
$client->addScope('https://www.googleapis.com/auth/plus.me');
$client->addScope('https://www.googleapis.com/auth/plus.circles.read');
$client->addScope('https://www.googleapis.com/auth/plus.circles.write');
*/

$authUrl = $client->createAuthUrl();
header('Location: ' . $authUrl);

}

if(isset($_GET['code'])) {
	$file = file_get_contents("googleStep1.txt");
	$json =json_decode($file, true);
	
	$client = new Google_Client();
	$client->setClientId($json['apiKey']);
	$client->setClientSecret($json['secretKey']);
	$client->setRedirectUri($json['redirect_uri']);
	$client->setAccessType('offline');	
	$scopeArr = explode(",", $json['scope']);
	$client->setScopes($scopeArr);
	
	$plus = new Google_Service_Plus($client);
	
	$client->authenticate($_GET['code']);
	$token = '';
	$tok = $client->getAccessToken();
	$token = json_decode($tok, true);
	$state = $json['state'];
	
	print_r($token);
	
	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	$tempApp = $credObj['google'][0];
	
	$me = $plus->people->get('me');
	
	$id = $me['id'];
	$img = filter_var($me['image']['url'], FILTER_VALIDATE_URL);
	$name = filter_var($me['displayName'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
	
	if(isset($token['access_token'])){
		$found = "false";
		$open = 0;
		//check all accounts for this user if there are accounts
		if(isset($tempApp['accounts']) && count($tempApp['accounts']) > 0){
			for($j=0; $j<count($tempApp['accounts']); $j++){
				if($tempApp['accounts'][$j]['user'] == $id && $tempApp['accounts'][$j]['loginDisallow'] == "false"){
					//if we find the user $temp is now that user
					$temp = $tempApp['accounts'][$j];
					$found = "true";
					break;
				}
				if($tempApp['accounts'][$j]['authenticated'] == "false"){
					$open = $j;
				}
			}
			//if we loop through everyone and done find the user
			if($found == "false"){
				if($state == "outside" && $credObj['login'] !== "first"){
					header('Location: ../login.php?error=1&service=google');
					return;
				}
			}
		}else{
			$j = 0;
		}
		
		if($credObj['login'] == "first"){
			$credObj['login'] = "second";
		}
					
		if(isset($token['refresh_token'])){
			$temp['refreshToken'] = $token['refresh_token'];
		}
		$temp['accessToken'] = $token['access_token'];
		$temp['expiresAt'] = $token['created'] + $token['expires_in'];
		$temp['user'] = $id;
		$temp['image'] = $img;
		$temp['name'] =  $name;
		$temp['authenticated'] = "true";
		if(!isset($temp['loginDisallow'])){
			$temp['loginDisallow'] = $tempApp['accounts'][$open]['loginDisallow'];
		}
		if(!isset($temp['color'])){
			$temp['color'] = $tempApp['accounts'][$open]['color'];
		}
		if(!isset($temp['uuid'])){
			$temp['uuid'] = $tempApp['accounts'][$open]['uuid'];
		}
		
		if($found == "false"){
			$credObj['google'][0]['accounts'][$open] = $temp;
		}else{
			$credObj['google'][0]['accounts'][$j] = $temp;
		}
		file_put_contents("../serviceCreds.json", json_encode($credObj));
		
		header('Location: ../login.php?google=true');
	}else{
		setcookie ("googleCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
		
		header('Location: ../login.php?error=2&service=google');
	}
	
}

function refreshGoogToken($uuid){
	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$obj = $credObj['google'][0]['accounts'];
	
	$found = "false";
	for($d = 0; $d < count($obj); $d++){
		if($uuid = $obj[$d]['uuid']){
			$acct = $obj[$d];
			$found = "true";
			break;
		}
	}
	
	if($found == "false"){
		return "User account was not found";
	}
	
	$params = array(
		"refresh_token" => $acct['refreshToken'],
		"client_id" => $credObj['google'][0]['key'],
		"client_secret" => $credObj['google'][0]['secret'],
		"grant_type" => 'refresh_token'
	);
	
	$url = "https://accounts.google.com/o/oauth2/token";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	#here is a new access_token object minues the refresh_token, so add it and then write to the file
	$response = curl_exec($ch);		
	curl_close($ch);
	
	#the decode true param turns them into assoc arrays, 
	#decode to add the refresh token to the object
	$obj = json_decode($response, true);
	
	$credObj['google'][0]['accounts'][$d]['accessToken'] = $obj['access_token'];
	
	file_put_contents("../serviceCreds.json", json_encode($credObj));
}

function getTokenStatus($uuid){
	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$obj = $credObj['google'][0]['accounts'];
	
	$found = "false";
	for($d = 0; $d < count($obj); $d++){
		if($uuid = $obj[$d]['uuid']){
			$acct = $obj[$d];
			$found = "true";
			break;
		}
	}
	
	if($found == "false"){
		return "User account was not found";
	}

	$url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='.$acct['accessToken'];
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$res = curl_exec($ch);
	curl_close($ch);
	
	print_r("Token Status: " . $res); ?><br/><?php
}

?>