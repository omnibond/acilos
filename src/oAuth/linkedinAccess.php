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

require_once('../vendor/autoload.php');
require_once('../cron/objects/authObject.php');

session_start();


// OAuth 2 Control Flow
if (isset($_GET['error'])) {
    print $_GET['error'] . ': ' . $_GET['error_description'];
    exit;
} elseif (isset($_GET['code'])) {
    if ($_SESSION['state'] == $_GET['state']) {
        getAccessToken();
    } else {
        // CSRF attack? Or did you mix up your states?
        exit;
    }
} else { 
    if (isset($_GET['apiKey']) && isset($_GET['secretKey']) && isset($_GET['lredirect_uri']) && isset($_GET['scope'])) {
      
      $param = array(
		"apiKey" => $_GET['apiKey'],
		"secretKey" => $_GET['secretKey'],
		"lredirect_uri" => $_GET['lredirect_uri'],
		"color" => $_GET['color']
	);

	$obj = json_encode($param);
	
	$filename = "linkedinStep1.txt";
	$fp = fopen($filename, 'w') or die("Cannot open file " . $filename);
	fwrite($fp, $obj);
	fclose($fp);
        getAuthorizationCode();
    }
}
 
function getAuthorizationCode() {
	$params = array(
		'response_type' => 'code',
		'client_id' => $_GET['apiKey'],
		'scope' => $_GET['scope'],
		'state' => 'MYstateSTRING',
		'redirect_uri' => $_GET['lredirect_uri']
	);
 
    // Authentication request
    $url = 'https://www.linkedin.com/uas/oauth2/authorization?' . http_build_query($params);
    // Needed to identify request when it returns to us
    $_SESSION['state'] = $params['state'];

    // Redirect user to authenticate
    header("Location: $url");
    exit;
}
     
function getAccessToken() {
	$file = file_get_contents("linkedinStep1.txt");
	$json =json_decode($file, true);

	$params = array(
		'grant_type' => 'authorization_code',
		'client_id' => $json['apiKey'],
		'client_secret' => $json['secretKey'],
		'code' => $_GET['code'],
		'redirect_uri' => $json['lredirect_uri'],
	);
     
	// Access Token request
	$url = 'https://www.linkedin.com/uas/oauth2/accessToken?' . http_build_query($params);

	$context = stream_context_create(array(
		'http' => array(
			'method' => 'POST',
		)
	));

	// Retrieve access token information
	$response = file_get_contents($url, false, $context);
 
    // Native PHP object, please
    $token = json_decode($response);
	
    $user = fetch('GET', '/v1/people/~:(id,first-name,last-name,picture-url)', $token->access_token);
	
    if(isset($token->access_token)){

	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$temp;
	for($g=0; $g<count($credObj['linkedin']); $g++){
		if($credObj['linkedin'][$g]['key'] == $json['apiKey']){
			$temp = $credObj['linkedin'][$g];
			break;
		}
	}
	
	//if the id is not empty then check it
	if(isset($temp['user'])){
		//if the ids do not match
		if($temp['user'] != $user->id){
			//you are not the correct facebook user
			header('Location: ../login.php?error=1&service=linkedin');
			//just to be safe return here
			return;
		}
	}
	
	if($credObj['login'] == "first"){
		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php");
		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php");
		$credObj['login'] = "second";
	}
	if($credObj['login'] == ""){
		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php");
		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php");
		$credObj['login'] = "first";
	}
				
	$temp['accessToken'] = $token->access_token;
	$temp['expiresAt'] = `date +%s` + $token->expires_in;
	$temp['user'] = $user->id;
	$temp['image'] = $user->pictureUrl;
	$temp['name'] = $user->firstName . " " . $user->lastName;
	
	$credObj['linkedin'][$g] = $temp;
	
	file_put_contents("../serviceCreds.json", json_encode($credObj));
	
	header('Location: ../login.php?linkedin=true');
    }else{
	//setting a cookie to an expired time will trigger removal by the browser
	setcookie ("linkedinCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
	
	header('Location: ../login.php?error=2&service=linkedin');
    }	
}
 
function fetch($method, $resource, $token, $body = '') {
    $params = array('oauth2_access_token' => $token,
                    'format' => 'json',
              );
     
    // Need to use HTTPS
    $url = 'https://api.linkedin.com' . $resource . '?' . http_build_query($params);
    // Tell streams to make a (GET, POST, PUT, or DELETE) request
    $context = stream_context_create(
                    array('http' => 
                        array('method' => $method,
                        )
                    )
                );
 
 
    // Hocus Pocus
    $response = file_get_contents($url, false, $context);
 
    // Native PHP object, please
    return json_decode($response);
}