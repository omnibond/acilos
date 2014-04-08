<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the redirect script that saves tokens and user data for logged in accounts to the app
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

require_once('../cron/logs/KLogger.php');

require_once('../vendor/autoload.php');
require_once('../cron/objects/authObject.php');

/* Start session and load library. */
session_start();
require_once('twitteroauth/twitteroauth.php');

if(isset($_GET['appKey']) && isset($_GET['appSecret'])){
	//$log->logInfo("$logPrefix got appKey and appSecret.");
	/* Build TwitterOAuth object with client credentials. */
	$connection = new TwitterOAuth($_GET['appKey'], $_GET['appSecret']);
	
	/* Get temporary credentials. */
	$request_token = $connection->getRequestToken($_GET['twitterRedirect']);
	
	/* Save temporary credentials to session. */
	$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];

	$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
	
	$array = array(
		"appKey" => $_GET['appKey'],
		"appSecret" => $_GET['appSecret'],
		"redirectURL" => $_GET['twitterRedirect'],
		"oauthToken" => $_SESSION['oauth_token'],
		"oauthSecret" => $_SESSION['oauth_token_secret'],
		"state" => $_GET['state']
	);
	//$log->logInfo("$logPrefix array contains ",$array);
	$json = json_encode($array);
	
	$filename = "twitterClientInfo.txt";
	//$log->logInfo("$logPrefix attempting to write array to $filename.");

	$fp = fopen($filename, 'w') or die("Cannot open the file " . $filename);
	fwrite($fp, $json);
	fclose($fp);
	//$log->logInfo("$logPrefix wrote array to $filename.");
	
	switch ($connection->http_code) {
	  case 200:
	    /* Build authorize URL and redirect user to Twitter. */
	    //$log->logInfo("$logPrefix http_code is 200.");
	    $url = $connection->getAuthorizeURL($token);
	    header('Location: ' . $url);
	    break;
	  default:
	  	//$log->logInfo("$logPrefix http_code is not 200.");
	    /* Show notification if something went wrong. */
	    echo 'Could not connect to Twitter. Refresh the page or try again later.';
	    print_r($connection);
	  break;
	}
}

if(isset($_REQUEST['oauth_verifier'])){

	$filename = "twitterClientInfo.txt";
	$file = file_get_contents($filename);

	$obj = json_decode($file, true);
	
	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$tempApp;
	for($g=0; $g<count($credObj['twitter']); $g++){
		if($credObj['twitter'][$g]['key'] == $obj['appKey']){
			$tempApp = $credObj['twitter'][$g];
			break;
		}
	}
	
	/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
	$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['oauthToken'], $obj['oauthSecret']);
	/* Request access tokens from twitter */
	$access_token = $connection->getAccessToken($_REQUEST['oauth_verifier']);

	$account = $connection->get('account/verify_credentials');
	
	if(isset($access_token['oauth_token'])){
		$obj['accessToken'] = $access_token['oauth_token'];
		$obj['accessSecret'] = $access_token['oauth_token_secret'];
		
		$found = "false";
		$open = 0;
		//check all accounts for this user if there are accounts
		if(isset($tempApp['accounts']) && count($tempApp['accounts']) > 0){
			for($j=0; $j<count($tempApp['accounts']); $j++){
				if($tempApp['accounts'][$j]['user'] == $account->id && $tempApp['accounts'][$j]['loginDisallow'] == "false"){
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
				if($obj['state'] == "outside" && $credObj['login'] !== "first"){
					header('Location: ../login.php?error=1&service=twitter');
					return;
				}
			}
		}else{
			$j = 0;
		}
		
		if($credObj['login'] == "first"){
			$credObj['login'] = "second";
		}
					
		$temp['accessToken'] = $access_token['oauth_token'];
		$temp['accessSecret'] = $access_token['oauth_token_secret'];
		$temp['key'] = $obj['appKey'];
		$temp['secret'] = $obj['appSecret'];
		$temp['expiresAt'] = `date +%s`;
		$temp['user'] = $account->id;
		$temp['image'] = $account->profile_image_url;
		$temp['name'] = $account->screen_name;
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
			$credObj['twitter'][0]['accounts'][$open] = $temp;
		}else{
			$credObj['twitter'][0]['accounts'][$j] = $temp;
		}
		
		file_put_contents("../serviceCreds.json", json_encode($credObj));
		
		header('Location: ../login.php?twitter=true');
	}else{
		setcookie ("facebookCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
		
		header('Location: ../login.php?error=2&service=twitter');
	}	
}

?>
