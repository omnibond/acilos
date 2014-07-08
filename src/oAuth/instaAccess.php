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

session_start();

if(isset($_GET['code'])){
	$code = $_GET["code"];
	$state = $_GET["state"];
	
	$grant = "authorization_code";
	
	$credObj = file_get_contents($_SERVER['SERVICECREDS']);
	$credObj = json_decode($credObj, true);
	
	$app = $credObj['instagram'][0];
	$params = array(
		"client_id" => $app['key'],
		"client_secret" => $app['secret'],
		"redirect_uri" => $app['redir'],
		"code" => $code,
		"grant_type" => $grant,
	);
	$tempApp = $credObj['instagram'][0];

	$url = "https://api.instagram.com/oauth/access_token";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);

	$obj = json_decode($response, true);
	
	if($obj['access_token']){		
		$found = "false";
		$open = 0;
		//check all accounts for this user if there are accounts
		if(isset($tempApp['accounts']) && count($tempApp['accounts']) > 0){
			for($j=0; $j<count($tempApp['accounts']); $j++){
				if($tempApp['accounts'][$j]['user'] == $obj['user']['id'] && $tempApp['accounts'][$j]['loginDisallow'] == "false"){
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
					header('Location: ../login.php?error=1&service=instagram');
					return;
				}
			}
		}else{
			$j = 0;
		}
		
		if($credObj['login'] == "first"){
			$credObj['login'] = "second";
		}
					
		$temp['accessToken'] = $obj['access_token'];
		$temp['user'] = $obj['user']['id'];
		$temp['image'] = $obj['user']['profile_picture'];
		$temp['name'] =  $obj['user']['username'];
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
			$credObj['instagram'][0]['accounts'][$open] = $temp;
		}else{
			$credObj['instagram'][0]['accounts'][$j] = $temp;
		}
		
		file_put_contents($_SERVER['SERVICECREDS'], json_encode($credObj));
		$_SESSION['authed'] = true;
		header('Location: ../login.php?instagram=true');
	}else{
		//setting a cookie to an expired time will trigger removal by the browser
		setcookie ("instagramCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
		
		header('Location: ../login.php?error=2&service=instagram');
	}
}
	
?>
